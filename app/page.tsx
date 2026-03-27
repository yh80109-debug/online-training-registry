import Link from 'next/link'
import { getRecentEvents } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const events = await getRecentEvents()

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              QR 기반 전자서명 등록부
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">온라인 연수 등록부</h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              참석자는 QR코드로 접속해 소속, 직위, 이름을 입력한 뒤 손글씨 서명을 남길 수 있고,
              관리자는 행사별 등록부를 조회하고 출력할 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/admin/create-event" className="rounded-2xl bg-slate-900 px-5 py-3 text-white">
                새 행사 만들기
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">최근 생성된 행사</h2>
            <div className="text-sm text-slate-500">최대 10건</div>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-slate-500">아직 생성된 행사가 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-slate-500">{event.event_date ?? '일자 미입력'} · {event.place ?? '장소 미입력'}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/registry/${event.id}`} className="rounded-xl border px-3 py-2 text-sm">
                      참석자 페이지
                    </Link>
                    <Link href={`/admin/registry/${event.id}`} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">
                      관리자 페이지
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
