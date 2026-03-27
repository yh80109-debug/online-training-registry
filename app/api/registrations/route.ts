import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-server'
import { normalizeBase64Png, safeFileName } from '@/lib/utils'

function base64ToBuffer(dataUrl: string) {
  const base64 = normalizeBase64Png(dataUrl)
  return Buffer.from(base64, 'base64')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, organization, position, name, signatureDataUrl } = body

    if (!eventId || !organization || !position || !name || !signatureDataUrl) {
      return NextResponse.json({ error: '필수값이 누락되었습니다.' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()

    const { data: duplicated } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('organization', organization)
      .eq('name', name)
      .limit(1)

    if (duplicated && duplicated.length > 0) {
      return NextResponse.json({ error: '같은 소속과 이름으로 이미 등록된 내역이 있습니다.' }, { status: 409 })
    }

    const registrationId = crypto.randomUUID()
    const filePath = `${eventId}/${registrationId}-${safeFileName(name)}.png`
    const buffer = base64ToBuffer(signatureDataUrl)

    const uploadResult = await supabase.storage.from('signatures').upload(filePath, buffer, {
      contentType: 'image/png',
      upsert: false
    })

    if (uploadResult.error) {
      return NextResponse.json({ error: uploadResult.error.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage.from('signatures').getPublicUrl(filePath)

    const insertResult = await supabase.from('registrations').insert({
      id: registrationId,
      event_id: eventId,
      organization,
      position,
      name,
      signature_url: publicUrlData.publicUrl
    })

    if (insertResult.error) {
      return NextResponse.json({ error: insertResult.error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '등록 저장 중 서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
