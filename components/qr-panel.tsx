'use client'

import { QRCodeCanvas } from 'qrcode.react'

export default function QrPanel({ url }: { url: string }) {
  return (
    <>
      <div className="flex justify-center rounded-3xl border bg-white p-6">
        <QRCodeCanvas value={url} size={220} includeMargin />
      </div>
      <div className="mt-4 break-all rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{url}</div>
    </>
  )
}
