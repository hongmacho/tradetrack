'use client'

import { useState, useRef } from 'react'

interface PhotoUploadProps {
  jobId: string
  onUploaded?: () => void
}

export function PhotoUpload({ jobId, onUploaded }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    try {
      const body = new FormData()
      body.append('photo', file)

      const res = await fetch(`/api/jobs/${jobId}/photos`, { method: 'POST', body })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? '업로드 실패')
      }
      onUploaded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 w-full justify-center"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {uploading ? '업로드 중...' : '사진 추가'}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
