import Link from 'next/link'
import CreateEventForm from '@/components/create-event-form'
import { getPublicAppUrl } from '@/lib/utils'

export default function CreateEventPage() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">행사 생성</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">행사별 참석 URL과 관리자 URL을 생성합니다.</p>
          </div>
          <Link href="/" className="rounded-2xl border px-4 py-3 text-sm">홈으로</Link>
        </div>
        <CreateEventForm baseUrl={getPublicAppUrl()} />
      </div>
    </main>
  )
}
