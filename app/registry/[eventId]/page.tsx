import AttendeeForm from '@/components/attendee-form'
import { getEventById } from '@/lib/data'
import { getPublicAppUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function RegistryPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const event = await getEventById(eventId)

  if (!event) {
    return <div className="p-8">행사 정보를 찾을 수 없습니다.</div>
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <AttendeeForm event={event} baseUrl={getPublicAppUrl()} />
      </div>
    </main>
  )
}
