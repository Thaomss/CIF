import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpDown, CalendarDays, Check, ChevronDown, ChevronRight, CircleCheck, Dog, Hash, Home,
  KeyRound, LogOut, Map as MapIcon, MapPin, MessageSquare, Phone, Plus, RefreshCw, Search, Sparkles,
  Tag, Trash2, Upload, Wallet, Wifi, X, AlertTriangle, UsersRound, Printer, SlidersHorizontal, Eye, ClipboardCheck,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { hasSupabase, supabase } from './supabase'
import type { ArrivalDay, CallStatus, CheckType, FrontDayRow, Profile, Reservation, ReservationCheck } from './types'

const TECHNICAL_DOMAIN = 'camping.local'
const FRONT_CHECK_CODES = ['key_sticker', 'dog', 'plan', 'bracelets', 'verification'] as const
const statusLabels: Record<CallStatus, string> = {
  a_appeler: 'À appeler', message_laisse: 'Message laissé', a_rappeler: 'À rappeler', attente_client: 'En attente client', termine: 'Terminé', cif_pas_possible: 'CIF pas possible',
}
const statusClass: Record<CallStatus, string> = {
  a_appeler: 'amber', message_laisse: 'purple', a_rappeler: 'orange', attente_client: 'blue', termine: 'green', cif_pas_possible: 'red',
}

function normalizeHeader(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ')
}
function getCell(row: Record<string, unknown>, names: string[]) {
  const normalized = names.map(normalizeHeader)
  const found = Object.keys(row).find((key) => normalized.includes(normalizeHeader(key)))
  return found ? row[found] : ''
}
function numberValue(value: unknown) {
  if (typeof value === 'number') return value
  return Number(String(value).replace(/\s/g, '').replace(',', '.')) || 0
}
function reservationNumberValue(value: unknown) {
  let normalized = ''
  if (typeof value === 'number' && Number.isFinite(value)) normalized = Math.trunc(value).toString()
  else normalized = String(value ?? '').trim().replace(/^['"]|['"]$/g, '').replace(/\s+/g, '').replace(/\.0+$/, '')
  if (/^\d+(?:\.\d+)?e[+-]?\d+$/i.test(normalized)) {
    const scientific = Number(normalized)
    if (Number.isSafeInteger(scientific)) normalized = Math.trunc(scientific).toString()
  }
  if (/^\d+$/.test(normalized) && normalized.length >= 10 && normalized.length < 14) normalized = normalized.padStart(14, '0')
  return normalized
}
type ImportReservation = Pick<Reservation, 'arrival_day_id' | 'reservation_number' | 'firstname' | 'lastname' | 'booking_channel' | 'remaining_amount' | 'accommodation_type' | 'pitch' | 'is_last_minute' | 'source'>
function parseWorkbook(buffer: ArrayBuffer, arrivalDayId: string) {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: true })
  const unique = new Map<string, ImportReservation>()
  raw.filter((row) => Object.values(row).some(Boolean)).forEach((row, index) => {
    const number = String(getCell(row, ['Reservation Number', 'Numéro de réservation', 'Numero de reservation'])).trim() || `MANQUANT-${index + 1}`
    unique.set(number, {
      arrival_day_id: arrivalDayId,
      reservation_number: number,
      firstname: String(getCell(row, ['Customer First Name', 'Prénom', 'Prenom'])).trim() || null,
      lastname: String(getCell(row, ['Customer Last Name', 'Nom'])).trim() || null,
      booking_channel: String(getCell(row, ['Distribution Channel', 'Canal de distribution'])).trim() || null,
      remaining_amount: numberValue(getCell(row, ['Customer Due Amount', 'Montant restant'])),
      accommodation_type: String(getCell(row, ['Accommodation Type', 'Type d hébergement', 'Type hébergement'])).trim() || null,
      pitch: String(getCell(row, ['Unit Name', 'Emplacement'])).trim() || null,
      is_last_minute: false,
      source: 'import',
    })
  })
  return [...unique.values()]
}

type CleanImportRow = {
  reservation_number: string
  clean_status: string | null
  firstname: string | null
  lastname: string | null
  accommodation_type: string | null
  pitch: string | null
}
type CleanImportResult = {
  rows: CleanImportRow[]
  hasCleaningStatuses: boolean
  unknownStatuses: string[]
  multiReservationCount: number
}
type CleanColumnKey = 'reservation' | 'firstname' | 'lastname' | 'pitch' | 'cleaning' | 'accommodation'
type CleanColumnMap = Record<CleanColumnKey, number>

const cleanColumnHeaders: Record<CleanColumnKey, readonly string[]> = {
  reservation: [
    'Reservation Number', 'Numéro de réservation', 'Numero de reservation', 'Reservation No', 'Booking Number',
    'N° réservation', 'N° de réservation', 'No réservation', 'Num reservation', 'N° résa', 'Numero resa', 'Reservation #',
  ],
  firstname: ['Customer First Name', 'Prénom', 'Prenom', 'First Name', 'Firstname', 'Client First Name'],
  lastname: ['Customer Last Name', 'Nom', 'Last Name', 'Lastname', 'Client Last Name'],
  pitch: ['Unit Name', 'Emplacement', 'Pitch', 'Unit', 'Numéro emplacement', 'Numero emplacement', 'N° emplacement'],
  cleaning: [
    'Cleaning Status', 'Statut nettoyage', 'Etat nettoyage', 'État nettoyage', 'Cleaning', 'Cleaning State',
    'Housekeeping Status', 'Etat du cleaning', 'État du cleaning',
  ],
  accommodation: ['Accommodation Type', 'Type d hébergement', 'Type hébergement', 'Accommodation', 'Hébergement', 'Hebergement'],
}

const cleanStatusMap: Record<string, string> = {
  CLEAN: 'clean',
  CLEANED: 'clean',
  READY: 'clean',
  READY_TO_USE: 'clean',
  OK: 'clean',
  TO_BE_CLEANED: 'to_be_cleaned',
  NOT_CLEAN: 'to_be_cleaned',
  DIRTY: 'to_be_cleaned',
  WAITING_CLEANING: 'to_be_cleaned',
  IN_PROGRESS: 'in_progress',
  CLEANING: 'in_progress',
  CLEANING_IN_PROGRESS: 'in_progress',
  POSTPONED: 'postponed',
  DELAYED: 'postponed',
  TO_BE_CHECKED: 'to_be_checked',
  TO_CHECK: 'to_be_checked',
  CHECK_REQUIRED: 'to_be_checked',
  CHECKED: 'clean',
  TOUCH_UP: 'touch_up',
  OCCUPIED_CLEAN: 'occupied_clean',
  OCCUPIED_AND_CLEAN: 'occupied_clean',
  PROPRE: 'clean',
  A_NETTOYER: 'to_be_cleaned',
  NON_PROPRE: 'to_be_cleaned',
  EN_COURS: 'in_progress',
  NETTOYAGE_EN_COURS: 'in_progress',
  REPORTE: 'postponed',
  A_CONTROLER: 'to_be_checked',
  A_VERIFIER: 'to_be_checked',
  RETOUCHE: 'touch_up',
  OCCUPE_PROPRE: 'occupied_clean',
}
const knownCleanStatuses = new Set<string>([
  'non_renseigne', 'propre', 'non_propre', 'en_cours', 'a_controler',
  ...Object.values(cleanStatusMap),
])

function findHeaderIndex(headers: unknown[], aliases: readonly string[]) {
  const normalizedAliases = new Set(aliases.map(normalizeHeader))
  const compactAliases = new Set([...normalizedAliases].map((alias) => alias.replace(/\s+/g, '')))
  return headers.findIndex((header) => {
    const normalized = normalizeHeader(String(header ?? ''))
    return normalizedAliases.has(normalized) || compactAliases.has(normalized.replace(/\s+/g, ''))
  })
}
function buildCleanColumnMap(headers: unknown[]): CleanColumnMap {
  return {
    reservation: findHeaderIndex(headers, cleanColumnHeaders.reservation),
    firstname: findHeaderIndex(headers, cleanColumnHeaders.firstname),
    lastname: findHeaderIndex(headers, cleanColumnHeaders.lastname),
    pitch: findHeaderIndex(headers, cleanColumnHeaders.pitch),
    cleaning: findHeaderIndex(headers, cleanColumnHeaders.cleaning),
    accommodation: findHeaderIndex(headers, cleanColumnHeaders.accommodation),
  }
}
function cellAt(row: unknown[], index: number) {
  return index >= 0 ? row[index] ?? '' : ''
}
function findCleanImportTable(workbook: XLSX.WorkBook) {
  let best: { rows: unknown[][], headerRowIndex: number, columns: CleanColumnMap, score: number } | null = null

  for (const sheetName of workbook.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
      header: 1,
      defval: '',
      raw: true,
      blankrows: false,
    })
    const rowsToInspect = Math.min(rows.length, 75)
    for (let headerRowIndex = 0; headerRowIndex < rowsToInspect; headerRowIndex += 1) {
      const columns = buildCleanColumnMap(rows[headerRowIndex] ?? [])
      if (columns.reservation < 0) continue
      const recognizedColumns = Object.values(columns).filter((index) => index >= 0).length
      const usefulColumns = [columns.firstname, columns.lastname, columns.pitch, columns.cleaning, columns.accommodation].filter((index) => index >= 0).length
      if (usefulColumns < 2) continue
      const score = recognizedColumns * 100 - headerRowIndex
      if (!best || score > best.score) best = { rows, headerRowIndex, columns, score }
    }
  }

  if (!best) {
    throw new Error('Impossible de trouver les colonnes du contrôle journée. Le fichier doit contenir au minimum « Reservation Number » ainsi que les colonnes client, emplacement ou nettoyage.')
  }
  return best
}
function normalizeCleanStatus(value: unknown) {
  const displayStatus = String(value ?? '').trim()
  const rawStatus = displayStatus.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  if (!rawStatus) return { status: null, rawStatus: '', displayStatus: '' }
  return { status: cleanStatusMap[rawStatus] ?? rawStatus.toLowerCase(), rawStatus, displayStatus }
}
function parseCleanWorkbook(buffer: ArrayBuffer): CleanImportResult {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const { rows: matrix, headerRowIndex, columns } = findCleanImportTable(workbook)
  const raw = matrix.slice(headerRowIndex + 1)
  const hasCleaningColumn = columns.cleaning >= 0
  const unique = new Map<string, CleanImportRow>()
  const unknownStatuses = new Set<string>()
  const multiReservations = new Set<string>()

  const mergeText = (first: string | null, second: string | null) => {
    const values = [first, second].filter((value): value is string => Boolean(value))
    return [...new Set(values)].join(' + ') || null
  }
  const mergeStatuses = (first: string | null, second: string | null) => {
    const expand = (status: string | null) => status?.startsWith('multi__') ? status.slice(7).split('__') : [status ?? 'non_renseigne']
    return `multi__${[...expand(first), ...expand(second)].sort().join('__')}`
  }

  raw.filter((row) => row.some((value) => value !== '' && value !== null && value !== undefined)).forEach((row) => {
    const reservationNumber = reservationNumberValue(cellAt(row, columns.reservation))
    if (!reservationNumber) return
    const { status: cleanStatus, rawStatus, displayStatus } = normalizeCleanStatus(cellAt(row, columns.cleaning))
    if (rawStatus && !cleanStatusMap[rawStatus]) unknownStatuses.add(displayStatus || rawStatus)
    const next: CleanImportRow = {
      reservation_number: reservationNumber,
      clean_status: cleanStatus,
      firstname: String(cellAt(row, columns.firstname)).trim() || null,
      lastname: String(cellAt(row, columns.lastname)).trim() || null,
      accommodation_type: String(cellAt(row, columns.accommodation)).trim() || null,
      pitch: String(cellAt(row, columns.pitch)).trim() || null,
    }
    const previous = unique.get(reservationNumber)
    if (!previous) {
      unique.set(reservationNumber, next)
      return
    }
    multiReservations.add(reservationNumber)
    unique.set(reservationNumber, {
      reservation_number: reservationNumber,
      clean_status: mergeStatuses(previous.clean_status, next.clean_status),
      firstname: previous.firstname ?? next.firstname,
      lastname: previous.lastname ?? next.lastname,
      accommodation_type: mergeText(previous.accommodation_type, next.accommodation_type),
      pitch: mergeText(previous.pitch, next.pitch),
    })
  })

  return {
    rows: [...unique.values()],
    hasCleaningStatuses: hasCleaningColumn,
    unknownStatuses: [...unknownStatuses].sort((first, second) => first.localeCompare(second, 'fr')),
    multiReservationCount: multiReservations.size,
  }
}
function formatDay(date: string) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}
function dayName(date: string) { return `Arrivées du ${formatDay(date)}` }
function fullName(row: Reservation) { return `${row.lastname ?? ''} ${row.firstname ?? ''}`.trim() }

type DetailedError = {
  message?: unknown
  details?: unknown
  hint?: unknown
  code?: unknown
  error_description?: unknown
}
function describeError(caught: unknown, fallback: string) {
  if (caught instanceof Error && caught.message) return caught.message
  if (typeof caught === 'string' && caught.trim()) return caught
  if (caught && typeof caught === 'object') {
    const error = caught as DetailedError
    const message = [error.message, error.error_description].find((value) => typeof value === 'string' && value.trim()) as string | undefined
    const details = typeof error.details === 'string' && error.details.trim() ? error.details.trim() : ''
    const hint = typeof error.hint === 'string' && error.hint.trim() ? error.hint.trim() : ''
    const code = typeof error.code === 'string' && error.code.trim() ? error.code.trim() : ''
    const parts = [message?.trim() || fallback]
    if (details && details !== message) parts.push(`Détail : ${details}`)
    if (hint) parts.push(`Conseil : ${hint}`)
    if (code) parts.push(`Code Supabase : ${code}`)
    return parts.join('\n')
  }
  return fallback
}

function Login() {
  const [username, setUsername] = useState('backoffice')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setLoading(true); setError('')
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '')
    const result = await supabase.auth.signInWithPassword({ email: `${clean}@${TECHNICAL_DOMAIN}`, password })
    if (result.error) setError('Nom d’utilisateur ou mot de passe incorrect.')
    setLoading(false)
  }
  return <main className="login-page"><section className="login-card">
    <div className="brand-mark">C</div><h1>CIF Camping</h1><p>Connexion à l’espace de travail</p>
    <form onSubmit={submit}>
      <label>Nom d’utilisateur<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required /></label>
      <label>Mot de passe<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      {error && <div className="error">{error}</div>}
      <button className="primary" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button>
    </form>
  </section></main>
}

export default function App() {
  const [authReady, setAuthReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [workspace, setWorkspace] = useState<'back' | 'front' | 'front_check'>('back')
  const [days, setDays] = useState<ArrivalDay[]>([])
  const [day, setDay] = useState<ArrivalDay | null>(null)
  const [rows, setRows] = useState<Reservation[]>([])
  const [checkTypes, setCheckTypes] = useState<CheckType[]>([])
  const [departmentCodeById, setDepartmentCodeById] = useState<Record<string, string>>({})
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'ready' | 'todo' | 'call' | 'due'>('all')
  const [callFilter, setCallFilter] = useState<'all' | 'unset' | CallStatus>('all')
  const [sort, setSort] = useState<'name' | 'unit' | 'status'>('name')
  const [workFilters, setWorkFilters] = useState<{ swikly: 'all' | 'done' | 'todo', travel: 'all' | 'done' | 'todo', cif: 'all' | 'done' | 'todo' }>({ swikly: 'all', travel: 'all', cif: 'all' })
  const [showWorkFilters, setShowWorkFilters] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(60)
  const [saving, setSaving] = useState<string | null>(null)
  const [openCallMenu, setOpenCallMenu] = useState<string | null>(null)
  const [showNewDay, setShowNewDay] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [importSummary, setImportSummary] = useState<{ total: number, added: number, updated: number, missing: number } | null>(null)
  const [cleanImporting, setCleanImporting] = useState(false)
  const [cleanImportSummary, setCleanImportSummary] = useState<{ updated: number, changed: number, added: number, missing: number, statusesProvided: boolean, unknownStatuses: string[], multiReservationCount: number } | null>(null)
  const [pendingMissingRows, setPendingMissingRows] = useState<FrontDayRow[]>([])
  const [missingRowsToDelete, setMissingRowsToDelete] = useState<Set<string>>(new Set())
  const [cleanTracking, setCleanTracking] = useState(false)
  const [cleanBaselineReady, setCleanBaselineReady] = useState(false)
  const [changedCleanIds, setChangedCleanIds] = useState<Set<string>>(new Set())
  const [frontDayRows, setFrontDayRows] = useState<FrontDayRow[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const cleanFileRef = useRef<HTMLInputElement>(null)

  const checkTypeByCode = useMemo(() => Object.fromEntries(checkTypes.map((item) => [item.code, item])), [checkTypes])
  const backCheckTypes = useMemo(() => checkTypes.filter((item) => departmentCodeById[item.department_id] === 'back_office'), [checkTypes, departmentCodeById])
  const frontCheckTypes = useMemo(() => checkTypes.filter((item) => departmentCodeById[item.department_id] === 'front_office'), [checkTypes, departmentCodeById])
  const checked = (reservationId: string, code: string) => {
    const type = checkTypeByCode[code]
    return type ? Boolean(checks[`${reservationId}:${type.id}`]) : false
  }

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return }
    supabase.auth.getSession().then(({ data }) => { setSignedIn(Boolean(data.session)); setAuthReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)))
    return () => data.subscription.unsubscribe()
  }, [])
  useEffect(() => { if (signedIn && supabase) void initialize() }, [signedIn])
  useEffect(() => {
    const closeMenus = () => { setOpenCallMenu(null); setShowWorkFilters(false) }
    document.addEventListener('click', closeMenus)
    return () => document.removeEventListener('click', closeMenus)
  }, [])
  useEffect(() => {
    if (!signedIn || !supabase || !day) return
    const channel = supabase.channel(`cif-live-${day.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'arrival_days' }, () => void loadDays(day.id))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations', filter: `arrival_day_id=eq.${day.id}` }, () => void loadRows(day.id))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservation_checks' }, () => void loadChecks(rows.map((row) => row.id)))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'front_day_rows', filter: `arrival_day_id=eq.${day.id}` }, () => void loadFrontDayRows(day.id))
      .subscribe()
    return () => { void supabase?.removeChannel(channel) }
  }, [signedIn, day?.id, rows.length])

  async function initialize() {
    if (!supabase) return
    setError('')
    const { data: userData } = await supabase.auth.getUser()
    if (userData.user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userData.user.id).single()
      if (data) {
        const nextProfile = data as Profile
        setProfile(nextProfile)
        setWorkspace(nextProfile.role === 'front_office' || nextProfile.role === 'direction' ? 'front' : 'back')
      }
    }
    const { data: departments, error: departmentError } = await supabase.from('departments').select('id,code').in('code', ['back_office', 'front_office'])
    if (departmentError) setError(departmentError.message)
    if (departments?.length) {
      setDepartmentCodeById(Object.fromEntries(departments.map((item) => [item.id, item.code])))
      const { data, error: typeError } = await supabase.from('check_types').select('*').in('department_id', departments.map((item) => item.id)).eq('is_active', true).order('sort_order')
      if (typeError) setError(typeError.message)
      if (data) setCheckTypes(data as CheckType[])
    }
    await loadDays()
  }
  async function loadDays(preferredId?: string) {
    if (!supabase) return
    const { data, error: loadError } = await supabase.from('arrival_days').select('*').order('arrival_date', { ascending: false })
    if (loadError) { setError(loadError.message); return }
    const nextDays = (data ?? []) as ArrivalDay[]
    setDays(nextDays)
    const selected = nextDays.find((item) => item.id === (preferredId ?? day?.id)) ?? nextDays[0] ?? null
    setDay(selected)
    if (selected) { await loadRows(selected.id); await loadFrontDayRows(selected.id) }
    else { setRows([]); setFrontDayRows([]); setChecks({}) }
  }
  async function loadRows(arrivalDayId: string) {
    if (!supabase) return
    const { data, error: loadError } = await supabase.from('reservations').select('*').eq('arrival_day_id', arrivalDayId).order('lastname')
    if (loadError) { setError(loadError.message); return }
    const nextRows = (data ?? []) as Reservation[]
    setRows(nextRows)
    setChangedCleanIds(new Set(nextRows.filter((row) => Boolean(row.clean_changed_at)).map((row) => row.id)))
    await loadChecks(nextRows.map((row) => row.id))
  }
  async function loadFrontDayRows(arrivalDayId: string) {
    if (!supabase) return
    const { data, error: loadError } = await supabase.from('front_day_rows').select('*').eq('arrival_day_id', arrivalDayId).order('lastname')
    if (loadError) {
      if (loadError.code !== '42P01') setError(loadError.message)
      setFrontDayRows([])
      return
    }
    setFrontDayRows((data ?? []) as FrontDayRow[])
  }
  async function loadChecks(reservationIds: string[]) {
    if (!supabase || reservationIds.length === 0) { setChecks({}); return }
    const { data, error: loadError } = await supabase.from('reservation_checks').select('*').in('reservation_id', reservationIds)
    if (loadError) { setError(loadError.message); return }
    const next: Record<string, boolean> = {}
    for (const item of (data ?? []) as ReservationCheck[]) next[`${item.reservation_id}:${item.check_type_id}`] = item.is_checked
    setChecks(next)
  }
  async function chooseDay(next: ArrivalDay) {
    setDay(next); setExpanded(null); setQuery(''); setFilter('all'); setCallFilter('all'); setVisibleCount(60)
    await loadRows(next.id)
    await loadFrontDayRows(next.id)
  }
  async function createDay() {
    if (!supabase || !newDate) return
    const { data, error: createError } = await supabase.from('arrival_days').insert({ name: dayName(newDate), arrival_date: newDate, created_by: profile?.id ?? null }).select().single()
    if (createError) { alert(createError.code === '23505' ? 'Une journée existe déjà pour cette date.' : createError.message); return }
    setShowNewDay(false); setNewDate(''); await loadDays((data as ArrivalDay).id)
  }
  async function deleteCurrentDay() {
    if (!supabase || !day || !confirm(`Supprimer définitivement « ${day.name} » et toutes ses réservations ?`)) return
    const { error: deleteError } = await supabase.from('arrival_days').delete().eq('id', day.id)
    if (deleteError) { alert(deleteError.message); return }
    setExpanded(null); await loadDays()
  }
  async function patchReservation(id: string, changes: Partial<Reservation>) {
    if (!supabase) return
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...changes } : row)); setSaving(id)
    const { error: updateError } = await supabase.from('reservations').update({ ...changes, updated_by: profile?.id ?? null }).eq('id', id)
    if (updateError) { alert(updateError.message); if (day) await loadRows(day.id); setSaving(null); return }

    // « CIF pas possible » doit toujours apparaître dans « CIF pas OK » côté Front Office.
    if (changes.call_status === 'cif_pas_possible') {
      const cifReadyType = checkTypeByCode.cif_ready
      if (cifReadyType) {
        const key = `${id}:${cifReadyType.id}`
        setChecks((current) => ({ ...current, [key]: false }))
        const { error: checkError } = await supabase.from('reservation_checks').upsert({
          reservation_id: id,
          check_type_id: cifReadyType.id,
          is_checked: false,
          updated_by: profile?.id ?? null,
        }, { onConflict: 'reservation_id,check_type_id' })
        if (checkError) { alert(checkError.message); if (day) await loadRows(day.id) }
      }
    }
    setSaving(null)
  }
  async function toggleCheck(reservationId: string, code: string) {
    if (!supabase) return
    const type = checkTypeByCode[code]
    if (!type) return
    const key = `${reservationId}:${type.id}`
    const nextValue = !checks[key]
    setChecks((current) => ({ ...current, [key]: nextValue }))
    const { error: updateError } = await supabase.from('reservation_checks').upsert({ reservation_id: reservationId, check_type_id: type.id, is_checked: nextValue, updated_by: profile?.id ?? null }, { onConflict: 'reservation_id,check_type_id' })
    if (updateError) { alert(updateError.message); setChecks((current) => ({ ...current, [key]: !nextValue })) }
  }
  async function setChecksBulk(reservationIds: string[], code: string, isChecked: boolean) {
    if (!supabase || reservationIds.length === 0) return
    const type = checkTypeByCode[code]
    if (!type) return
    const uniqueIds = [...new Set(reservationIds)]
    const changedIds = uniqueIds.filter((reservationId) => Boolean(checks[`${reservationId}:${type.id}`]) !== isChecked)
    if (changedIds.length === 0) return
    const previousValues = Object.fromEntries(changedIds.map((reservationId) => [`${reservationId}:${type.id}`, Boolean(checks[`${reservationId}:${type.id}`])]))
    setChecks((current) => {
      const next = { ...current }
      for (const reservationId of changedIds) next[`${reservationId}:${type.id}`] = isChecked
      return next
    })
    try {
      const payload = changedIds.map((reservationId) => ({ reservation_id: reservationId, check_type_id: type.id, is_checked: isChecked, updated_by: profile?.id ?? null }))
      for (let index = 0; index < payload.length; index += 100) {
        const { error: updateError } = await supabase.from('reservation_checks').upsert(payload.slice(index, index + 100), { onConflict: 'reservation_id,check_type_id' })
        if (updateError) throw updateError
      }
    } catch (caught) {
      setChecks((current) => ({ ...current, ...previousValues }))
      alert(describeError(caught, 'Impossible de mettre à jour les réservations sélectionnées.'))
      throw caught
    }
  }
  async function importFile(file: File) {
    if (!supabase || !day) return
    setImporting(true); setImportSummary(null)
    try {
      const parsed = parseWorkbook(await file.arrayBuffer(), day.id)
      if (!parsed.length) throw new Error('Aucune réservation reconnue dans ce fichier.')
      const existingNumbers = new Set<string>(rows.filter((row) => !row.is_last_minute).map((row) => row.reservation_number))
      const incomingNumbers = new Set<string>(parsed.map((row) => row.reservation_number))
      const added = parsed.filter((row) => !existingNumbers.has(row.reservation_number)).length
      const updated = parsed.length - added
      const missing = [...existingNumbers].filter((number) => !incomingNumbers.has(number)).length
      for (let index = 0; index < parsed.length; index += 100) {
        const { error: importError } = await supabase.from('reservations').upsert(parsed.slice(index, index + 100), { onConflict: 'arrival_day_id,reservation_number' })
        if (importError) throw importError
      }
      await supabase.from('arrival_days').update({ updated_at: new Date().toISOString() }).eq('id', day.id)
      await loadDays(day.id); setImportSummary({ total: parsed.length, added, updated, missing })
    } catch (caught) { alert(describeError(caught, 'Impossible de mettre à jour les arrivées avec ce fichier.')) }
    finally { setImporting(false); if (fileRef.current) fileRef.current.value = '' }
  }
  async function importCleanFile(file: File) {
    if (!supabase || !day) return
    setCleanImporting(true); setCleanImportSummary(null)
    try {
      const importResult = parseCleanWorkbook(await file.arrayBuffer())
      const parsed = importResult.rows
      if (!parsed.length) throw new Error('Aucune réservation reconnue. Le fichier doit au minimum contenir une colonne « Reservation Number ».')
      const existingByNumber = new Map<string, FrontDayRow>(frontDayRows.map((row) => [reservationNumberValue(row.reservation_number), row] as const))
      const isFirstImport = frontDayRows.length === 0
      let updated = 0
      let changed = 0
      let added = 0
      const incomingNumbers = new Set<string>(parsed.map((item) => item.reservation_number))
      const missingRows = isFirstImport ? [] : frontDayRows.filter((row) => !incomingNumbers.has(reservationNumberValue(row.reservation_number)))

      if (isFirstImport) {
        const payload = parsed.map((item) => ({
          arrival_day_id: day.id,
          reservation_number: item.reservation_number,
          firstname: item.firstname,
          lastname: item.lastname,
          accommodation_type: item.accommodation_type,
          pitch: item.pitch,
          clean_status: item.clean_status ?? 'non_renseigne',
          clean_previous_status: null,
          clean_changed_at: null,
          is_verified: false,
          is_last_minute: false,
        }))
        for (let index = 0; index < payload.length; index += 100) {
          const { error: insertError } = await supabase.from('front_day_rows').upsert(payload.slice(index, index + 100), { onConflict: 'arrival_day_id,reservation_number' })
          if (insertError) throw insertError
        }
        updated = payload.length
      } else {
        for (const item of parsed) {
          const current = existingByNumber.get(item.reservation_number)
          if (!current) {
            const { error: insertError } = await supabase.from('front_day_rows').insert({
              arrival_day_id: day.id,
              reservation_number: item.reservation_number,
              firstname: item.firstname,
              lastname: item.lastname,
              accommodation_type: item.accommodation_type,
              pitch: item.pitch,
              clean_status: item.clean_status ?? 'non_renseigne',
              clean_previous_status: null,
              clean_changed_at: null,
              is_verified: false,
              is_last_minute: true,
            })
            if (insertError) throw insertError
            added += 1
            continue
          }

          const previous = current.clean_status ?? 'non_renseigne'
          const nextStatus = item.clean_status ?? previous
          const hasKnownBaseline = previous !== 'non_renseigne'
          const hasChanged = item.clean_status !== null && hasKnownBaseline && previous !== nextStatus
          const { error: updateError } = await supabase.from('front_day_rows').update({
            firstname: item.firstname ?? current.firstname,
            lastname: item.lastname ?? current.lastname,
            accommodation_type: item.accommodation_type ?? current.accommodation_type,
            pitch: item.pitch ?? current.pitch,
            clean_status: nextStatus,
            clean_previous_status: hasChanged ? previous : current.clean_previous_status,
            clean_changed_at: hasChanged ? new Date().toISOString() : current.clean_changed_at,
            is_verified: hasChanged ? false : current.is_verified,
            updated_at: new Date().toISOString(),
          }).eq('id', current.id)
          if (updateError) throw updateError
          updated += 1
          if (hasChanged) changed += 1
        }
      }

      await loadFrontDayRows(day.id)
      setPendingMissingRows(missingRows)
      setMissingRowsToDelete(new Set())
      setCleanBaselineReady(true)
      setCleanTracking(true)
      setCleanImportSummary({
        updated,
        changed,
        added,
        missing: missingRows.length,
        statusesProvided: importResult.hasCleaningStatuses,
        unknownStatuses: importResult.unknownStatuses,
        multiReservationCount: importResult.multiReservationCount,
      })
    } catch (caught) {
      alert(describeError(caught, 'Impossible de mettre à jour le contrôle de journée.'))
    } finally {
      setCleanImporting(false)
      if (cleanFileRef.current) cleanFileRef.current.value = ''
    }
  }

  async function resetDayChecks() {
    if (!supabase || !day || !confirm('Remettre toutes les vérifications de la journée à « À vérifier » ?')) return
    const { error: resetError } = await supabase.from('front_day_rows').update({ is_verified: false }).eq('arrival_day_id', day.id)
    if (resetError) { alert(resetError.message); return }
    setFrontDayRows((current) => current.map((row) => ({ ...row, is_verified: false })))
  }

  async function toggleFrontDayRow(id: string) {
    if (!supabase) return
    const row = frontDayRows.find((item) => item.id === id)
    if (!row) return
    const next = !row.is_verified
    const clearsChange = next && Boolean(row.clean_changed_at)
    setFrontDayRows((current) => current.map((item) => item.id === id ? {
      ...item,
      is_verified: next,
      clean_previous_status: clearsChange ? null : item.clean_previous_status,
      clean_changed_at: clearsChange ? null : item.clean_changed_at,
    } : item))
    const { error: updateError } = await supabase.from('front_day_rows').update({
      is_verified: next,
      clean_previous_status: clearsChange ? null : row.clean_previous_status,
      clean_changed_at: clearsChange ? null : row.clean_changed_at,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    if (updateError) { alert(updateError.message); await loadFrontDayRows(row.arrival_day_id) }
  }

  function toggleMissingRowDecision(id: string) {
    setMissingRowsToDelete((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function resolveMissingRows(mode: 'keep_all' | 'delete_all' | 'apply' = 'apply') {
    if (!supabase || !day) return
    const ids = mode === 'delete_all'
      ? pendingMissingRows.map((row) => row.id)
      : mode === 'keep_all'
        ? []
        : [...missingRowsToDelete]
    if (ids.length) {
      for (let index = 0; index < ids.length; index += 100) {
        const { error: deleteError } = await supabase.from('front_day_rows').delete().in('id', ids.slice(index, index + 100))
        if (deleteError) { alert(describeError(deleteError, 'Impossible de supprimer les réservations absentes.')); return }
      }
      setFrontDayRows((current) => current.filter((row) => !ids.includes(row.id)))
    }
    setPendingMissingRows([])
    setMissingRowsToDelete(new Set())
    setCleanImportSummary(null)
  }

  async function addManual() {
    if (!supabase || !day) return
    const lastname = prompt('Nom du client :')?.trim(); if (!lastname) return
    const firstname = prompt('Prénom du client :')?.trim() ?? ''
    const reservationNumber = prompt('Numéro de réservation (facultatif) :')?.trim() || `LAST-${Date.now()}`
    const { data, error: createError } = await supabase.from('reservations').insert({ arrival_day_id: day.id, reservation_number: reservationNumber, firstname, lastname, is_last_minute: true, source: 'manual', call_status: 'a_appeler', created_by: profile?.id ?? null, updated_by: profile?.id ?? null }).select().single()
    if (createError) { alert(createError.message); return }
    setRows((current) => [data as Reservation, ...current]); setExpanded((data as Reservation).id)
  }
  async function deleteReservation(row: Reservation) {
    if (!supabase || !confirm(`Supprimer définitivement la réservation de ${fullName(row)} (${row.reservation_number}) ?`)) return
    const { error: deleteError } = await supabase.from('reservations').delete().eq('id', row.id)
    if (deleteError) { alert(deleteError.message); return }
    setExpanded(null); setRows((current) => current.filter((item) => item.id !== row.id))
  }

  const counts = useMemo(() => ({
    ready: rows.filter((row) => checked(row.id, 'cif_ready')).length,
    todo: rows.filter((row) => !checked(row.id, 'cif_ready')).length,
    call: rows.filter((row) => row.call_status && row.call_status !== 'termine').length,
    due: rows.filter((row) => Number(row.remaining_amount) > 0).length,
  }), [rows, checks, checkTypes])
  const progress = rows.length ? Math.round((counts.ready / rows.length) * 100) : 0
  const callCounts = useMemo(() => {
    const next: Record<'unset' | CallStatus, number> = { unset: 0, a_appeler: 0, message_laisse: 0, a_rappeler: 0, attente_client: 0, termine: 0, cif_pas_possible: 0 }
    rows.forEach((row) => row.call_status ? next[row.call_status] += 1 : next.unset += 1)
    return next
  }, [rows])
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('fr')
    const result = rows.filter((row) => {
      const matchesSearch = !needle || [row.firstname, row.lastname, row.reservation_number, row.pitch, row.accommodation_type].some((value) => String(value ?? '').toLocaleLowerCase('fr').includes(needle))
      const matchesFilter = filter === 'all' || (filter === 'ready' && checked(row.id, 'cif_ready')) || (filter === 'todo' && !checked(row.id, 'cif_ready')) || (filter === 'call' && row.call_status !== 'termine') || (filter === 'due' && Number(row.remaining_amount) > 0)
      const matchesCallFilter = callFilter === 'all' || (callFilter === 'unset' && !row.call_status) || row.call_status === callFilter
      const matchesWork = (workFilters.swikly === 'all' || checked(row.id, 'swikly') === (workFilters.swikly === 'done')) && (workFilters.travel === 'all' || checked(row.id, 'travel_party') === (workFilters.travel === 'done')) && (workFilters.cif === 'all' || checked(row.id, 'cif_ready') === (workFilters.cif === 'done'))
      return matchesSearch && matchesFilter && matchesCallFilter && matchesWork
    })
    return [...result].sort((a, b) => {
      if (sort === 'unit') return String(a.pitch ?? '').localeCompare(String(b.pitch ?? ''), 'fr', { numeric: true })
      if (sort === 'status') return Number(checked(a.id, 'cif_ready')) - Number(checked(b.id, 'cif_ready')) || fullName(a).localeCompare(fullName(b), 'fr')
      return fullName(a).localeCompare(fullName(b), 'fr')
    })
  }, [rows, checks, checkTypes, query, filter, callFilter, sort, workFilters])
  const selected = rows.find((row) => row.id === expanded) ?? null
  const canUseBack = profile?.role === 'admin' || profile?.role === 'back_office'
  const canEditFront = profile?.role === 'admin' || profile?.role === 'front_office'

  if (!hasSupabase) return <main className="loading">Configuration Supabase manquante dans le fichier .env.</main>
  if (!authReady) return <main className="loading">Chargement…</main>
  if (!signedIn) return <Login />

  return <div className={`app-shell ${workspace !== 'back' ? 'front-shell' : ''}`}>
    <aside>
      <div className="logo"><div className="brand-mark small">C</div><div><strong>CIF Camping</strong><span>{workspace === 'back' ? 'Back Office' : 'Front Office'}</span></div></div>
      <nav>
        {canUseBack && <button className={workspace === 'back' ? 'active' : ''} onClick={() => setWorkspace('back')}><Home size={18} />Préparation CIF</button>}
        {(profile?.role === 'admin' || profile?.role === 'front_office' || profile?.role === 'direction') && <button className={workspace === 'front' ? 'active' : ''} onClick={() => { setWorkspace('front'); setExpanded(null) }}><UsersRound size={18} />Accueil arrivées</button>}
        {(profile?.role === 'admin' || profile?.role === 'front_office' || profile?.role === 'direction') && <button className={workspace === 'front_check' ? 'active' : ''} onClick={() => { setWorkspace('front_check'); setExpanded(null) }}><ClipboardCheck size={18} />Contrôle journée</button>}
      </nav>
      <div className="session-block"><div className="session-title"><span>Journées</span>{canUseBack && <button title="Créer une journée" onClick={() => setShowNewDay(true)}><Plus size={15} /></button>}</div>
        <div className="session-list">{days.map((item) => <button key={item.id} className={item.id === day?.id ? 'current' : ''} onClick={() => void chooseDay(item)}><CalendarDays size={15} /><span>{new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${item.arrival_date}T12:00:00`))}</span></button>)}</div>
      </div>
      <div className="aside-bottom"><span className="connection live"><Wifi size={14} />Mise à jour en direct</span><span className="account-label">{profile?.display_name ?? profile?.username}</span><button className="ghost" onClick={() => supabase?.auth.signOut()}><LogOut size={17} />Déconnexion</button></div>
    </aside>

    <main className="content">
      <header><div><p className="eyebrow">{workspace === 'front' ? 'ACCUEIL DES ARRIVÉES' : workspace === 'front_check' ? 'CONTRÔLE DE LA JOURNÉE' : 'JOURNÉE ACTIVE'}</p><h1>{day?.name ?? 'Aucune journée créée'}</h1><p>{workspace === 'front_check' ? frontDayRows.length : rows.length} réservations{day?.updated_at ? ` · Dernière mise à jour ${new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(day.updated_at))}` : ''}</p></div>
        {workspace === 'back' && canUseBack && <div className="header-actions"><input ref={fileRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={(e) => e.target.files?.[0] && void importFile(e.target.files[0])} /><button className="secondary" onClick={() => fileRef.current?.click()} disabled={!day || importing}><Upload size={17} />{importing ? 'Mise à jour…' : 'Mettre à jour les arrivées'}</button><button className="primary" onClick={() => void addManual()} disabled={!day}><Plus size={17} />Ajouter une réservation</button><button className="danger-button" onClick={() => void deleteCurrentDay()} disabled={!day}><Trash2 size={17} />Supprimer la journée</button></div>}
      </header>
      {error && <div className="error page-error">{error}</div>}
      {!day ? <div className="empty"><h2>Aucune journée</h2><p>Créez le prochain samedi d’arrivées pour commencer.</p>{canUseBack && <button className="primary" onClick={() => setShowNewDay(true)}><Plus size={17} />Créer une journée</button>}</div> : workspace === 'front' ?
        <FrontOfficeView rows={rows} query={query} setQuery={setQuery} checked={checked} frontCheckTypes={frontCheckTypes} canEdit={canEditFront} onToggle={toggleCheck} onBulkSet={setChecksBulk} changedCleanIds={changedCleanIds} /> : workspace === 'front_check' ?
        <FrontDayCheckView rows={frontDayRows} query={query} setQuery={setQuery} canEdit={canEditFront} onToggle={toggleFrontDayRow} cleanFileRef={cleanFileRef} cleanImporting={cleanImporting} onCleanImport={importCleanFile} initialized={frontDayRows.length > 0} onResetChecks={resetDayChecks} /> :
        <>
          <section className="progress-card"><div><span>Avancement de la préparation</span><strong>{counts.ready} / {rows.length} réservations prêtes</strong></div><div className="progress-value">{progress}%</div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></section>
          <section className="stats"><button onClick={() => setFilter('all')} className={filter === 'all' ? 'selected' : ''}><strong>{rows.length}</strong><span>Toutes</span></button><button onClick={() => setFilter('ready')} className={filter === 'ready' ? 'selected green-card' : ''}><strong>{counts.ready}</strong><span>CIF prêts</span></button><button onClick={() => setFilter('todo')} className={filter === 'todo' ? 'selected orange-card' : ''}><strong>{counts.todo}</strong><span>À préparer</span></button><button onClick={() => setFilter('call')} className={filter === 'call' ? 'selected' : ''}><strong>{counts.call}</strong><span>Suivi appel</span></button><button onClick={() => setFilter('due')} className={filter === 'due' ? 'selected' : ''}><strong>{counts.due}</strong><span>Avec solde</span></button></section>
          <section className="call-filter-panel"><div className="call-filter-heading"><Phone size={16} /><span>Statuts d’appel</span></div><div className="call-filter-bar"><button className={`all-status ${callFilter === 'all' ? 'active' : ''}`} onClick={() => { setCallFilter('all'); setVisibleCount(60) }}>Tous <strong>{rows.length}</strong></button>{(Object.keys(statusLabels) as CallStatus[]).map((status) => <button key={status} className={`${statusClass[status]} ${callFilter === status ? 'active' : ''}`} onClick={() => { setCallFilter((current) => current === status ? 'all' : status); setVisibleCount(60) }}>{statusLabels[status]} <strong>{callCounts[status]}</strong></button>)}</div></section>
          <section className="toolbar"><div className="search"><Search size={18} /><input value={query} onChange={(e) => { setQuery(e.target.value); setVisibleCount(60) }} placeholder="Rechercher un client, un numéro ou un emplacement…" /></div><div className="toolbar-right"><div className="work-filter-wrap"><button type="button" className={`work-filter-trigger ${Object.values(workFilters).some((value) => value !== 'all') ? 'active' : ''}`} onClick={(event) => { event.stopPropagation(); setShowWorkFilters((current) => !current) }}><SlidersHorizontal size={15} />Filtres{Object.values(workFilters).filter((value) => value !== 'all').length > 0 && <strong>{Object.values(workFilters).filter((value) => value !== 'all').length}</strong>}<ChevronDown size={14} /></button>{showWorkFilters && <div className="work-filter-menu" onClick={(event) => event.stopPropagation()}><div className="work-filter-title"><span>Afficher seulement</span><button type="button" onClick={() => setWorkFilters({ swikly: 'all', travel: 'all', cif: 'all' })}>Tout effacer</button></div>{([['swikly', 'Swikly'], ['travel', 'Participants'], ['cif', 'CIF']] as const).map(([key, label]) => <div className="work-filter-group" key={key}><span>{label}</span><div><button type="button" className={workFilters[key] === 'todo' ? 'selected todo' : ''} onClick={() => { setWorkFilters((current) => ({ ...current, [key]: current[key] === 'todo' ? 'all' : 'todo' })); setVisibleCount(60) }}>{workFilters[key] === 'todo' && <Check size={13} />}Non fait</button><button type="button" className={workFilters[key] === 'done' ? 'selected done' : ''} onClick={() => { setWorkFilters((current) => ({ ...current, [key]: current[key] === 'done' ? 'all' : 'done' })); setVisibleCount(60) }}>{workFilters[key] === 'done' && <Check size={13} />}Fait</button></div></div>)}</div>}</div><label className="sort-control"><ArrowUpDown size={15} /><select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="name">Nom</option><option value="unit">Emplacement</option><option value="status">CIF à traiter d’abord</option></select></label><span>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span></div></section>{Object.values(workFilters).some((value) => value !== 'all') && <div className="active-work-filters">{workFilters.swikly !== 'all' && <button onClick={() => setWorkFilters((current) => ({ ...current, swikly: 'all' }))}>Swikly {workFilters.swikly === 'done' ? 'fait' : 'non fait'} <X size={13} /></button>}{workFilters.travel !== 'all' && <button onClick={() => setWorkFilters((current) => ({ ...current, travel: 'all' }))}>Participants {workFilters.travel === 'done' ? 'faits' : 'non faits'} <X size={13} /></button>}{workFilters.cif !== 'all' && <button onClick={() => setWorkFilters((current) => ({ ...current, cif: 'all' }))}>CIF {workFilters.cif === 'done' ? 'fait' : 'non fait'} <X size={13} /></button>}<button className="clear-all" onClick={() => setWorkFilters({ swikly: 'all', travel: 'all', cif: 'all' })}>Effacer tout</button></div>}
          <section className="reservation-list">{filtered.slice(0, visibleCount).map((row) => <article key={row.id} className={`reservation ${row.call_status === 'cif_pas_possible' ? 'is-impossible' : checked(row.id, 'cif_ready') ? 'is-ready' : checked(row.id, 'swikly') || checked(row.id, 'travel_party') ? 'is-progress' : 'is-todo'} ${openCallMenu === row.id ? 'has-open-call-menu' : ''}`}><div className="row-main" onClick={() => setExpanded(row.id)}><span className="status-dot" /><div className="identity"><div className="avatar">{(row.firstname?.[0] ?? '?').toUpperCase()}{(row.lastname?.[0] ?? '').toUpperCase()}</div><div><h2>{(row.lastname ?? '').toUpperCase()} {row.firstname}{row.is_last_minute && <em>Last minute</em>}</h2><p><Hash size={14} />{row.reservation_number} · {row.booking_channel || 'Canal non renseigné'}</p></div></div><div className="stay"><span><Home size={15} />{row.accommodation_type || 'Hébergement non renseigné'}</span><span><MapPin size={15} />Emplacement {row.pitch || '—'}</span></div><div className="badges"><QuickCheck label={checkTypeByCode.swikly?.label ?? 'Swikly'} checked={checked(row.id, 'swikly')} onClick={(event) => { event.stopPropagation(); void toggleCheck(row.id, 'swikly') }} /><QuickCheck label={checkTypeByCode.travel_party?.label ?? 'Participants'} checked={checked(row.id, 'travel_party')} onClick={(event) => { event.stopPropagation(); void toggleCheck(row.id, 'travel_party') }} /><QuickCheck label={checkTypeByCode.cif_ready?.label ?? 'CIF prêt'} checked={checked(row.id, 'cif_ready')} important onClick={(event) => { event.stopPropagation(); void toggleCheck(row.id, 'cif_ready') }} /></div><div className="due"><Wallet size={16} /><strong>{Number(row.remaining_amount ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</strong><small>solde</small></div><div className={`row-call-status custom-call-select ${row.call_status ? statusClass[row.call_status] : 'unset'} ${openCallMenu === row.id ? 'is-open' : ''}`} onClick={(event) => event.stopPropagation()}><button type="button" className="call-status-trigger" onClick={() => setOpenCallMenu((current) => current === row.id ? null : row.id)}><Phone size={13} /><span>{row.call_status ? statusLabels[row.call_status] : 'Sans statut'}</span><ChevronDown size={14} /></button>{openCallMenu === row.id && <div className="call-status-menu"><button type="button" className={!row.call_status ? 'selected' : ''} onClick={() => { void patchReservation(row.id, { call_status: null }); setOpenCallMenu(null) }}>Sans statut{!row.call_status && <Check size={14} />}</button>{(Object.keys(statusLabels) as CallStatus[]).map((status) => <button type="button" key={status} className={row.call_status === status ? `selected ${statusClass[status]}` : statusClass[status]} onClick={() => { void patchReservation(row.id, { call_status: status }); setOpenCallMenu(null) }}>{statusLabels[status]}{row.call_status === status && <Check size={14} />}</button>)}</div>}</div><span className={`state-pill ${row.call_status === 'cif_pas_possible' ? 'impossible' : checked(row.id, 'cif_ready') ? 'ready' : checked(row.id, 'swikly') || checked(row.id, 'travel_party') ? 'progress' : 'todo'}`}>{row.call_status === 'cif_pas_possible' ? 'Pas possible' : checked(row.id, 'cif_ready') ? 'Prête' : checked(row.id, 'swikly') || checked(row.id, 'travel_party') ? 'En cours' : 'À traiter'}</span><ChevronRight className="row-chevron" size={17} />{saving === row.id && <RefreshCw className="spin row-saving" size={16} />}</div></article>)}
            {visibleCount < filtered.length && <button className="load-more" onClick={() => setVisibleCount((count) => count + 60)}>Afficher 60 réservations supplémentaires</button>}
            {!filtered.length && <div className="empty">{rows.length ? 'Aucune réservation ne correspond à ce filtre.' : 'Mettez à jour les arrivées ou ajoutez une réservation.'}</div>}
          </section>
        </>}
    </main>

    {workspace === 'back' && selected && <div className="drawer-backdrop" onMouseDown={() => setExpanded(null)}><aside className="drawer" onMouseDown={(e) => e.stopPropagation()}><div className="drawer-header"><div><span className="drawer-kicker">RÉSERVATION</span><h2>{fullName(selected).toUpperCase()}</h2><p>{selected.reservation_number}{selected.is_last_minute ? ' · Last minute' : ''}</p></div><button className="drawer-close" onClick={() => setExpanded(null)}><X size={20} /></button></div>
      <div className="drawer-section"><label>Suivi CIF</label><div className="drawer-checks">{backCheckTypes.map((type) => <QuickCheck key={type.id} label={type.label} checked={checked(selected.id, type.code)} important={type.code === 'cif_ready'} onClick={() => void toggleCheck(selected.id, type.code)} />)}</div></div>
      <div className="drawer-section"><label>Statut de l’appel</label><div className="call-select-wrap"><Phone size={17} /><select value={selected.call_status ?? 'a_appeler'} onChange={(event) => void patchReservation(selected.id, { call_status: event.target.value as CallStatus })}>{(Object.keys(statusLabels) as CallStatus[]).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></div></div>
      <div className="drawer-section"><label>Informations de la réservation</label><div className="reservation-facts"><div><Home size={17} /><span>Hébergement</span><strong>{selected.accommodation_type || 'Non renseigné'}</strong></div><div><MapPin size={17} /><span>Emplacement</span><strong>{selected.pitch || 'Non renseigné'}</strong></div><div><Wallet size={17} /><span>Solde</span><strong>{Number(selected.remaining_amount ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</strong></div><div><Hash size={17} /><span>Canal</span><strong>{selected.booking_channel || 'Non renseigné'}</strong></div></div></div>
      <details className="drawer-edit"><summary>Modifier les informations importées</summary><div className="drawer-section form-grid"><Editable label="Prénom" value={selected.firstname ?? ''} onSave={(value) => patchReservation(selected.id, { firstname: value })} /><Editable label="Nom" value={selected.lastname ?? ''} onSave={(value) => patchReservation(selected.id, { lastname: value })} /><Editable label="Hébergement" value={selected.accommodation_type ?? ''} onSave={(value) => patchReservation(selected.id, { accommodation_type: value })} /><Editable label="Emplacement" value={selected.pitch ?? ''} onSave={(value) => patchReservation(selected.id, { pitch: value })} /><Editable label="Solde (€)" value={String(selected.remaining_amount ?? 0)} type="number" onSave={(value) => patchReservation(selected.id, { remaining_amount: Number(value) })} /><Editable label="Canal" value={selected.booking_channel ?? ''} onSave={(value) => patchReservation(selected.id, { booking_channel: value })} /></div></details>
      <NoteEditor value={selected.internal_note ?? ''} onSave={(value) => patchReservation(selected.id, { internal_note: value })} />
      <div className="drawer-danger"><button className="danger-button" onClick={() => void deleteReservation(selected)}><Trash2 size={16} />Supprimer cette réservation</button></div>
    </aside></div>}
    {importSummary && <div className="modal-backdrop" onMouseDown={() => setImportSummary(null)}><section className="modal import-summary" onMouseDown={(e) => e.stopPropagation()}><div className="summary-icon"><CircleCheck size={28} /></div><h2>Mise à jour terminée</h2><p>Les informations du fichier ont été fusionnées. Les coches, notes et statuts ont été conservés.</p><div className="summary-lines"><div><RefreshCw size={17} /><span>{importSummary.updated} réservations mises à jour</span></div><div><Plus size={17} /><span>{importSummary.added} nouvelles réservations ajoutées</span></div><div><AlertTriangle size={17} /><span>{importSummary.missing} réservations absentes, conservées</span></div></div><div className="modal-actions"><button className="primary" onClick={() => setImportSummary(null)}>Terminer</button></div></section></div>}
    {cleanImportSummary && <div className="modal-backdrop"><section className="modal day-import-summary" onMouseDown={(e) => e.stopPropagation()}><div className="modal-icon success"><Sparkles size={24} /></div><h2>Contrôle journée mis à jour</h2><p>{cleanImportSummary.statusesProvided ? 'La liste et les états de nettoyage ont été comparés par numéro de réservation.' : 'La liste a été comparée par numéro de réservation. Ce fichier ne contient pas d’état de nettoyage : les états déjà connus ont été conservés.'} Le Back Office reste inchangé.</p><div className="summary-lines"><div><RefreshCw size={17} /><span>{cleanImportSummary.updated} réservations reconnues · {cleanImportSummary.changed} changement{cleanImportSummary.changed !== 1 ? 's' : ''} de nettoyage détecté{cleanImportSummary.changed !== 1 ? 's' : ''}</span></div><div><Plus size={17} /><span>{cleanImportSummary.added} nouvelle{cleanImportSummary.added !== 1 ? 's' : ''} réservation{cleanImportSummary.added !== 1 ? 's' : ''} ajoutée{cleanImportSummary.added !== 1 ? 's' : ''} avec la mention Last minute</span></div>{cleanImportSummary.missing > 0 && <div><AlertTriangle size={17} /><span>{cleanImportSummary.missing} réservation{cleanImportSummary.missing !== 1 ? 's sont' : ' est'} absente{cleanImportSummary.missing !== 1 ? 's' : ''} du nouveau fichier</span></div>}{cleanImportSummary.multiReservationCount > 0 && <div><Home size={17} /><span>{cleanImportSummary.multiReservationCount} réservation{cleanImportSummary.multiReservationCount > 1 ? 's regroupent' : ' regroupe'} plusieurs logements, conservés ensemble par numéro de réservation</span></div>}{cleanImportSummary.unknownStatuses.length > 0 && <div><AlertTriangle size={17} /><span>Statut{cleanImportSummary.unknownStatuses.length > 1 ? 's' : ''} inhabituel{cleanImportSummary.unknownStatuses.length > 1 ? 's' : ''} accepté{cleanImportSummary.unknownStatuses.length > 1 ? 's' : ''} et comparé{cleanImportSummary.unknownStatuses.length > 1 ? 's' : ''} normalement : {cleanImportSummary.unknownStatuses.join(', ')}</span></div>}</div>{pendingMissingRows.length > 0 && <div className="missing-review"><div className="missing-review-heading"><div><strong>Réservations absentes du nouveau fichier</strong><span>Choisissez seulement celles à supprimer. Les autres seront gardées.</span></div><button type="button" onClick={() => setMissingRowsToDelete(new Set(pendingMissingRows.map((row) => row.id)))}>Tout sélectionner</button></div><div className="missing-review-list">{pendingMissingRows.map((row) => { const markedForDeletion = missingRowsToDelete.has(row.id); return <button type="button" key={row.id} className={markedForDeletion ? 'delete-selected' : ''} onClick={() => toggleMissingRowDecision(row.id)}><span className="missing-review-check">{markedForDeletion ? <Trash2 size={14} /> : <Check size={14} />}</span><span><strong>{(row.lastname ?? '').toUpperCase()} {row.firstname}</strong><small>{row.reservation_number} · emplacement {row.pitch || '—'}</small></span><em>{markedForDeletion ? 'Supprimer' : 'Garder'}</em></button> })}</div></div>}<div className="modal-actions">{pendingMissingRows.length > 0 ? <><button className="secondary" onClick={() => void resolveMissingRows('keep_all')}>Tout garder</button><button className="primary" onClick={() => void resolveMissingRows('apply')}>Valider les choix{missingRowsToDelete.size > 0 ? ` · ${missingRowsToDelete.size} à supprimer` : ''}</button></> : <button className="primary" onClick={() => void resolveMissingRows('keep_all')}>Terminer</button>}</div></section></div>}
    {showNewDay && <div className="modal-backdrop" onMouseDown={() => setShowNewDay(false)}><section className="modal" onMouseDown={(e) => e.stopPropagation()}><h2>Nouvelle journée d’arrivées</h2><p>Chaque journée conserve ses réservations, coches et notes.</p><label>Date du samedi<input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} /></label><div className="modal-actions"><button className="secondary" onClick={() => setShowNewDay(false)}>Annuler</button><button className="primary" disabled={!newDate} onClick={() => void createDay()}>Créer la journée</button></div></section></div>}
  </div>
}

function cleanStatusTone(status: string | null | undefined) {
  const value = String(status ?? 'non_renseigne')
  const isMulti = value.startsWith('multi__')
  const statuses = isMulti ? value.slice(7).split('__') : [value]
  const hasUnknown = statuses.some((item) => !knownCleanStatuses.has(item))
  return [isMulti ? 'is-multi' : '', hasUnknown ? 'is-unknown' : ''].filter(Boolean).join(' ')
}

function cleanLabel(status: Reservation['clean_status']) {
  const labels: Record<string, string> = {
    clean: 'Clean', propre: 'Clean',
    to_be_cleaned: 'À nettoyer', non_propre: 'À nettoyer',
    in_progress: 'En cours', en_cours: 'En cours',
    postponed: 'Reporté',
    to_be_checked: 'À contrôler', a_controler: 'À contrôler',
    touch_up: 'Retouche',
    occupied_clean: 'Occupé propre',
    non_renseigne: 'Non renseigné',
  }
  const value = String(status ?? 'non_renseigne')
  const formatSingle = (item: string) => labels[item] ?? item.replace(/_/g, ' ').replace(/^./, (letter) => letter.toUpperCase())
  if (value.startsWith('multi__')) {
    const counts = value.slice(7).split('__').reduce<Record<string, number>>((result, item) => ({ ...result, [item]: (result[item] ?? 0) + 1 }), {})
    return Object.entries(counts).map(([item, count]) => `${formatSingle(item)}${count > 1 ? ` ×${count}` : ''}`).join(' + ')
  }
  return formatSingle(value)
}
type FrontPrintOptions = {
  sort: 'name' | 'pitch'
  client: boolean
  reservation: boolean
  pitch: boolean
  accommodation: boolean
  clean: boolean
  checks: boolean
}
function sortFrontRows(rows: Reservation[], sort: 'name' | 'pitch') {
  return [...rows].sort((a, b) => sort === 'pitch'
    ? String(a.pitch ?? '').localeCompare(String(b.pitch ?? ''), 'fr', { numeric: true }) || fullName(a).localeCompare(fullName(b), 'fr')
    : fullName(a).localeCompare(fullName(b), 'fr'))
}
function printFrontBoard(title: string, rows: Reservation[], checked: (id: string, code: string) => boolean, options: FrontPrintOptions) {
  const popup = window.open('', '_blank', 'width=1100,height=800')
  if (!popup) { alert('Le navigateur a bloqué la fenêtre d’impression. Autorisez les fenêtres contextuelles puis réessayez.'); return }
  const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char] ?? char))
  const orderedRows = sortFrontRows(rows, options.sort)
  const headers = [options.client && '<th>Client</th>', options.reservation && '<th>Réservation</th>', options.pitch && '<th>Emplacement</th>', options.accommodation && '<th>Hébergement</th>', options.clean && '<th>Clean</th>', options.checks && '<th>Clé + macaron</th><th>Chien</th><th>Plan</th><th>Bracelets</th><th>Vérification</th>'].filter(Boolean).join('')
  const cells = (row: Reservation) => [
    options.client && `<td class="client">${escape((row.lastname ?? '').toUpperCase())} ${escape(row.firstname)}</td>`,
    options.reservation && `<td>${escape(row.reservation_number)}</td>`,
    options.pitch && `<td>${escape(row.pitch || '—')}</td>`,
    options.accommodation && `<td>${escape(row.accommodation_type || '—')}</td>`,
    options.clean && `<td class="clean">${escape(cleanLabel(row.clean_status))}</td>`,
    options.checks && ['key_sticker', 'dog', 'plan', 'bracelets', 'verification'].map((code) => `<td class="box">${checked(row.id, code) ? '✓' : '□'}</td>`).join(''),
  ].filter(Boolean).join('')
  popup.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${escape(title)}</title><style>
    @page{size:A4 landscape;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172b24;margin:0}h1{font-size:22px;margin:0 0 4px}p{margin:0 0 14px;color:#65736e;font-size:12px}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #aebbb6;padding:6px 7px;text-align:left;vertical-align:middle}th{background:#edf3f0;font-size:9px;text-transform:uppercase;letter-spacing:.04em}.box{text-align:center;font-size:14px;width:55px}.clean{font-weight:700;white-space:nowrap}.client{font-weight:700}
  </style></head><body><h1>${escape(title)}</h1><p>${orderedRows.length} réservation${orderedRows.length > 1 ? 's' : ''} · triées par ${options.sort === 'pitch' ? 'emplacement' : 'nom'} · imprimé le ${new Date().toLocaleString('fr-FR')}</p><table><thead><tr>${headers}</tr></thead><tbody>${orderedRows.map((row) => `<tr>${cells(row)}</tr>`).join('')}</tbody></table><script>window.onload=()=>{window.print()}<\/script></body></html>`)
  popup.document.close()
}

function FrontOfficeView({ rows, query, setQuery, checked, frontCheckTypes, canEdit, onToggle, onBulkSet, changedCleanIds }: {
  rows: Reservation[], query: string, setQuery: (value: string) => void, checked: (id: string, code: string) => boolean,
  frontCheckTypes: CheckType[], canEdit: boolean, onToggle: (id: string, code: string) => Promise<void>,
  onBulkSet: (ids: string[], code: string, isChecked: boolean) => Promise<void>, changedCleanIds: Set<string>,
}) {
  const [frontSort, setFrontSort] = useState<'name' | 'pitch'>('name')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkSaving, setBulkSaving] = useState<string | null>(null)
  const needle = query.trim().toLocaleLowerCase('fr')
  const searched = useMemo(() => sortFrontRows(rows.filter((row) => !needle || [row.firstname, row.lastname, row.reservation_number, row.pitch, row.accommodation_type].some((value) => String(value ?? '').toLocaleLowerCase('fr').includes(needle))), frontSort), [rows, needle, frontSort])
  const ready = searched.filter((row) => row.call_status !== 'cif_pas_possible' && checked(row.id, 'cif_ready'))
  const notReady = searched.filter((row) => row.call_status === 'cif_pas_possible' || !checked(row.id, 'cif_ready'))
  const visibleIds = useMemo(() => searched.map((row) => row.id), [searched])
  const selectedVisibleIds = visibleIds.filter((id) => selectedIds.has(id))
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleIds.length === visibleIds.length
  const setupMissing = FRONT_CHECK_CODES.some((code) => !frontCheckTypes.some((type) => type.code === code)) || rows.some((row) => !('clean_status' in row))
  const orderedTypes = FRONT_CHECK_CODES.map((code) => frontCheckTypes.find((type) => type.code === code)).filter(Boolean) as CheckType[]
  const iconByCode: Record<string, React.ReactNode> = { key_sticker: <KeyRound size={14} />, dog: <Dog size={14} />, plan: <MapIcon size={14} />, bracelets: <CircleCheck size={14} />, verification: <ClipboardCheck size={14} /> }

  useEffect(() => {
    const visible = new Set(visibleIds)
    setSelectedIds((current) => {
      const next = new Set([...current].filter((id) => visible.has(id)))
      if (next.size === current.size && [...next].every((id) => current.has(id))) return current
      return next
    })
  }, [visibleIds])

  function toggleSelection(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function toggleRowsSelection(ids: string[]) {
    setSelectedIds((current) => {
      const allSelected = ids.length > 0 && ids.every((id) => current.has(id))
      const next = new Set(current)
      for (const id of ids) allSelected ? next.delete(id) : next.add(id)
      return next
    })
  }
  async function applyBulk(type: CheckType) {
    if (!selectedVisibleIds.length || bulkSaving) return
    const shouldCheck = !selectedVisibleIds.every((id) => checked(id, type.code))
    setBulkSaving(type.code)
    try { await onBulkSet(selectedVisibleIds, type.code, shouldCheck) }
    catch { /* L'erreur détaillée est déjà affichée par la fonction de sauvegarde. */ }
    finally { setBulkSaving(null) }
  }

  return <div className="front-workspace">
    <section className="front-hero"><div><span>Suivi accueil en temps réel</span><strong>{ready.length} CIF prêts · {notReady.length} CIF pas OK</strong></div><div className="front-hero-actions">
      {changedCleanIds.size > 0 && <span className="front-changes-summary"><RefreshCw size={15} />{changedCleanIds.size} statut{changedCleanIds.size > 1 ? 's' : ''} Clean modifié{changedCleanIds.size > 1 ? 's' : ''}</span>}
      <label className="front-sort"><ArrowUpDown size={15} /><select value={frontSort} onChange={(event) => setFrontSort(event.target.value as 'name' | 'pitch')}><option value="name">Nom</option><option value="pitch">Emplacement</option></select></label>
      <div className="front-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, réservation ou emplacement…" /></div></div></section>
    {setupMissing && <div className="front-setup-warning"><AlertTriangle size={18} /><div><strong>Une étape Supabase est nécessaire</strong><span>Exécutez le fichier <code>supabase/front_office_v2.sql</code> une seule fois pour activer l’état Clean et les contrôles Plan, Clé, Macaron, Bracelets et Chien.</span></div></div>}
    {canEdit && visibleIds.length > 0 && <section className={`front-bulk-toolbar ${selectedVisibleIds.length ? 'has-selection' : ''}`}>
      <button className={`front-select-all ${allVisibleSelected ? 'selected' : ''}`} onClick={() => toggleRowsSelection(visibleIds)}><span className="front-select-box">{allVisibleSelected && <Check size={14} />}</span>{allVisibleSelected ? 'Tout désélectionner' : `Sélectionner les ${visibleIds.length} réservations affichées`}</button>
      {selectedVisibleIds.length > 0 && <><div className="front-bulk-summary"><strong>{selectedVisibleIds.length}</strong><span>sélectionnée{selectedVisibleIds.length > 1 ? 's' : ''}</span></div><div className="front-bulk-divider" /><span className="front-bulk-label">Appliquer à la sélection</span><div className="front-bulk-actions">{orderedTypes.map((type) => {
        const allChecked = selectedVisibleIds.every((id) => checked(id, type.code))
        return <button key={type.id} disabled={Boolean(bulkSaving)} title={allChecked ? `Décocher « ${type.label} » pour la sélection` : `Cocher « ${type.label} » pour la sélection`} className={`front-bulk-action check-${type.code} ${allChecked ? 'checked' : ''} ${bulkSaving === type.code ? 'saving' : ''}`} onClick={() => void applyBulk(type)}>{bulkSaving === type.code ? <RefreshCw className="bulk-spinner" size={14} /> : iconByCode[type.code] ?? <Check size={14} />}<span>{type.label}</span>{allChecked && <Check size={13} />}</button>
      })}</div><button className="front-clear-selection" onClick={() => setSelectedIds(new Set())}><X size={14} />Effacer</button></>}
    </section>}
    <div className="front-boards">
      <FrontBoard title="CIF prêts" subtitle="Dossiers validés par le Back Office" tone="ready" rows={ready} checked={checked} types={frontCheckTypes} canEdit={canEdit} onToggle={onToggle} selectedIds={selectedIds} onToggleSelection={toggleSelection} onToggleRowsSelection={toggleRowsSelection} changedCleanIds={changedCleanIds} />
      <FrontBoard title="CIF pas OK" subtitle="En attente de validation du Back Office" tone="pending" rows={notReady} checked={checked} types={frontCheckTypes} canEdit={canEdit} onToggle={onToggle} selectedIds={selectedIds} onToggleSelection={toggleSelection} onToggleRowsSelection={toggleRowsSelection} changedCleanIds={changedCleanIds} />
    </div>
  </div>
}
function sortFrontDayRows(rows: FrontDayRow[], sort: 'name' | 'pitch') {
  return [...rows].sort((a, b) => sort === 'pitch'
    ? String(a.pitch ?? '').localeCompare(String(b.pitch ?? ''), 'fr', { numeric: true }) || `${a.lastname ?? ''} ${a.firstname ?? ''}`.localeCompare(`${b.lastname ?? ''} ${b.firstname ?? ''}`, 'fr')
    : `${a.lastname ?? ''} ${a.firstname ?? ''}`.localeCompare(`${b.lastname ?? ''} ${b.firstname ?? ''}`, 'fr'))
}
function FrontDayCheckView({ rows, query, setQuery, canEdit, onToggle, cleanFileRef, cleanImporting, onCleanImport, initialized, onResetChecks }: {
  rows: FrontDayRow[], query: string, setQuery: (value: string) => void,
  canEdit: boolean, onToggle: (id: string) => Promise<void>, cleanFileRef: React.RefObject<HTMLInputElement>,
  cleanImporting: boolean, onCleanImport: (file: File) => Promise<void>, initialized: boolean, onResetChecks: () => Promise<void>,
}) {
  const [sort, setSort] = useState<'name' | 'pitch'>('pitch')
  const [view, setView] = useState<'all' | 'todo' | 'done' | 'changed'>('all')
  const needle = query.trim().toLocaleLowerCase('fr')
  const changedCount = rows.filter((row) => Boolean(row.clean_changed_at)).length
  const filtered = useMemo(() => sortFrontDayRows(rows.filter((row) => {
    const searchMatch = !needle || [row.firstname, row.lastname, row.reservation_number, row.pitch, row.accommodation_type].some((value) => String(value ?? '').toLocaleLowerCase('fr').includes(needle))
    const viewMatch = view === 'all' || (view === 'todo' && !row.is_verified) || (view === 'done' && row.is_verified) || (view === 'changed' && Boolean(row.clean_changed_at))
    return searchMatch && viewMatch
  }), sort), [rows, needle, sort, view])
  const doneCount = rows.filter((row) => row.is_verified).length
  return <div className="day-check-workspace">
    <section className="day-check-hero"><div><span>Contrôle physique des pochettes</span><strong>{doneCount} / {rows.length} vérifiées</strong><p>{initialized ? 'Cette liste est indépendante du Back Office. Les prochains fichiers seront comparés par numéro de réservation : nouveaux Last minute, réservations absentes et changements d’état de nettoyage.' : 'Importez le tableau du jour pour créer cette liste indépendante.'}</p></div><div className="day-check-actions">
      <input ref={cleanFileRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={(event) => event.target.files?.[0] && void onCleanImport(event.target.files[0])} />
      <button className="primary" disabled={!canEdit || cleanImporting} onClick={() => cleanFileRef.current?.click()}><Upload size={16} />{cleanImporting ? 'Mise à jour…' : initialized ? 'Mettre à jour la journée' : 'Importer le tableau du jour'}</button>
      <button className="secondary" disabled={!canEdit || !doneCount} onClick={() => void onResetChecks()}><RefreshCw size={16} />Réinitialiser les OK</button>
    </div></section>
    {changedCount > 0 && <div className="day-check-alert"><RefreshCw size={17} /><strong>{changedCount} logement{changedCount > 1 ? 's ont' : ' a'} changé de statut depuis la dernière mise à jour.</strong><button onClick={() => setView('changed')}>Les afficher</button></div>}
    <section className="day-check-toolbar"><div className="day-check-filters"><button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>Tous <strong>{rows.length}</strong></button><button className={view === 'todo' ? 'active' : ''} onClick={() => setView('todo')}>À vérifier <strong>{rows.length - doneCount}</strong></button><button className={view === 'done' ? 'active' : ''} onClick={() => setView('done')}>OK <strong>{doneCount}</strong></button><button className={`changed ${view === 'changed' ? 'active' : ''}`} onClick={() => setView('changed')}>Modifiés <strong>{changedCount}</strong></button></div><label><ArrowUpDown size={15} /><select value={sort} onChange={(event) => setSort(event.target.value as 'name' | 'pitch')}><option value="pitch">Emplacement</option><option value="name">Nom</option></select></label><div className="front-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, réservation ou emplacement…" /></div></section>
    <section className="day-check-list"><div className="day-check-columns"><span>Client et emplacement</span><span>État du logement</span><span>Contrôle pochette</span></div>{filtered.map((row) => <DayCheckRow key={row.id} row={row} canEdit={canEdit} onToggle={() => onToggle(row.id)} />)}{!filtered.length && <div className="front-empty">Aucune réservation ne correspond à ce filtre.</div>}</section>
  </div>
}
function DayCheckRow({ row, canEdit, onToggle }: { row: FrontDayRow, canEdit: boolean, onToggle: () => Promise<void> }) {
  const status = row.clean_status ?? 'non_renseigne'
  const previous = row.clean_previous_status ?? 'non_renseigne'
  const changed = Boolean(row.clean_changed_at)
  return <article className={`day-check-row ${row.is_verified ? 'is-ok' : ''} ${changed ? 'is-changed' : ''}`}><div className="day-check-client"><div className="avatar">{(row.firstname?.[0] ?? '?').toUpperCase()}{(row.lastname?.[0] ?? '').toUpperCase()}</div><div><h3>{(row.lastname ?? '').toUpperCase()} {row.firstname}{row.is_last_minute && <em className="day-last-minute">Last minute</em>}</h3><p><Hash size={13} />{row.reservation_number}</p><span className="front-location"><MapPin size={13} /><strong className="front-pitch">{row.pitch || 'Sans emplacement'}</strong><em>· {row.accommodation_type || 'Hébergement non renseigné'}</em></span></div></div><div className="day-check-clean">{changed && <span className="status-change-label"><RefreshCw size={12} />Changement détecté</span>}<div className={`clean-status ${status} ${cleanStatusTone(status)}`} title={cleanStatusTone(status).includes('is-unknown') ? 'Statut inhabituel conservé et comparé normalement' : undefined}><Sparkles size={14} /><span>Clean</span><strong>{cleanLabel(status)}</strong></div>{changed && <small>{cleanLabel(previous)} <ChevronRight size={12} /> <strong>{cleanLabel(status)}</strong></small>}</div><button disabled={!canEdit} className={`day-ok-button ${row.is_verified ? 'checked' : ''}`} onClick={() => void onToggle()}>{row.is_verified ? <CircleCheck size={20} /> : <span className="empty-check" />}<span>{row.is_verified ? 'Vérifié' : 'Marquer OK'}</span></button></article>
}

function FrontBoard({ title, subtitle, tone, rows, checked, types, canEdit, onToggle, selectedIds, onToggleSelection, onToggleRowsSelection, changedCleanIds }: {
  title: string, subtitle: string, tone: 'ready' | 'pending', rows: Reservation[], checked: (id: string, code: string) => boolean,
  types: CheckType[], canEdit: boolean, onToggle: (id: string, code: string) => Promise<void>, selectedIds: Set<string>,
  onToggleSelection: (id: string) => void, onToggleRowsSelection: (ids: string[]) => void, changedCleanIds: Set<string>,
}) {
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const [printOptions, setPrintOptions] = useState<FrontPrintOptions>({ sort: 'name', client: true, reservation: true, pitch: true, accommodation: true, clean: true, checks: true })
  const rowIds = rows.map((row) => row.id)
  const selectedCount = rowIds.filter((id) => selectedIds.has(id)).length
  const allSelected = rows.length > 0 && selectedCount === rows.length
  const partiallySelected = selectedCount > 0 && !allSelected
  return <section className={`front-board ${tone}`}><header><div><span className="front-board-dot" /><div><h2>{title}</h2><p>{subtitle}</p></div></div><div className="front-board-actions">
    {canEdit && rows.length > 0 && <button className={`front-board-select ${allSelected ? 'selected' : ''} ${partiallySelected ? 'partial' : ''}`} onClick={() => onToggleRowsSelection(rowIds)} title={allSelected ? `Désélectionner toutes les réservations de ${title}` : `Sélectionner toutes les réservations de ${title}`}><span className="front-select-box">{allSelected ? <Check size={13} /> : partiallySelected ? <span className="front-select-minus" /> : null}</span><span>{allSelected ? 'Désélectionner' : 'Tout sélectionner'}</span></button>}
    <div className="front-print-wrap"><button onClick={() => setShowPrintOptions((current) => !current)} disabled={!rows.length} title={`Choisir puis imprimer la liste ${title}`}><Printer size={15} />Imprimer<ChevronDown size={13} /></button>{showPrintOptions && <div className="front-print-options"><strong>Impression</strong><label>Ordre<select value={printOptions.sort} onChange={(event) => setPrintOptions((current) => ({ ...current, sort: event.target.value as 'name' | 'pitch' }))}><option value="name">Nom</option><option value="pitch">Emplacement</option></select></label>{([['client','Client'],['reservation','Réservation'],['pitch','Emplacement'],['accommodation','Hébergement'],['clean','Clean'],['checks','Cases accueil']] as const).map(([key,label]) => <label className="print-check" key={key}><input type="checkbox" checked={printOptions[key]} onChange={() => setPrintOptions((current) => ({ ...current, [key]: !current[key] }))} />{label}</label>)}<button className="print-confirm" onClick={() => { printFrontBoard(title, rows, checked, printOptions); setShowPrintOptions(false) }}><Printer size={14} />Lancer l’impression</button></div>}</div><strong>{rows.length}</strong></div></header><div className="front-board-columns"><span>Client</span><span>Préparation accueil</span></div><div className="front-board-list">{rows.map((row) => <FrontRow key={row.id} row={row} checked={checked} types={types} canEdit={canEdit} onToggle={onToggle} selected={selectedIds.has(row.id)} onToggleSelection={() => onToggleSelection(row.id)} cleanChanged={changedCleanIds.has(row.id)} />)}{!rows.length && <div className="front-empty">Aucune réservation dans cette liste.</div>}</div></section>
}
function FrontRow({ row, checked, types, canEdit, onToggle, selected, onToggleSelection, cleanChanged }: { row: Reservation, checked: (id: string, code: string) => boolean, types: CheckType[], canEdit: boolean, onToggle: (id: string, code: string) => Promise<void>, selected: boolean, onToggleSelection: () => void, cleanChanged: boolean }) {
  const iconByCode: Record<string, React.ReactNode> = { key_sticker: <KeyRound size={14} />, dog: <Dog size={14} />, plan: <MapIcon size={14} />, bracelets: <CircleCheck size={14} />, verification: <ClipboardCheck size={14} /> }
  const ordered = FRONT_CHECK_CODES.map((code) => types.find((type) => type.code === code)).filter(Boolean) as CheckType[]
  const cleanStatus = row.clean_status ?? 'non_renseigne'
  return <article className={`front-row ${selected ? 'is-selected' : ''} ${cleanChanged ? 'clean-changed' : ''}`}><div className="front-client">{canEdit && <button className={`front-row-select ${selected ? 'selected' : ''}`} onClick={onToggleSelection} title={selected ? 'Retirer cette réservation de la sélection' : 'Sélectionner cette réservation'} aria-label={selected ? 'Désélectionner cette réservation' : 'Sélectionner cette réservation'}><span className="front-select-box">{selected && <Check size={14} />}</span></button>}<div className="avatar">{(row.firstname?.[0] ?? '?').toUpperCase()}{(row.lastname?.[0] ?? '').toUpperCase()}</div><div><h3>{(row.lastname ?? '').toUpperCase()} {row.firstname}{cleanChanged && <span className="clean-change-badge" title="L’état Clean a changé lors de la dernière mise à jour"><RefreshCw size={11} />Modifié</span>}</h3><p><Hash size={13} />{row.reservation_number}</p><span className="front-location"><MapPin size={13} /><strong className="front-pitch">{row.pitch || 'Sans emplacement'}</strong><em>· {row.accommodation_type || 'Hébergement non renseigné'}</em></span></div></div><div className="front-preparation"><div className={`clean-status ${cleanStatus} ${cleanStatusTone(cleanStatus)}`} title={cleanStatusTone(cleanStatus).includes('is-unknown') ? 'Statut inhabituel conservé et comparé normalement' : 'État mis à jour par le tableau des logements'}><Sparkles size={14} /><span>Clean</span><strong>{cleanLabel(cleanStatus)}</strong></div><div className="front-checks">{ordered.map((type) => <button key={type.id} disabled={!canEdit} title={canEdit ? type.label : `${type.label} — lecture seule`} className={`front-check check-${type.code} ${checked(row.id, type.code) ? 'checked' : ''}`} onClick={() => void onToggle(row.id, type.code)}>{iconByCode[type.code] ?? <Check size={14} />}<span>{type.label}</span>{checked(row.id, type.code) && <Check className="front-check-tick" size={13} />}</button>)}</div></div></article>
}
function QuickCheck({ label, checked, onClick, important = false }: { label: string, checked: boolean, onClick: (event: React.MouseEvent<HTMLButtonElement>) => void, important?: boolean }) {
  return <button onClick={onClick} className={`quick-check ${checked ? 'checked' : ''} ${important ? 'important' : ''}`}>{checked ? <Check size={15} /> : <X size={15} />}<span>{label}</span></button>
}
function Editable({ label, value, onSave, type = 'text' }: { label: string, value: string, onSave: (value: string) => Promise<void>, type?: string }) {
  const [draft, setDraft] = useState(value); useEffect(() => setDraft(value), [value])
  return <label>{label}<input type={type} step={type === 'number' ? '0.01' : undefined} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => draft !== value && void onSave(draft)} /></label>
}
function NoteEditor({ value, onSave }: { value: string, onSave: (value: string) => Promise<void> }) {
  const [draft, setDraft] = useState(value); useEffect(() => setDraft(value), [value])
  return <div className="drawer-section"><label>Note interne</label><textarea value={draft} placeholder="Information utile au Back Office…" onChange={(e) => setDraft(e.target.value)} onBlur={() => draft !== value && void onSave(draft)} /></div>
}
