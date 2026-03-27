'use client'

import { useMemo, useState } from 'react'
import SignatureCanvas from '@/components/signature-canvas'
import QrPanel from '@/components/qr-panel'

type EventProps = {
  id: string
  title: string
  event_date: string | null
  place: string | null
  organizer: string | null
}

export default function AttendeeForm({ event, baseUrl }: { event: EventProps; baseUrl: string }) {
  const [organization, setOrganization] = useState('')
  const [position, setPosition] = useState('')
  const [name, setName] = useState('')
  const [signatureDataUrl, setSignatureDataUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('')

  const attendeeUrl = useMemo(() => `${baseUrl}/registry/${event.id}`, [baseUrl, event.id])

  const handleSubmit = async () => {
    if (!organization || !position || !name) {
      setMessage('소속, 직위, 이름을 모두 입력해 주세요.')
      return
    }

    if (!signatureDataUrl) {
      setMessage('서명을 저장해 주세요.')
      return
    }

    setLoading(true)
    setMessage('')

    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        organization,
        position,
        name,
        signatureDataUrl
      })
    })

    const result = await res.json()

    if (!res.ok) {
      setLoading(false)
      setMessage(result.error || '저장 중 오류가 발생했습니다.')
      return
    }

    setDone(true)
    setLoading(false)
    setOrganization('')
    setPosition('')
    setName('')
    setSignatureDataUrl('')
  }

  if (done) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">등록이 완료되었습니다.</h1>
        <p className="mt-3 text-slate-600">연수 참석 등록이 정상적으로 저장되었습니다.</p>
        <button className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-white" onClick={() => setDone(false)}>
          다른 참석자 등록하기
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">온라인 연수 등록</h1>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            <div className="text-lg font-semibold text-slate-900">{event.title}</div>
            <div>일시 {event.event_date ?? '미입력'}</div>
            <div>장소 {event.place ?? '미입력'}</div>
            <div>주관 {event.organizer ?? '미입력'}</div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">소속</label>
              <input className="h-12 w-full rounded-2xl border px-4" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="예 충청남도교육청" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">직위</label>
              <input className="h-12 w-full rounded-2xl border px-4" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="예 장학사" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">이름</label>
              <input className="h-12 w-full rounded-2xl border px-4" value={name} onChange={(e) => setName(e.target.value)} placeholder="예 홍길동" />
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">전자서명</div>
            <SignatureCanvas onChangeSignature={setSignatureDataUrl} />
          </div>

          {message && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</div>}

          <button className="h-12 w-full rounded-2xl bg-slate-900 px-4 text-white disabled:opacity-50" onClick={handleSubmit} disabled={loading}>
            {loading ? '저장 중...' : '입력 완료 및 서명하기'}
          </button>

          <div className="text-xs leading-6 text-slate-500">
            입력한 정보는 연수 등록 및 참석 확인을 위한 용도로만 사용됩니다.
          </div>
        </div>
      </section>

      <aside className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">QR 접속 안내</h2>
        <div className="space-y-5">
          <QrPanel url={attendeeUrl} />
          <div className="text-sm leading-6 text-slate-600">
            이 QR코드는 공개 배포된 URL을 기준으로 생성됩니다.
          </div>
        </div>
      </aside>
    </div>
  )
}
