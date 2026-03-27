import AdminLoginForm from '@/components/admin-login-form'
import { getEventById, getRegistrationsByEventId, isAdminAuthenticated } from '@/lib/data'
import { formatDateTime, formatKorDate, getPublicAppUrl } from '@/lib/utils'
import PrintButton from '@/components/print-button'
import QrPanel from '@/components/qr-panel'

export const dynamic = 'force-dynamic'

export default async function AdminRegistryPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const event = await getEventById(eventId)

  if (!event) {
    return <div className="p-8">행사 정보를 찾을 수 없습니다.</div>
  }

  const authenticated = await isAdminAuthenticated(eventId)
  if (!authenticated) {
    return (
      <main className="min-h-screen p-6 md:p-10">
        <div className="mx-auto max-w-3xl">
          <AdminLoginForm eventId={eventId} />
        </div>
      </main>
    )
  }

  const registrations = await getRegistrationsByEventId(eventId)
  const attendeeUrl = `${getPublicAppUrl()}/registry/${eventId}`

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="print-hidden flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">관리자 등록부</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">행사별 참석자 등록 현황과 서명을 확인하고 인쇄할 수 있습니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <form action="/api/admin-logout" method="post">
              <input type="hidden" name="eventId" value={eventId} />
              <button className="rounded-2xl border px-4 py-3 text-sm">잠금</button>
            </form>
            <PrintButton />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] print:block">
          <section className="rounded-3xl border bg-white p-8 shadow-sm print:border print:shadow-none">
            <h2 className="text-center text-2xl font-semibold">온라인 연수 등록부</h2>

            <div className="mt-6 grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm leading-7 md:grid-cols-2 print:bg-white">
              <div><span className="font-medium">연수명</span> {event.title}</div>
              <div><span className="font-medium">일시</span> {formatKorDate(event.event_date)}</div>
              <div><span className="font-medium">장소</span> {event.place ?? '미입력'}</div>
              <div><span className="font-medium">주관</span> {event.organizer ?? '미입력'}</div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border p-2">번호</th>
                    <th className="border p-2">소속</th>
                    <th className="border p-2">직위</th>
                    <th className="border p-2">이름</th>
                    <th className="border p-2">서명</th>
                    <th className="border p-2">제출 시각</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-32 border p-2 text-center text-slate-400">
                        아직 등록된 참석자가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">{item.organization}</td>
                        <td className="border p-2">{item.position}</td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2 text-center">
                          <img src={item.signature_url} alt={`${item.name} 서명`} className="mx-auto h-12 object-contain" />
                        </td>
                        <td className="border p-2 text-xs text-slate-500">{formatDateTime(item.submitted_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="print-hidden rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">QR 재확인</h2>
            <div className="mt-5"><QrPanel url={attendeeUrl} /></div>
          </aside>
        </div>
      </div>
    </main>
  )
}
