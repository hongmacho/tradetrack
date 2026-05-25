'use client'

import { useState } from 'react'
import { formatKRW } from '@/lib/utils'
import type { InvoiceItem } from '@/types'

interface InvoiceItemsProps {
  items: InvoiceItem[]
  onChange: (items: InvoiceItem[]) => void
  readonly?: boolean
}

const EMPTY_ITEM: InvoiceItem = { label: '', qty: 1, unitPrice: 0 }

export function InvoiceItems({ items, onChange, readonly = false }: InvoiceItemsProps) {
  function updateItem(index: number, patch: Partial<InvoiceItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...items, { ...EMPTY_ITEM }])
  }

  const total = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-3 space-y-2">
          {readonly ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-800">{item.label}</span>
              <span className="text-sm font-medium text-slate-900">
                {item.qty} × {formatKRW(item.unitPrice)} = {formatKRW(item.qty * item.unitPrice)}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(i, { label: e.target.value })}
                  placeholder="항목명"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-slate-500">수량</label>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateItem(i, { qty: Math.max(1, Number(e.target.value)) })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500">단가 (원)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(i, { unitPrice: Math.max(0, Number(e.target.value)) })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <p className="text-right text-xs text-slate-500">
                소계: <span className="font-medium text-slate-800">{formatKRW(item.qty * item.unitPrice)}</span>
              </p>
            </>
          )}
        </div>
      ))}

      {!readonly && (
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 w-full justify-center rounded-lg border border-dashed border-slate-300 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          항목 추가
        </button>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
        <span className="text-sm font-semibold text-slate-700">합계</span>
        <span className="text-lg font-bold text-slate-900">{formatKRW(total)}</span>
      </div>
    </div>
  )
}
