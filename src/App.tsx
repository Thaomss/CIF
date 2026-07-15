import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpDown, CalendarDays, Check, ChevronDown, ChevronRight, CircleCheck, Dog, Hash, Home,
  KeyRound, LogOut, Map as MapIcon, MapPin, MessageSquare, Phone, Plus, RefreshCw, Search, Sparkles,
  Tag, Trash2, Upload, Wallet, Wifi, X, AlertTriangle, UsersRound, Printer, SlidersHorizontal, Eye,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { hasSupabase, supabase } from './supabase'
import type { ArrivalDay, CallStatus, CheckType, Profile, Reservation, ReservationCheck } from './types'

const TECHNICAL_DOMAIN = 'camping.local'
const FRONT_CHECK_CODES = ['plan', 'key_ready', 'sticker', 'bracelets', 'dog'] as const
const statusLabels: Record<CallStatus, string> = {
  a_appeler: 'À appeler', message_laisse: 'Message laissé', a_rappeler: 'À rappeler', attente_client: 'En attente client', termine: 'Terminé',
}
const statusClass: Record<CallStatus, string> = {
  a_appeler: 'amber', message_laisse: 'purple', a_rappeler: 'orange', attente_client: 'blue', termine: 'green',
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

type CleanImportRow = { reservation_number: string, clean_status: string }
const cleanStatusMap: Record<string, string> = {
  CLEAN: 'clean',
  TO_BE_CLEANED: 'to_be_cleaned',
  IN_PROGRESS: 'in_progress',
  POSTPONED: 'postponed',
  TO_BE_CHECKED: 'to_be_checked',
  CHECKED: 'clean',
  TOUCH_UP: 'touch_up',
}
function parseCleanWorkbook(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: true })
  const unique = new Map<string, CleanImportRow>()
  raw.filter((row) => Object.values(row).some(Boolean)).forEach((row) => {
    const reservationNumber = String(getCell(row, ['Reservation Number', 'Numéro de réservation', 'Numero de reservation'])).trim()
    const rawStatus = String(getCell(row, ['Cleaning Status', 'Statut nettoyage', 'Etat nettoyage', 'État nettoyage'])).trim().toUpperCase().replace(/[\s-]+/g, '_')
    if (!reservationNumber || !rawStatus) return
    const cleanStatus = cleanStatusMap[rawStatus]
    if (cleanStatus) unique.set(reservationNumber, { reservation_number: reservationNumber, clean_status: cleanStatus })
  })
  return [...unique.values()]
}
function formatDay(date: string) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}
function dayName(date: string) { return `Arrivées du ${formatDay(date)}` }
function fullName(row: Reservation) { return `${row.lastname ?? ''} ${row.firstname ?? ''}`.trim() }

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
  const [workspace, setWorkspace] = useState<'back' | 'front'>('back')
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
  const [cleanImportSummary, setCleanImportSummary] = useState<{ updated: number, changed: number, notFound: number, ignored: number } | null>(null)
  const [cleanTracking, setCleanTracking] = useState(false)
  const [cleanBaselineReady, setCleanBaselineReady] = useState(false)
  const [changedCleanIds, setChangedCleanIds] = useState<Set<string>>(new Set())
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
    if (selected) await loadRows(selected.id)
    else { setRows([]); setChecks({}) }
  }
  async function loadRows(arrivalDayId: string) {
    if (!supabase) return
    const { data, error: loadError } = await supabase.from('reservations').select('*').eq('arrival_day_id', arrivalDayId).order('lastname')
    if (loadError) { setError(loadError.message); return }
    const nextRows = (data ?? []) as Reservation[]
    setRows(nextRows)
    await loadChecks(nextRows.map((row) => row.id))
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
    if (updateError) { alert(updateError.message); if (day) await loadRows(day.id) }
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
  async function importFile(file: File) {
    if (!supabase || !day) return
    setImporting(true); setImportSummary(null)
    try {
      const parsed = parseWorkbook(await file.arrayBuffer(), day.id)
      if (!parsed.length) throw new Error('Aucune réservation reconnue dans ce fichier.')
      const existingNumbers = new Set(rows.filter((row) => !row.is_last_minute).map((row) => row.reservation_number))
      const incomingNumbers = new Set(parsed.map((row) => row.reservation_number))
      const added = parsed.filter((row) => !existingNumbers.has(row.reservation_number)).length
      const updated = parsed.length - added
      const missing = [...existingNumbers].filter((number) => !incomingNumbers.has(number)).length
      for (let index = 0; index < parsed.length; index += 100) {
        const { error: importError } = await supabase.from('reservations').upsert(parsed.slice(index, index + 100), { onConflict: 'arrival_day_id,reservation_number' })
        if (importError) throw importError
      }
      await supabase.from('arrival_days').update({ updated_at: new Date().toISOString() }).eq('id', day.id)
      await loadDays(day.id); setImportSummary({ total: parsed.length, added, updated, missing })
    } catch (caught) { alert(caught instanceof Error ? caught.message : 'Impossible de mettre à jour les arrivées avec ce fichier.') }
    finally { setImporting(false); if (fileRef.current) fileRef.current.value = '' }
  }
  async function importCleanFile(file: File) {
    if (!supabase || !day) return
    setCleanImporting(true); setCleanImportSummary(null)
    const client = supabase
    try {
      const parsed = parseCleanWorkbook(await file.arrayBuffer())
      if (!parsed.length) throw new Error('Aucun état de nettoyage reconnu. Le fichier doit contenir les colonnes Reservation Number et Cleaning Status.')
      const byNumber = new Map(rows.map((row) => [row.reservation_number, row]))
      const matched = parsed.filter((item) => byNumber.has(item.reservation_number))
      const changedIds = matched.flatMap((item) => {
        const row = byNumber.get(item.reservation_number)
        return row && (row.clean_status ?? 'non_renseigne') !== item.clean_status ? [row.id] : []
      })
      const notFound = parsed.length - matched.length
      for (let index = 0; index < matched.length; index += 100) {
        const batch = matched.slice(index, index + 100)
        await Promise.all(batch.map(async (item) => {
          const row = byNumber.get(item.reservation_number)
          if (!row) return
          const { error: updateError } = await client.from('reservations').update({ clean_status: item.clean_status }).eq('id', row.id)
          if (updateError) throw updateError
        }))
      }
      await loadRows(day.id)
      if (cleanTracking) {
        if (cleanBaselineReady) setChangedCleanIds(new Set(changedIds))
        else { setCleanBaselineReady(true); setChangedCleanIds(new Set()) }
      }
      setCleanImportSummary({ updated: matched.length, changed: cleanTracking && cleanBaselineReady ? changedIds.length : 0, notFound, ignored: 0 })
    } catch (caught) {
      alert(caught instanceof Error ? caught.message : 'Impossible de mettre à jour les états des logements.')
    } finally {
      setCleanImporting(false)
      if (cleanFileRef.current) cleanFileRef.current.value = ''
    }
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
    const next: Record<'unset' | CallStatus, number> = { unset: 0, a_appeler: 0, message_laisse: 0, a_rappeler: 0, attente_client: 0, termine: 0 }
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

  return <div className={`app-shell ${workspace === 'front' ? 'front-shell' : ''}`}>
    <aside>
      <div className="logo"><div className="brand-mark small">C</div><div><strong>CIF Camping</strong><span>{workspace === 'front' ? 'Front Office' : 'Back Office'}</span></div></div>
      <nav>
        {canUseBack && <button className={workspace === 'back' ? 'active' : ''} onClick={() => setWorkspace('back')}><Home size={18} />Préparation CIF</button>}
        {(profile?.role === 'admin' || profile?.role === 'front_office' || profile?.role === 'direction') && <button className={workspace === 'front' ? 'active' : ''} onClick={() => { setWorkspace('front'); setExpanded(null) }}><UsersRound size={18} />Accueil arrivées</button>}
      </nav>
      <div className="session-block"><div className="session-title"><span>Journées</span>{canUseBack && <button title="Créer une journée" onClick={() => setShowNewDay(true)}><Plus size={15} /></button>}</div>
        <div className="session-list">{days.map((item) => <button key={item.id} className={item.id === day?.id ? 'current' : ''} onClick={() => void chooseDay(item)}><CalendarDays size={15} /><span>{new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${item.arrival_date}T12:00:00`))}</span></button>)}</div>
      </div>
      <div className="aside-bottom"><span className="connection live"><Wifi size={14} />Mise à jour en direct</span><span className="account-label">{profile?.display_name ?? profile?.username}</span><button className="ghost" onClick={() => supabase?.auth.signOut()}><LogOut size={17} />Déconnexion</button></div>
    </aside>

    <main className="content">
      <header><div><p className="eyebrow">{workspace === 'front' ? 'ACCUEIL DES ARRIVÉES' : 'JOURNÉE ACTIVE'}</p><h1>{day?.name ?? 'Aucune journée créée'}</h1><p>{rows.length} réservations{day?.updated_at ? ` · Dernière mise à jour ${new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(day.updated_at))}` : ''}</p></div>
        {workspace === 'back' && canUseBack && <div className="header-actions"><input ref={fileRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={(e) => e.target.files?.[0] && void importFile(e.target.files[0])} /><button className="secondary" onClick={() => fileRef.current?.click()} disabled={!day || importing}><Upload size={17} />{importing ? 'Mise à jour…' : 'Mettre à jour les arrivées'}</button><button className="primary" onClick={() => void addManual()} disabled={!day}><Plus size={17} />Ajouter une réservation</button><button className="danger-button" onClick={() => void deleteCurrentDay()} disabled={!day}><Trash2 size={17} />Supprimer la journée</button></div>}
      </header>
      {error && <div className="error page-error">{error}</div>}
      {!day ? <div className="empty"><h2>Aucune journée</h2><p>Créez le prochain samedi d’arrivées pour commencer.</p>{canUseBack && <button className="primary" onClick={() => setShowNewDay(true)}><Plus size={17} />Créer une journée</button>}</div> : workspace === 'front' ?
        <FrontOfficeView rows={rows} query={query} setQuery={setQuery} checked={checked} frontCheckTypes={frontCheckTypes} canEdit={canEditFront} onToggle={toggleCheck} cleanFileRef={cleanFileRef} cleanImporting={cleanImporting} onCleanImport={importCleanFile} cleanTracking={cleanTracking} cleanBaselineReady={cleanBaselineReady} changedCleanIds={changedCleanIds} onToggleTracking={() => { setCleanTracking((current) => !current); setCleanBaselineReady(false); setChangedCleanIds(new Set()) }} onClearChanges={() => setChangedCleanIds(new Set())} /> :
        <>
          <section className="progress-card"><div><span>Avancement de la préparation</span><strong>{counts.ready} / {rows.length} réservations prêtes</strong></div><div className="progress-value">{progress}%</div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></section>
          <section className="stats"><button onClick={() => setFilter('all')} className={filter === 'all' ? 'selected' : ''}><strong>{rows.length}</strong><span>Toutes</span></button><button onClick={() => setFilter('ready')} className={filter === 'ready' ? 'selected green-card' : ''}><strong>{counts.ready}</strong><span>CIF prêts</span></button><button onClick={() => setFilter('todo')} className={filter === 'todo' ? 'selected orange-card' : ''}><strong>{counts.todo}</strong><span>À préparer</span></button><button onClick={() => setFilter('call')} className={filter === 'call' ? 'selected' : ''}><strong>{counts.call}</strong><span>Suivi appel</span></button><button onClick={() => setFilter('due')} className={filter === 'due' ? 'selected' : ''}><strong>{counts.due}</strong><span>Avec solde</span></button></section>
          <section className="call-filter-panel"><div className="call-filter-heading"><Phone size={16} /><span>Statuts d’appel</span></div><div className="call-filter-bar"><button className={`all-status ${callFilter === 'all' ? 'active' : ''}`} onClick={() => { setCallFilter('all'); setVisibleCount(60) }}>Tous <strong>{rows.length}</strong></button>{(Object.keys(statusLabels) as CallStatus[]).map((status) => <button key={status} className={`${statusClass[status]} ${callFilter === status ? 'active' : ''}`} onClick={() => { setCallFilter((current) => current === status ? 'all' : status); setVisibleCount(60) }}>{statusLabels[status]} <strong>{callCounts[status]}</strong></button>)}</div></section>
          <section className="toolbar"><div className="search"><Search size={18} /><input value={query} onChange={(e) => { setQuery(e.target.value); setVisibleCount(60) }} placeholder="Rechercher un client, un numéro ou un emplacement…" /></div><div className="toolbar-right"><div className="work-filter-wrap"><button type="button" className={`work-filter-trigger ${Object.values(workFilters).some((value) => value !== 'all') ? 'active' : ''}`} onClick={(event) => { event.stopPropagation(); setShowWorkFilters((current) => !current) }}><SlidersHorizontal size={15} />Filtres{Object.values(workFilters).filter((value) => value !== 'all').length > 0 && <strong>{Object.values(workFilters).filter((value) => value !== 'all').length}</strong>}<ChevronDown size={14} /></button>{showWorkFilters && <div className="work-filter-menu" onClick={(event) => event.stopPropagation()}><div className="work-filter-title"><span>Afficher seulement</span><button type="button" onClick={() => setWorkFilters({ swikly: 'all', travel: 'all', cif: 'all' })}>Tout effacer</button></div>{([['swikly', 'Swikly'], ['travel', 'Participants'], ['cif', 'CIF']] as const).map(([key, label]) => <div className="work-filter-group" key={key}><span>{label}</span><div><button type="button" className={workFilters[key] === 'todo' ? 'selected todo' : ''} onClick={() => { setWorkFilters((current) => ({ ...current, [key]: current[key] === 'todo' ? 'all' : 'todo' })); setVisibleCount(60) }}>{workFilters[key] === 'todo' && <Check size={13} />}Non fait</button><button type="button" className={workFilters[key] === 'done' ? 'selected done' : ''} onClick={() => { setWorkFilters((current) => ({ ...current, [key]: current[key] === 'done' ? 'all' : 'done' })); setVisibleCount(60) }}>{workFilters[key] === 'done' && <Check size={13} />}Fait</button></div></div>)}</div>}</div><label className="sort-control"><ArrowUpDown size={15} /><select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="name">Nom</option><option value="unit">Emplacement</option><option value="status">CIF à traiter d’abord</option></select></label><span>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span></div></section>{Object.values(workFilters).some((value) => value !== 'all') && <div className="active-work-filters">{workFilters.swikly !== 'all' && <button onClick={() => setWorkFilters((current) => ({ ...current, swikly: 'all' }))}>Swikly {workFilters.swikly === 'done' ? 'fait' : 'non fait'} <X size={13} /></button>}{workFilters.travel !== 'all' && <button onClick={() => setWorkFilters((current) => ({ ...current, travel: 'all' }))}>Participants {workFilters.travel === 'done' ? 'faits' : 'non faits'} <X size={13} /></button>}{workFilters.cif !== 'all' && <button onClick={() => setWorkFilters((current) => ({ ...current, cif: 'all' }))}>CIF {workFilters.cif === 'done' ? 'fait' : 'non fait'} <X size={13} /></button>}<button className="clear-all" onClick={() => setWorkFilters({ swikly: 'all', travel: 'all', cif: 'all' })}>Effacer tout</button></div>}
          <section className="reservation-list">{filtered.slice(0, visibleCount).map((row) => <article key={row.id} className={`reservation ${checked(row.id, 'cif_ready') ? 'is-ready' : checked(row.id, 'swikly') || checked(row.id, 'travel_party') ? 'is-progress' : 'is-todo'} ${openCallMenu === row.id ? 'has-open-call-menu' : ''}`}><div className="row-main" onClick={() => setExpanded(row.id)}><span className="status-dot" /><div className="identity"><div className="avatar">{(row.firstname?.[0] ?? '?').toUpperCase()}{(row.lastname?.[0] ?? '').toUpperCase()}</div><div><h2>{(row.lastname ?? '').toUpperCase()} {row.firstname}{row.is_last_minute && <em>Last minute</em>}</h2><p><Hash size={14} />{row.reservation_number} · {row.booking_channel || 'Canal non renseigné'}</p></div></div><div className="stay"><span><Home size={15} />{row.accommodation_type || 'Hébergement non renseigné'}</span><span><MapPin size={15} />Emplacement {row.pitch || '—'}</span></div><div className="badges"><QuickCheck label={checkTypeByCode.swikly?.label ?? 'Swikly'} checked={checked(row.id, 'swikly')} onClick={(event) => { event.stopPropagation(); void toggleCheck(row.id, 'swikly') }} /><QuickCheck label={checkTypeByCode.travel_party?.label ?? 'Participants'} checked={checked(row.id, 'travel_party')} onClick={(event) => { event.stopPropagation(); void toggleCheck(row.id, 'travel_party') }} /><QuickCheck label={checkTypeByCode.cif_ready?.label ?? 'CIF prêt'} checked={checked(row.id, 'cif_ready')} important onClick={(event) => { event.stopPropagation(); void toggleCheck(row.id, 'cif_ready') }} /></div><div className="due"><Wallet size={16} /><strong>{Number(row.remaining_amount ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</strong><small>solde</small></div><div className={`row-call-status custom-call-select ${row.call_status ? statusClass[row.call_status] : 'unset'} ${openCallMenu === row.id ? 'is-open' : ''}`} onClick={(event) => event.stopPropagation()}><button type="button" className="call-status-trigger" onClick={() => setOpenCallMenu((current) => current === row.id ? null : row.id)}><Phone size={13} /><span>{row.call_status ? statusLabels[row.call_status] : 'Sans statut'}</span><ChevronDown size={14} /></button>{openCallMenu === row.id && <div className="call-status-menu"><button type="button" className={!row.call_status ? 'selected' : ''} onClick={() => { void patchReservation(row.id, { call_status: null }); setOpenCallMenu(null) }}>Sans statut{!row.call_status && <Check size={14} />}</button>{(Object.keys(statusLabels) as CallStatus[]).map((status) => <button type="button" key={status} className={row.call_status === status ? `selected ${statusClass[status]}` : statusClass[status]} onClick={() => { void patchReservation(row.id, { call_status: status }); setOpenCallMenu(null) }}>{statusLabels[status]}{row.call_status === status && <Check size={14} />}</button>)}</div>}</div><span className={`state-pill ${checked(row.id, 'cif_ready') ? 'ready' : checked(row.id, 'swikly') || checked(row.id, 'travel_party') ? 'progress' : 'todo'}`}>{checked(row.id, 'cif_ready') ? 'Prête' : checked(row.id, 'swikly') || checked(row.id, 'travel_party') ? 'En cours' : 'À traiter'}</span><ChevronRight className="row-chevron" size={17} />{saving === row.id && <RefreshCw className="spin row-saving" size={16} />}</div></article>)}
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
    {cleanImportSummary && <div className="modal-backdrop" onMouseDown={() => setCleanImportSummary(null)}><section className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-icon success"><Sparkles size={24} /></div><h2>Logements mis à jour</h2><p>Seul l’état Clean du Front Office a été modifié. Les informations et le travail du Back Office restent inchangés.</p><div className="summary-lines"><div><RefreshCw size={17} /><span>{cleanImportSummary.updated} états de logement lus · {cleanImportSummary.changed} changement{cleanImportSummary.changed !== 1 ? 's' : ''} détecté{cleanImportSummary.changed !== 1 ? 's' : ''}</span></div><div><AlertTriangle size={17} /><span>{cleanImportSummary.notFound} numéros de réservation non trouvés dans cette journée</span></div></div><div className="modal-actions"><button className="primary" onClick={() => setCleanImportSummary(null)}>Terminer</button></div></section></div>}
    {showNewDay && <div className="modal-backdrop" onMouseDown={() => setShowNewDay(false)}><section className="modal" onMouseDown={(e) => e.stopPropagation()}><h2>Nouvelle journée d’arrivées</h2><p>Chaque journée conserve ses réservations, coches et notes.</p><label>Date du samedi<input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} /></label><div className="modal-actions"><button className="secondary" onClick={() => setShowNewDay(false)}>Annuler</button><button className="primary" disabled={!newDate} onClick={() => void createDay()}>Créer la journée</button></div></section></div>}
  </div>
}

function cleanLabel(status: Reservation['clean_status']) {
  const labels: Record<string, string> = {
    clean: 'Clean', propre: 'Clean',
    to_be_cleaned: 'À nettoyer', non_propre: 'À nettoyer',
    in_progress: 'En cours', en_cours: 'En cours',
    postponed: 'Reporté',
    to_be_checked: 'À contrôler', a_controler: 'À contrôler',
    touch_up: 'Retouche',
    non_renseigne: 'Non renseigné',
  }
  return labels[status ?? 'non_renseigne'] ?? String(status ?? 'Non renseigné')
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
  const headers = [options.client && '<th>Client</th>', options.reservation && '<th>Réservation</th>', options.pitch && '<th>Emplacement</th>', options.accommodation && '<th>Hébergement</th>', options.clean && '<th>Clean</th>', options.checks && '<th>Plan</th><th>Clé</th><th>Macaron</th><th>Bracelets</th><th>Chien</th>'].filter(Boolean).join('')
  const cells = (row: Reservation) => [
    options.client && `<td class="client">${escape((row.lastname ?? '').toUpperCase())} ${escape(row.firstname)}</td>`,
    options.reservation && `<td>${escape(row.reservation_number)}</td>`,
    options.pitch && `<td>${escape(row.pitch || '—')}</td>`,
    options.accommodation && `<td>${escape(row.accommodation_type || '—')}</td>`,
    options.clean && `<td class="clean">${escape(cleanLabel(row.clean_status))}</td>`,
    options.checks && ['plan', 'key_ready', 'sticker', 'bracelets', 'dog'].map((code) => `<td class="box">${checked(row.id, code) ? '✓' : '□'}</td>`).join(''),
  ].filter(Boolean).join('')
  popup.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${escape(title)}</title><style>
    @page{size:A4 landscape;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172b24;margin:0}h1{font-size:22px;margin:0 0 4px}p{margin:0 0 14px;color:#65736e;font-size:12px}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #aebbb6;padding:6px 7px;text-align:left;vertical-align:middle}th{background:#edf3f0;font-size:9px;text-transform:uppercase;letter-spacing:.04em}.box{text-align:center;font-size:14px;width:55px}.clean{font-weight:700;white-space:nowrap}.client{font-weight:700}
  </style></head><body><h1>${escape(title)}</h1><p>${orderedRows.length} réservation${orderedRows.length > 1 ? 's' : ''} · triées par ${options.sort === 'pitch' ? 'emplacement' : 'nom'} · imprimé le ${new Date().toLocaleString('fr-FR')}</p><table><thead><tr>${headers}</tr></thead><tbody>${orderedRows.map((row) => `<tr>${cells(row)}</tr>`).join('')}</tbody></table><script>window.onload=()=>{window.print()}<\/script></body></html>`)
  popup.document.close()
}

function FrontOfficeView({ rows, query, setQuery, checked, frontCheckTypes, canEdit, onToggle, cleanFileRef, cleanImporting, onCleanImport, cleanTracking, cleanBaselineReady, changedCleanIds, onToggleTracking, onClearChanges }: {
  rows: Reservation[], query: string, setQuery: (value: string) => void, checked: (id: string, code: string) => boolean,
  frontCheckTypes: CheckType[], canEdit: boolean, onToggle: (id: string, code: string) => Promise<void>,
  cleanFileRef: React.RefObject<HTMLInputElement>, cleanImporting: boolean, onCleanImport: (file: File) => Promise<void>,
  cleanTracking: boolean, cleanBaselineReady: boolean, changedCleanIds: Set<string>, onToggleTracking: () => void, onClearChanges: () => void,
}) {
  const [frontSort, setFrontSort] = useState<'name' | 'pitch'>('name')
  const needle = query.trim().toLocaleLowerCase('fr')
  const searched = useMemo(() => sortFrontRows(rows.filter((row) => !needle || [row.firstname, row.lastname, row.reservation_number, row.pitch, row.accommodation_type].some((value) => String(value ?? '').toLocaleLowerCase('fr').includes(needle))), frontSort), [rows, needle, frontSort])
  const ready = searched.filter((row) => checked(row.id, 'cif_ready'))
  const notReady = searched.filter((row) => !checked(row.id, 'cif_ready'))
  const setupMissing = FRONT_CHECK_CODES.some((code) => !frontCheckTypes.some((type) => type.code === code)) || rows.some((row) => !('clean_status' in row))
  return <div className="front-workspace">
    <section className="front-hero"><div><span>Suivi accueil en temps réel</span><strong>{ready.length} CIF prêts · {notReady.length} CIF pas OK</strong></div><div className="front-hero-actions">
      <button className={`front-track-toggle ${cleanTracking ? 'active' : ''}`} onClick={onToggleTracking}><Eye size={16} />{cleanTracking ? (cleanBaselineReady ? 'Suivi actif' : 'Suivi prêt') : 'Vérifier les changements'}</button>
      {changedCleanIds.size > 0 && <button className="front-clear-changes" onClick={onClearChanges}>{changedCleanIds.size} modifiée{changedCleanIds.size > 1 ? 's' : ''} · effacer</button>}
      <input ref={cleanFileRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={(event) => event.target.files?.[0] && void onCleanImport(event.target.files[0])} /><button className="front-clean-import" disabled={!canEdit || cleanImporting} onClick={() => cleanFileRef.current?.click()} title="Met uniquement à jour l’état Clean à partir du numéro de réservation"><Upload size={16} />{cleanImporting ? 'Mise à jour…' : 'Mettre à jour les logements'}</button>
      <label className="front-sort"><ArrowUpDown size={15} /><select value={frontSort} onChange={(event) => setFrontSort(event.target.value as 'name' | 'pitch')}><option value="name">Nom</option><option value="pitch">Emplacement</option></select></label>
      <div className="front-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, réservation ou emplacement…" /></div></div></section>
    {cleanTracking && !cleanBaselineReady && <div className="front-tracking-info"><Eye size={16} /><span>Le prochain tableau servira de point de départ. Les suivants signaleront uniquement les logements dont l’état a changé.</span></div>}
    {setupMissing && <div className="front-setup-warning"><AlertTriangle size={18} /><div><strong>Une étape Supabase est nécessaire</strong><span>Exécutez le fichier <code>supabase/front_office_v2.sql</code> une seule fois pour activer l’état Clean et les contrôles Plan, Clé, Macaron, Bracelets et Chien.</span></div></div>}
    <div className="front-boards">
      <FrontBoard title="CIF prêts" subtitle="Dossiers validés par le Back Office" tone="ready" rows={ready} checked={checked} types={frontCheckTypes} canEdit={canEdit} onToggle={onToggle} changedCleanIds={changedCleanIds} />
      <FrontBoard title="CIF pas OK" subtitle="En attente de validation du Back Office" tone="pending" rows={notReady} checked={checked} types={frontCheckTypes} canEdit={canEdit} onToggle={onToggle} changedCleanIds={changedCleanIds} />
    </div>
  </div>
}
function FrontBoard({ title, subtitle, tone, rows, checked, types, canEdit, onToggle, changedCleanIds }: {
  title: string, subtitle: string, tone: 'ready' | 'pending', rows: Reservation[], checked: (id: string, code: string) => boolean,
  types: CheckType[], canEdit: boolean, onToggle: (id: string, code: string) => Promise<void>, changedCleanIds: Set<string>,
}) {
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const [printOptions, setPrintOptions] = useState<FrontPrintOptions>({ sort: 'name', client: true, reservation: true, pitch: true, accommodation: true, clean: true, checks: true })
  return <section className={`front-board ${tone}`}><header><div><span className="front-board-dot" /><div><h2>{title}</h2><p>{subtitle}</p></div></div><div className="front-board-actions"><div className="front-print-wrap"><button onClick={() => setShowPrintOptions((current) => !current)} disabled={!rows.length} title={`Choisir puis imprimer la liste ${title}`}><Printer size={15} />Imprimer<ChevronDown size={13} /></button>{showPrintOptions && <div className="front-print-options"><strong>Impression</strong><label>Ordre<select value={printOptions.sort} onChange={(event) => setPrintOptions((current) => ({ ...current, sort: event.target.value as 'name' | 'pitch' }))}><option value="name">Nom</option><option value="pitch">Emplacement</option></select></label>{([['client','Client'],['reservation','Réservation'],['pitch','Emplacement'],['accommodation','Hébergement'],['clean','Clean'],['checks','Cases accueil']] as const).map(([key,label]) => <label className="print-check" key={key}><input type="checkbox" checked={printOptions[key]} onChange={() => setPrintOptions((current) => ({ ...current, [key]: !current[key] }))} />{label}</label>)}<button className="print-confirm" onClick={() => { printFrontBoard(title, rows, checked, printOptions); setShowPrintOptions(false) }}><Printer size={14} />Lancer l’impression</button></div>}</div><strong>{rows.length}</strong></div></header><div className="front-board-columns"><span>Client</span><span>Préparation accueil</span></div><div className="front-board-list">{rows.map((row) => <FrontRow key={row.id} row={row} checked={checked} types={types} canEdit={canEdit} onToggle={onToggle} cleanChanged={changedCleanIds.has(row.id)} />)}{!rows.length && <div className="front-empty">Aucune réservation dans cette liste.</div>}</div></section>
}
function FrontRow({ row, checked, types, canEdit, onToggle, cleanChanged }: { row: Reservation, checked: (id: string, code: string) => boolean, types: CheckType[], canEdit: boolean, onToggle: (id: string, code: string) => Promise<void>, cleanChanged: boolean }) {
  const iconByCode: Record<string, React.ReactNode> = { plan: <MapIcon size={14} />, key_ready: <KeyRound size={14} />, sticker: <Tag size={14} />, bracelets: <CircleCheck size={14} />, dog: <Dog size={14} /> }
  const ordered = FRONT_CHECK_CODES.map((code) => types.find((type) => type.code === code)).filter(Boolean) as CheckType[]
  const cleanStatus = row.clean_status ?? 'non_renseigne'
  return <article className={`front-row ${cleanChanged ? 'clean-changed' : ''}`}><div className="front-client"><div className="avatar">{(row.firstname?.[0] ?? '?').toUpperCase()}{(row.lastname?.[0] ?? '').toUpperCase()}</div><div><h3>{(row.lastname ?? '').toUpperCase()} {row.firstname}{cleanChanged && <span className="clean-change-badge" title="L’état Clean a changé lors de la dernière mise à jour"><RefreshCw size={11} />Modifié</span>}</h3><p><Hash size={13} />{row.reservation_number}</p><span><MapPin size={13} />{row.pitch || 'Sans emplacement'} · {row.accommodation_type || 'Hébergement non renseigné'}</span></div></div><div className="front-preparation"><div className={`clean-status ${cleanStatus}`} title="État mis à jour par le tableau des logements"><Sparkles size={14} /><span>Clean</span><strong>{cleanLabel(cleanStatus)}</strong></div><div className="front-checks">{ordered.map((type) => <button key={type.id} disabled={!canEdit} title={canEdit ? type.label : `${type.label} — lecture seule`} className={`front-check ${checked(row.id, type.code) ? 'checked' : ''}`} onClick={() => void onToggle(row.id, type.code)}>{iconByCode[type.code] ?? <Check size={14} />}<span>{type.label}</span>{checked(row.id, type.code) && <Check className="front-check-tick" size={13} />}</button>)}</div></div></article>
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
