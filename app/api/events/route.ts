import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, eventDate, place, organizer, adminPassword } = body

    if (!title || !adminPassword) {
      return NextResponse.json({ error: '연수명과 관리자 비밀번호는 필수입니다.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        event_date: eventDate,
        place,
        organizer,
        admin_password: adminPassword
      })
      .select('id,title')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ event: data })
  } catch {
    return NextResponse.json({ error: '행사 생성 중 서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
