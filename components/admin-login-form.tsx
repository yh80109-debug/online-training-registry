'use client'

import { useState } from 'react'

export default function AdminLoginForm({ eventId }: { eventId: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, password })
    })

    const result = await res.json()

    if (!res.ok) {
      setError(result.error || '로그인에 실패했습니다.')
      setLoading(false)
      return
    }

    window.location.reload()
  }

  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">관리자 확인</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        관리자 등록부를 보려면 행사 생성 시 설정한 비밀번호를 입력하세요.
      </p>
      <div className="mt-6 space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 w-full rounded-2xl border px-4"
          placeholder="관리자 비밀번호"
        />
        {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        <button onClick={handleSubmit} disabled={loading} className="rounded-2xl bg-slate-900 px-5 py-3 text-white disabled:opacity-50">
          {loading ? '확인 중...' : '관리자 화면 열기'}
        </button>
      </div>
    </div>
  )
}
