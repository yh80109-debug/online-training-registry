import { cookies } from 'next/headers'
import { getSupabaseAdminClient } from '@/lib/supabase-server'

export type EventRow = {
  id: string
  title: string
  event_date: string | null
  place: string | null
  organizer: string | null
  admin_password: string
  created_at: string
}

export type RegistrationRow = {
  id: string
  event_id: string
  organization: string
  position: string
  name: string
  signature_url: string
  submitted_at: string
}

export async function getEventById(eventId: string) {
  const supabase = getSupabaseAdminClient()
  const { data } = await supabase.from('events').select('*').eq('id', eventId).single()
  return data as EventRow | null
}

export async function getRecentEvents() {
  const supabase = getSupabaseAdminClient()
  const { data } = await supabase
    .from('events')
    .select('id,title,event_date,place,organizer,created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return data ?? []
}

export async function getRegistrationsByEventId(eventId: string) {
  const supabase = getSupabaseAdminClient()
  const { data } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('submitted_at', { ascending: true })

  return (data ?? []) as RegistrationRow[]
}

export async function isAdminAuthenticated(eventId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get(`registry_admin_${eventId}`)?.value
  return token === `ok:${eventId}`
}
