import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const eventId = String(formData.get('eventId') ?? '')

  if (eventId) {
    const cookieStore = await cookies()
    cookieStore.delete(`registry_admin_${eventId}`)
  }

  return NextResponse.redirect(new URL(`/admin/registry/${eventId}`, req.url))
}
