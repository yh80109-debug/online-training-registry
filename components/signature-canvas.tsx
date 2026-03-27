'use client'

import { useRef } from 'react'
import SignatureCanvasLib from 'react-signature-canvas'

export default function SignatureCanvas({
  onChangeSignature
}: {
  onChangeSignature: (value: string) => void
}) {
  const sigRef = useRef<SignatureCanvasLib | null>(null)

  const handleSave = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return
    const dataUrl = sigRef.current.toDataURL('image/png')
    onChangeSignature(dataUrl)
  }

  const handleClear = () => {
    sigRef.current?.clear()
    onChangeSignature('')
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border bg-white p-2">
        <SignatureCanvasLib
          ref={sigRef}
          penColor="black"
          canvasProps={{
            className: 'h-[220px] w-full rounded-xl'
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-2xl border px-4 py-2" onClick={handleClear}>
          다시 쓰기
        </button>
        <button type="button" className="rounded-2xl bg-slate-900 px-4 py-2 text-white" onClick={handleSave}>
          서명 저장
        </button>
      </div>
    </div>
  )
}
