import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getEventById } from '@/lib/data'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, password } = body

    if (!eventId || !password) {
      return NextResponse.json({ error: '행사 ID와 비밀번호를 입력해 주세요.' }, { status: 400 })
    }

    const event = await getEventById(eventId)
    if (!event) {
      return NextResponse.json({ error: '행사 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    if (event.admin_password !== password) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set(`registry_admin_${eventId}`, `ok:${eventId}`, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 8
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '로그인 처리 중 서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
