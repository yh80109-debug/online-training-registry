'use client'

import { useState } from 'react'

type CreatedEvent = {
  id: string
  title: string
}

export default function CreateEventForm({ baseUrl }: { baseUrl: string }) {
  const [title, setTitle] = useState('2026 학교공간혁신 사업관계자 온라인 연수')
  const [eventDate, setEventDate] = useState('')
  const [place, setPlace] = useState('충청남도교육청 연수원')
  const [organizer, setOrganizer] = useState('충청남도교육청 미래학교추진단')
  const [adminPassword, setAdminPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<CreatedEvent | null>(null)

  const handleCreate = async () => {
    if (!title.trim() || !adminPassword.trim()) {
      setError('연수명과 관리자 비밀번호를 입력해 주세요.')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        eventDate: eventDate || null,
        place,
        organizer,
        adminPassword
      })
    })

    const result = await res.json()

    if (!res.ok) {
      setLoading(false)
      setError(result.error || '행사 생성에 실패했습니다.')
      return
    }

    setCreated(result.event)
    setLoading(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">새 행사 만들기</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          행사 정보를 입력하면 참석자 URL과 관리자 URL이 생성됩니다. QR코드는 공개 배포 URL을 기준으로 작동합니다.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">연수명</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 w-full rounded-2xl border px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">일자</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="h-12 w-full rounded-2xl border px-4" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">장소</label>
            <input value={place} onChange={(e) => setPlace(e.target.value)} className="h-12 w-full rounded-2xl border px-4" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">주관</label>
            <input value={organizer} onChange={(e) => setOrganizer(e.target.value)} className="h-12 w-full rounded-2xl border px-4" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">관리자 비밀번호</label>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="h-12 w-full rounded-2xl border px-4" placeholder="행사별 관리자 비밀번호" />
          </div>
        </div>

        {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <button onClick={handleCreate} disabled={loading} className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-white disabled:opacity-50">
          {loading ? '생성 중...' : '행사 생성하기'}
        </button>
      </section>

      <aside className="rounded-3xl border bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold">생성 결과</h2>
        {!created ? (
          <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-500">아직 생성된 행사가 없습니다.</div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              <div className="font-medium text-slate-900">{created.title}</div>
              <div>ID {created.id}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="font-medium">참석자 URL</div>
              <a className="break-all text-blue-700 underline" href={`${baseUrl}/registry/${created.id}`}>
                {baseUrl}/registry/{created.id}
              </a>
            </div>
            <div className="space-y-2 text-sm">
              <div className="font-medium">관리자 URL</div>
              <a className="break-all text-blue-700 underline" href={`${baseUrl}/admin/registry/${created.id}`}>
                {baseUrl}/admin/registry/{created.id}
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
