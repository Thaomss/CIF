export type AppRole = 'admin' | 'back_office' | 'front_office' | 'direction'
export type CallStatus = 'a_appeler' | 'message_laisse' | 'a_rappeler' | 'attente_client' | 'termine'

export type Profile = {
  id: string
  username: string
  display_name: string
  role: AppRole
  is_active: boolean
}

export type ArrivalDay = {
  id: string
  name: string
  arrival_date: string
  status: 'open' | 'archived'
  created_at?: string
  updated_at?: string
}

export type Reservation = {
  id: string
  arrival_day_id: string
  reservation_number: string
  firstname: string | null
  lastname: string | null
  booking_channel: string | null
  accommodation_type: string | null
  pitch: string | null
  remaining_amount: number | null
  is_last_minute: boolean
  source: 'import' | 'manual'
  call_status: CallStatus | null
  internal_note: string | null
  clean_status?: 'non_renseigne' | 'clean' | 'to_be_cleaned' | 'in_progress' | 'postponed' | 'to_be_checked' | 'touch_up' | string | null
  created_at?: string
  updated_at?: string
}

export type Department = {
  id: string
  code: string
  name: string
}

export type CheckType = {
  id: string
  department_id: string
  code: string
  label: string
  description: string | null
  sort_order: number
  is_required: boolean
  is_active: boolean
}

export type ReservationCheck = {
  id?: string
  reservation_id: string
  check_type_id: string
  is_checked: boolean
  updated_at?: string
}
