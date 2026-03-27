import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '온라인 연수 등록부',
  description: 'QR 기반 온라인 연수 등록부 및 전자서명 시스템'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
