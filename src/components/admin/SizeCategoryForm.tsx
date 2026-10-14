'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { SizeCategory } from '@/types'
import { Ruler, Plus, X, Sparkles, Check, Info } from 'lucide-react'

interface SizeCategoryFormProps {
  initialData?: SizeCategory
}

const PRESET_SUGGESTIONS = [
  { label: 'Bebê (RN a GG)', sizes: ['RN', 'P', 'M', 'G', 'GG'] },
  { label: 'Primeiros Passos (1 a 3)', sizes: ['01', '02', '03'] },
  { label: 'Infantil (4 ao 10)', sizes: ['04', '06', '08', '10'] },
  { label: 'Juvenil (12 ao 16)', sizes: ['12', '14', '16'] },
  { label: 'Tamanho Único', sizes: ['U'] }
]

export function SizeCategoryForm({ initialData }: SizeCategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(initialData?.name || '')
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || [])
  const [newSizeInput, setNewSizeInput] = useState('')
  const [measurementTable, setMeasurementTable] = useState(
    initialData?.measurement_table || ''
  )
  const [measurementDescription, setMeasurementDescription] = useState(
    initialData?.measurement_description || ''
  )

  const handleAddSize = () => {
    const trimmed = newSizeInput.trim().toUpperCase()
    if (!trimmed) return
    if (!sizes.includes(trimmed)) {
      setSizes((prev) => [...prev, trimmed])
    }
    setNewSizeInput('')
  }

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes((prev) => prev.filter((s) => s !== sizeToRemove))
  }

  const handleApplyPreset = (presetSizes: string[]) => {
    const combined = Array.from(new Set([...sizes, ...presetSizes]))
    setSizes(combined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sizes.length === 0) {
      alert('Por favor, adicione ao menos um tamanho para esta grade.')
      return
    }

    setLoading(true)

    const payload = {
      name: name.trim(),
      sizes,
      measurement_table: measurementTable.trim() || null,
      measurement_description: measurementDescription.trim() || null
    }

    if (initialData?.id) {
      const { error } = await supabase
        .from('size_categories')
        .update(payload)
        .eq('id', initialData.id)

      if (error) {
        alert('Erro ao atualizar grade de tamanhos: ' + error.message)
      } else {
        router.push('/admin/tamanhos')
      }
    } else {
      const { error } = await supabase.from('size_categories').insert([payload])

      if (error) {
        alert('Erro ao cadastrar grade de tamanhos: ' + error.message)
      } else {
        router.push('/admin/tamanhos')
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna do Formulário (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-brand-100 space-y-6">
          {/* Nome da Grade */}
          <div>
            <label className="block text-sm font-bold text-brand-900 mb-2">
              Nome da Grade de Tamanho *
            </label>
            <input
              required
              type="text"
              placeholder="Ex: Infantil (4 ao 10) ou Bebê"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3.5 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/40 text-brand-900 font-medium placeholder:text-stone-400"
            />
            <p className="text-xs text-brand-900/60 mt-1.5">
              Identificação visível no cadastro de produtos para vincular as
              roupinhas.
            </p>
          </div>

          {/* Tamanhos da Grade */}
          <div>
            <label className="block text-sm font-bold text-brand-900 mb-2">
              Tamanhos da Grade *
            </label>

            {/* Sugestões rápidas */}
            <div className="mb-3">
              <span className="text-xs font-semibold text-brand-900/70 block mb-2">
                Sugestões rápidas (clique para adicionar à grade):
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset.sizes)}
                    className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200/80 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={12} /> {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input para adicionar tamanho personalizado */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Digitar tamanho (ex: 04, P, RN...)"
                value={newSizeInput}
                onChange={(e) => setNewSizeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSize()
                  }
                }}
                className="flex-1 p-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/40 text-brand-900 font-medium"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="bg-brand-700 hover:bg-brand-800 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={16} /> Adicionar
              </button>
            </div>

            {/* Chips de tamanhos ativos */}
            <div className="p-3.5 bg-brand-50/60 rounded-xl border border-brand-200/60 min-h-[58px] flex flex-wrap gap-2 items-center">
              {sizes.length === 0 ? (
                <span className="text-xs text-brand-900/50 italic">
                  Nenhum tamanho adicionado ainda. Use as sugestões acima ou
                  digite um tamanho.
                </span>
              ) : (
                sizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 bg-white border border-brand-200 text-brand-900 font-bold px-3 py-1.5 rounded-lg text-sm shadow-2xs group"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(s)}
                      className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                      title={`Remover tamanho ${s}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Tabela de Medidas */}
          <div>
            <label className="block text-sm font-bold text-brand-900 mb-2">
              Tabela de Medidas (Texto Formatado)
            </label>
            <textarea
              rows={6}
              placeholder={`Exemplo de preenchimento:\nBlusa / Camiseta:\n• Tam 04: Tórax 32cm | Comprimento 42cm\n• Tam 06: Tórax 34cm | Comprimento 45cm\n• Tam 08: Tórax 36cm | Comprimento 48cm\n\nShorts / Calça:\n• Tam 04: Cintura 24cm | Comprimento 28cm\n• Tam 06: Cintura 26cm | Comprimento 31cm`}
              value={measurementTable}
              onChange={(e) => setMeasurementTable(e.target.value)}
              className="w-full p-3.5 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/40 text-brand-900 font-medium placeholder:text-stone-400 font-mono text-sm leading-relaxed"
            />
            <p className="text-xs text-brand-900/60 mt-1.5">
              Dica: Quebras de linha e tópicos são preservados exatamente como
              você digitar.
            </p>
          </div>

          {/* Instruções e Orientações aos Pais */}
          <div>
            <label className="block text-sm font-bold text-brand-900 mb-2">
              Instruções de Medição e Dicas para os Pais
            </label>
            <textarea
              rows={4}
              placeholder="Ex: Meça a criança com fita métrica sem apertar. Caso esteja na dúvida entre dois tamanhos, recomendamos escolher o maior para maior conforto e aproveitamento."
              value={measurementDescription}
              onChange={(e) => setMeasurementDescription(e.target.value)}
              className="w-full p-3.5 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/40 text-brand-900 font-medium placeholder:text-stone-400 text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Coluna da Pré-visualização ao Vivo (5 cols) */}
        <div className="lg:col-span-5 bg-stone-50/80 p-6 rounded-2xl border-2 border-dashed border-brand-200/80 space-y-4 lg:sticky lg:top-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-200/60">
            <div className="flex items-center gap-2 text-brand-800 font-bold text-sm">
              <Sparkles size={16} className="text-amber-500" />
              <span>Pré-visualização do Modal (Visão do Cliente)</span>
            </div>
            <span className="text-[11px] bg-brand-100 text-brand-800 font-semibold px-2 py-0.5 rounded-full">
              Ao Vivo
            </span>
          </div>

          {/* Modal Mockup */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-brand-200 space-y-4">
            {/* Cabeçalho do modal */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
                <Ruler size={20} />
              </div>
              <div>
                <h4 className="font-fredoka text-lg text-brand-900 font-bold leading-tight">
                  {name || 'Nome da Grade'}
                </h4>
                <p className="text-xs text-brand-900/60">
                  Tabela Oficial de Medidas Mundo de Criança
                </p>
              </div>
            </div>

            {/* Chips de tamanhos na pré-visualização */}
            <div>
              <span className="text-[11px] font-bold text-brand-900/70 uppercase tracking-wider block mb-1.5">
                Tamanhos Disponíveis nesta Grade
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sizes.length > 0 ? (
                  sizes.map((s) => (
                    <span
                      key={s}
                      className="bg-brand-50 border border-brand-200 text-brand-900 font-bold px-2.5 py-1 rounded-md text-xs"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-stone-400 italic">
                    Nenhum tamanho definido
                  </span>
                )}
              </div>
            </div>

            {/* Conteúdo da Tabela formatada */}
            <div className="bg-brand-50/50 p-3.5 rounded-xl border border-brand-100">
              <span className="text-[11px] font-bold text-brand-900/70 uppercase tracking-wider block mb-2">
                Medidas da Peça
              </span>
              {measurementTable ? (
                <pre className="text-xs font-mono text-brand-900/90 whitespace-pre-wrap leading-relaxed">
                  {measurementTable}
                </pre>
              ) : (
                <p className="text-xs text-stone-400 italic">
                  O texto das medidas preenchido à esquerda será renderizado
                  aqui.
                </p>
              )}
            </div>

            {/* Instruções */}
            {measurementDescription && (
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
                <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {measurementDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-200">
        <button
          type="button"
          onClick={() => router.push('/admin/tamanhos')}
          className="px-6 py-3 rounded-xl border border-brand-200 text-brand-800 hover:bg-brand-50 font-medium transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-700 hover:bg-brand-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          {loading
            ? 'Salvando...'
            : initialData
              ? 'Salvar Alterações'
              : 'Criar Grade de Tamanho'}
        </button>
      </div>
    </form>
  )
}
