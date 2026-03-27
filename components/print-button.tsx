'use client'

export default function PrintButton() {
  return (
    <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white" onClick={() => window.print()}>
      인쇄하기
    </button>
  )
}
