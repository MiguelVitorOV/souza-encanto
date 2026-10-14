'use client'

import { useEffect } from 'react'
import { SizeCategory } from '@/types'
import { Ruler, X, Info } from 'lucide-react'

interface MeasurementModalProps {
  isOpen: boolean
  onClose: () => void
  sizeCategory: SizeCategory
}

export function MeasurementModal({
  isOpen,
  onClose,
  sizeCategory
}: MeasurementModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-brand-200/90 z-10 p-6 sm:p-8 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-brand-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border-2 border-brand-200 text-brand-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Ruler size={24} />
            </div>
            <div>
              <h3
                id="modal-title"
                className="font-fredoka text-xl sm:text-2xl text-brand-900 font-bold leading-tight"
              >
                {sizeCategory.name}
              </h3>
              <p className="text-xs sm:text-sm text-brand-900/60">
                Guia Oficial de Medidas • Mundo de Criança
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-brand-50 hover:bg-brand-100 text-stone-500 hover:text-brand-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar tabela de medidas"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chips de tamanhos */}
        {sizeCategory.sizes && sizeCategory.sizes.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-brand-900/70 uppercase tracking-wider block mb-2">
              Tamanhos Inclusos nesta Grade
            </span>
            <div className="flex flex-wrap gap-2">
              {sizeCategory.sizes.map((s) => (
                <span
                  key={s}
                  className="bg-brand-50 border border-brand-200 text-brand-900 font-bold px-3 py-1 rounded-xl text-xs sm:text-sm shadow-2xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabela de Medidas */}
        {sizeCategory.measurement_table && (
          <div className="bg-brand-50/60 p-4 sm:p-5 rounded-2xl border border-brand-200/80">
            <span className="text-[11px] font-bold text-brand-900/70 uppercase tracking-wider block mb-2.5">
              Tabela de Medidas (cm)
            </span>
            <pre className="font-mono text-xs sm:text-sm text-brand-900/90 whitespace-pre-wrap leading-relaxed">
              {sizeCategory.measurement_table}
            </pre>
          </div>
        )}

        {/* Instruções / Observações */}
        {sizeCategory.measurement_description && (
          <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200/90 flex items-start gap-3">
            <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
              <span className="font-bold block mb-0.5 text-amber-900">
                Dicas para Medição:
              </span>
              {sizeCategory.measurement_description}
            </div>
          </div>
        )}

        {/* Botão de Fechar */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-fredoka text-base py-3.5 rounded-2xl font-bold transition-all shadow-md active:scale-98 cursor-pointer"
          >
            Entendi, fechar medidas
          </button>
        </div>
      </div>
    </div>
  )
}
