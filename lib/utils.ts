export function formatKorDate(dateStr?: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}.`
}

export function formatDateTime(value?: string | null) {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString('ko-KR')
  } catch {
    return value
  }
}

export function getPublicAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export function normalizeBase64Png(dataUrl: string) {
  return dataUrl.replace(/^data:image\/png;base64,/, '')
}

export function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9-_가-힣]/g, '_')
}
