'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { uploadMedia, MAX_VIDEO_SIZE_BYTES } from '@/utils/storage'
import {
  Product,
  ProductSize,
  Category,
  SizeCategory,
  ProductMedia
} from '@/types'
import { getProductMedia } from '@/utils/media'
import {
  Trash2,
  Video,
  Image as ImageIcon,
  Star,
  Check,
  Tag,
  Ruler,
  Percent,
  Sparkles,
  AlertCircle
} from 'lucide-react'

interface ProductFormProps {
  initialData?: Product
}

const DEFAULT_SIZE_OPTIONS = [
  'RN',
  'P',
  'M',
  'G',
  'GG',
  '01',
  '02',
  '03',
  '04',
  '06',
  '08',
  '10',
  '12',
  '14',
  '16',
  'U'
]

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')

  // Preço, Promoção e Desconto
  const [price, setPrice] = useState(initialData?.price?.toString() || '')
  const [promotionalPrice, setPromotionalPrice] = useState(
    initialData?.promotional_price
      ? initialData.promotional_price.toString()
      : ''
  )
  const [discountPercent, setDiscountPercent] = useState(() => {
    if (initialData?.promotional_price && initialData?.price) {
      const p = initialData.price
      const promo = initialData.promotional_price
      if (p > 0 && promo < p) {
        return Math.round(((p - promo) / p) * 100).toString()
      }
    }
    return ''
  })

  // Multi-Categorias N:N
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.category_ids ||
      (initialData?.category_id ? [initialData.category_id] : [])
  )

  // Grade de Tamanhos
  const [sizeCategories, setSizeCategories] = useState<SizeCategory[]>([])
  const [selectedSizeCategoryId, setSelectedSizeCategoryId] = useState<string>(
    initialData?.size_category_id || ''
  )

  // Tamanhos e Mídias
  const [sizes, setSizes] = useState<ProductSize[]>(initialData?.sizes || [])
  const [media, setMedia] = useState<ProductMedia[]>(() =>
    getProductMedia(initialData)
  )
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)

  // Carrega Categorias, Grades de Tamanhos e Relações N:N existentes
  useEffect(() => {
    async function loadData() {
      // 1. Categorias
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (cats) setCategories(cats)

      // 2. Grades de Tamanhos
      const { data: sizeCats } = await supabase
        .from('size_categories')
        .select('*')
        .order('name')
      if (sizeCats) setSizeCategories(sizeCats)

      // 3. Vínculos de Multi-Categorias se for edição
      if (initialData?.id) {
        const { data: pcData } = await supabase
          .from('product_categories')
          .select('category_id')
          .eq('product_id', initialData.id)

        if (pcData && pcData.length > 0) {
          const ids = pcData.map(
            (row: { category_id: string }) => row.category_id
          )
          setSelectedCategoryIds(ids)
        } else if (initialData.category_id) {
          setSelectedCategoryIds([initialData.category_id])
        }
      }
    }
    loadData()
  }, [initialData?.id, initialData?.category_id])

  // Lista dinâmica de opções de tamanhos baseada na grade selecionada
  const activeSizeOptions = useMemo(() => {
    if (selectedSizeCategoryId) {
      const matched = sizeCategories.find(
        (g) => g.id === selectedSizeCategoryId
      )
      if (matched && matched.sizes.length > 0) {
        return matched.sizes
      }
    }
    return DEFAULT_SIZE_OPTIONS
  }, [selectedSizeCategoryId, sizeCategories])

  // --- Lógica de Preço e Desconto Bidirecional em Tempo Real ---
  const handlePriceChange = (newVal: string) => {
    setPrice(newVal)
    const p = parseFloat(newVal.replace(',', '.'))
    const disc = parseFloat(discountPercent)

    if (!isNaN(p) && p > 0 && !isNaN(disc) && disc > 0 && disc < 100) {
      const calculatedPromo = (p * (1 - disc / 100)).toFixed(2)
      setPromotionalPrice(calculatedPromo)
    } else {
      const promo = parseFloat(promotionalPrice.replace(',', '.'))
      if (!isNaN(p) && p > 0 && !isNaN(promo) && promo > 0 && promo < p) {
        const calculatedDisc = Math.round(((p - promo) / p) * 100).toString()
        setDiscountPercent(calculatedDisc)
      }
    }
  }

  const handlePromotionalPriceChange = (newVal: string) => {
    setPromotionalPrice(newVal)
    if (!newVal || newVal.trim() === '') {
      setDiscountPercent('')
      return
    }

    const p = parseFloat(price.replace(',', '.'))
    const promo = parseFloat(newVal.replace(',', '.'))

    if (!isNaN(p) && p > 0 && !isNaN(promo)) {
      if (promo > 0 && promo < p) {
        const calculatedDisc = Math.round(((p - promo) / p) * 100).toString()
        setDiscountPercent(calculatedDisc)
      } else {
        setDiscountPercent('')
      }
    }
  }

  const handleDiscountPercentChange = (newVal: string) => {
    setDiscountPercent(newVal)
    if (!newVal || newVal.trim() === '') {
      setPromotionalPrice('')
      return
    }

    const p = parseFloat(price.replace(',', '.'))
    const disc = parseFloat(newVal)

    if (!isNaN(p) && p > 0 && !isNaN(disc)) {
      if (disc > 0 && disc < 100) {
        const calculatedPromo = (p * (1 - disc / 100)).toFixed(2)
        setPromotionalPrice(calculatedPromo)
      } else if (disc >= 100) {
        setPromotionalPrice('0.00')
      }
    }
  }

  // Multi-Categorias Toggle
  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Grade de Tamanhos Change
  const handleSizeCategoryChange = (gradeId: string) => {
    setSelectedSizeCategoryId(gradeId)
    if (gradeId) {
      const grade = sizeCategories.find((g) => g.id === gradeId)
      if (grade && grade.sizes.length > 0) {
        // Se a peça não tinha tamanhos, inclui os da grade automaticamente
        if (sizes.length === 0) {
          setSizes(grade.sizes.map((s) => ({ size: s, inStock: true })))
        }
      }
    }
  }

  const selectAllGradeSizes = () => {
    setSizes(activeSizeOptions.map((s) => ({ size: s, inStock: true })))
  }

  const clearAllSizes = () => {
    setSizes([])
  }

  const toggleSizeInclusion = (size: string) => {
    if (sizes.find((s) => s.size === size)) {
      setSizes(sizes.filter((s) => s.size !== size))
    } else {
      setSizes([...sizes, { size, inStock: true }])
    }
  }

  const toggleSizeStock = (size: string) => {
    setSizes(
      sizes.map((s) => (s.size === size ? { ...s, inStock: !s.inStock } : s))
    )
  }

  // Upload de Foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setLoading(true)

    const file = e.target.files[0]
    const url = await uploadMedia(file)
    if (url) {
      const nextOrder =
        media.length > 0 ? Math.max(...media.map((m) => m.order)) + 1 : 1
      setMedia((prev) => [...prev, { url, type: 'image', order: nextOrder }])
    } else {
      alert('Erro ao fazer upload da foto.')
    }
    e.target.value = ''
    setLoading(false)
  }

  // Upload de Vídeo com limite rígido de 40MB
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      alert(
        `O vídeo selecionado possui ${(file.size / (1024 * 1024)).toFixed(1)}MB. O limite máximo permitido para garantir velocidade e economia de dados é de 40MB. Por favor, envie um vídeo editado/mais curto.`
      )
      e.target.value = ''
      return
    }

    setLoading(true)
    const url = await uploadMedia(file)
    if (url) {
      const nextOrder =
        media.length > 0 ? Math.max(...media.map((m) => m.order)) + 1 : 1
      setMedia((prev) => [...prev, { url, type: 'video', order: nextOrder }])
    } else {
      alert('Erro ao fazer upload do vídeo.')
    }
    e.target.value = ''
    setLoading(false)
  }

  const handleOrderChange = (idx: number, newOrderStr: string) => {
    const parsed = parseInt(newOrderStr, 10)
    const newOrder = isNaN(parsed) ? 1 : Math.max(1, parsed)
    setMedia((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, order: newOrder } : item))
    )
  }

  const handleRemoveMedia = (idxToRemove: number) => {
    const item = media[idxToRemove]
    const label = item?.type === 'video' ? 'este vídeo' : 'esta foto'
    if (window.confirm(`Tem certeza que deseja excluir ${label} do produto?`)) {
      setMedia((prev) => prev.filter((_, i) => i !== idxToRemove))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const normalPrice = parseFloat(price.replace(',', '.'))
    const rawPromo = promotionalPrice
      ? parseFloat(promotionalPrice.replace(',', '.'))
      : null
    const validPromo =
      rawPromo !== null &&
      !isNaN(rawPromo) &&
      rawPromo > 0 &&
      rawPromo < normalPrice
        ? rawPromo
        : null

    if (rawPromo !== null && rawPromo >= normalPrice) {
      alert(
        'Atenção: O preço promocional deve ser menor do que o preço original!'
      )
      setLoading(false)
      return
    }

    // Ordena as mídias pelo campo de ordem definido pelo usuário
    const sortedMedia = [...media].sort((a, b) => a.order - b.order)
    const photos = sortedMedia
      .filter((m) => m.type === 'image')
      .map((m) => m.url)

    // Alerta se não houver foto para capa
    if (photos.length === 0 && sortedMedia.length > 0) {
      const confirmNoPhoto = window.confirm(
        'Atenção: Não há nenhuma foto cadastrada para este produto (apenas vídeos). A vitrine necessita de uma foto como capa estática. Deseja salvar mesmo assim?'
      )
      if (!confirmNoPhoto) {
        setLoading(false)
        return
      }
    }

    // Prepara payload com dual-write (category_id legado + suporte N:N)
    const productPayload = {
      name,
      description: description || null,
      price: normalPrice,
      promotional_price: validPromo,
      size_category_id: selectedSizeCategoryId || null,
      category_id: selectedCategoryIds[0] || null, // Dual-write retrocompatível
      sizes,
      images: photos,
      media: sortedMedia,
      is_active: isActive,
      is_out_of_stock: false
    }

    let targetProductId = initialData?.id

    if (initialData) {
      // 1. Atualizar produto
      let { error } = await supabase
        .from('products')
        .update(productPayload)
        .eq('id', initialData.id)

      // Fallback defensivo caso colunas novas ainda não existam no Supabase
      if (
        error &&
        (error.message.includes('promotional_price') ||
          error.message.includes('size_category_id'))
      ) {
        const fallback = { ...productPayload }
        delete (fallback as any).promotional_price
        delete (fallback as any).size_category_id
        const fallbackRes = await supabase
          .from('products')
          .update(fallback)
          .eq('id', initialData.id)
        error = fallbackRes.error
      }

      if (error) {
        alert('Erro ao atualizar produto: ' + error.message)
        setLoading(false)
        return
      }
    } else {
      // 1. Inserir produto
      let { data, error } = await supabase
        .from('products')
        .insert([productPayload])
        .select('id')
        .single()

      // Fallback defensivo
      if (
        error &&
        (error.message.includes('promotional_price') ||
          error.message.includes('size_category_id'))
      ) {
        const fallback = { ...productPayload }
        delete (fallback as any).promotional_price
        delete (fallback as any).size_category_id
        const fallbackRes = await supabase
          .from('products')
          .insert([fallback])
          .select('id')
          .single()
        data = fallbackRes.data
        error = fallbackRes.error
      }

      if (error || !data) {
        alert(
          'Erro ao cadastrar produto: ' +
            (error?.message || 'Falha ao obter ID')
        )
        setLoading(false)
        return
      }
      targetProductId = data.id
    }

    // 2. Sincronizar Multi-Categorias N:N na tabela product_categories
    if (targetProductId) {
      // Deleta categorias associadas anteriores
      await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', targetProductId)

      // Insere novas categorias selecionadas
      if (selectedCategoryIds.length > 0) {
        const links = selectedCategoryIds.map((cid) => ({
          product_id: targetProductId!,
          category_id: cid
        }))
        const { error: linkError } = await supabase
          .from('product_categories')
          .insert(links)

        if (linkError) {
          console.warn(
            'Aviso: Falha ao sincronizar product_categories:',
            linkError.message
          )
        }
      }
    }

    router.push('/admin')
    setLoading(false)
  }

  const isPromoActive =
    promotionalPrice &&
    parseFloat(promotionalPrice.replace(',', '.')) > 0 &&
    parseFloat(promotionalPrice.replace(',', '.')) <
      parseFloat(price.replace(',', '.'))

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-brand-100"
    >
      {/* Status Ativo / Inativo */}
      <div className="flex items-center gap-3 pb-4 border-b border-brand-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 text-brand-700 rounded focus:ring-brand-500 cursor-pointer"
          />
          <span className="font-bold text-brand-900 text-sm sm:text-base">
            Produto Ativo (Visível na loja)
          </span>
        </label>
      </div>

      {/* Nome e Descrição */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-bold text-brand-900 mb-2">
            Nome da Peça *
          </label>
          <input
            required
            type="text"
            placeholder="Ex: Conjunto Moletom Ursinho Avelã"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3.5 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/40 text-brand-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-brand-900 mb-2">
            Descrição e Detalhes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descreva o tecido, toque, detalhes da estampa e cuidados especiais com a roupinha..."
            className="w-full p-3.5 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/40 text-brand-900 font-medium"
          />
        </div>
      </div>

      {/* SEÇÃO 1: PREÇO, DESCONTO E PROMOÇÃO BIDIRECIONAL */}
      <div className="p-5 sm:p-6 bg-brand-50/60 rounded-2xl border border-brand-200/80 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-brand-700" />
            <h3 className="font-fredoka text-base sm:text-lg text-brand-900 font-bold">
              Preço e Promoções
            </h3>
          </div>
          {isPromoActive && (
            <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 animate-pulse">
              <Sparkles size={13} /> {discountPercent}% OFF Ativo
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Preço Original */}
          <div>
            <label className="block text-xs font-bold text-brand-900/80 mb-1.5">
              Preço Original (R$) *
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full p-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-white text-brand-900 font-bold text-base"
            />
          </div>

          {/* Preço Promocional */}
          <div>
            <label className="block text-xs font-bold text-brand-900/80 mb-1.5">
              Preço Promocional (R$){' '}
              <span className="text-stone-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={promotionalPrice}
              onChange={(e) => handlePromotionalPriceChange(e.target.value)}
              className="w-full p-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-white text-brand-900 font-bold text-base"
            />
          </div>

          {/* Porcentagem de Desconto */}
          <div>
            <label className="block text-xs font-bold text-brand-900/80 mb-1.5">
              Desconto (%){' '}
              <span className="text-stone-400 font-normal">(Sincronizado)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="99"
                placeholder="0"
                value={discountPercent}
                onChange={(e) => handleDiscountPercentChange(e.target.value)}
                className="w-full p-3 pr-10 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-white text-brand-900 font-bold text-base"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm pointer-events-none">
                %
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-brand-900/60 leading-relaxed">
          * A sincronização é automática: ao preencher o valor com desconto, a
          porcentagem é calculada em tempo real (e vice-versa). Peças com preço
          promocional ganham destaque visual e badge especial na vitrine.
        </p>
      </div>

      {/* SEÇÃO 2: MULTI-CATEGORIAS (N:N) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-brand-900">
            Categorias da Peça (Multi-Seleção)
          </label>
          <span className="text-xs bg-brand-100 text-brand-800 font-bold px-2.5 py-0.5 rounded-full">
            {selectedCategoryIds.length} selecionada(s)
          </span>
        </div>
        <p className="text-xs text-brand-900/60 mb-3">
          Uma roupinha pode pertencer a mais de uma categoria (ex: "Feminino" e
          "Até 4 anos"). Clique nas tags para marcar ou desmarcar:
        </p>

        {categories.length === 0 ? (
          <div className="p-4 bg-brand-50/50 rounded-xl border border-brand-200 text-xs text-brand-900/60">
            Nenhuma categoria encontrada. Cadastre categorias no menu superior.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 bg-brand-50/40 rounded-xl border border-brand-200/70">
            {categories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id)
              const isAMudar = cat.slug === 'a-mudar'

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? isAMudar
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-brand-700 text-white border-brand-800 shadow-xs scale-102'
                      : 'bg-white text-brand-900 border-brand-200 hover:border-brand-400 hover:bg-brand-50'
                  }`}
                >
                  {isSelected && <Check size={13} className="shrink-0" />}
                  {cat.name}
                  {isAMudar && (
                    <span className="text-[10px] bg-amber-200 text-amber-950 px-1 rounded ml-1 font-normal">
                      Pendente
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* SEÇÃO 3: GRADE DE TAMANHOS E TABELA DE MEDIDAS */}
      <div className="p-5 sm:p-6 bg-brand-50/40 rounded-2xl border border-brand-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <Ruler size={18} className="text-brand-700" />
          <h3 className="font-fredoka text-base sm:text-lg text-brand-900 font-bold">
            Grade de Tamanhos & Medidas
          </h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-900/80 mb-1.5">
            Selecione a Grade de Medidas da Roupinha
          </label>
          <select
            value={selectedSizeCategoryId}
            onChange={(e) => handleSizeCategoryChange(e.target.value)}
            className="w-full p-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-400 focus:outline-none bg-white text-brand-900 font-medium text-sm"
          >
            <option value="">
              Nenhuma / Tamanhos livres (sem tabela oficial de medidas)
            </option>
            {sizeCategories.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} — ({g.sizes.join(', ')})
              </option>
            ))}
          </select>
          <p className="text-xs text-brand-900/60 mt-1">
            Ao vincular uma grade, a página do produto exibirá o botão "📏
            Tabela de Medidas" para os clientes consultarem as medidas e
            orientações.
          </p>
        </div>

        {/* Seleção dos Tamanhos Disponíveis nesta Peça */}
        <div>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <span className="text-xs font-bold text-brand-900/80">
              Tamanhos Produzidos nesta Peça:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllGradeSizes}
                className="text-[11px] text-brand-700 hover:text-brand-900 font-bold hover:underline cursor-pointer"
              >
                Marcar todos
              </button>
              <span className="text-stone-300">|</span>
              <button
                type="button"
                onClick={clearAllSizes}
                className="text-[11px] text-stone-500 hover:text-red-600 font-bold hover:underline cursor-pointer"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {activeSizeOptions.map((size) => {
              const hasSize = !!sizes.find((s) => s.size === size)
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSizeInclusion(size)}
                  className={`w-12 h-12 rounded-xl font-bold transition-all border-2 text-sm cursor-pointer ${
                    hasSize
                      ? 'bg-brand-700 text-white border-brand-800 shadow-xs scale-105'
                      : 'bg-white text-brand-900 border-brand-200 hover:bg-brand-50'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Gerenciamento de Estoque por Tamanho */}
        {sizes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-brand-200/60">
            <label className="block text-xs font-bold text-brand-900/80 mb-2.5">
              Controle de Estoque dos Tamanhos Selecionados (Clique para
              alternar):
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {sizes.map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => toggleSizeStock(s.size)}
                  className="flex items-center justify-between gap-3 bg-white px-3.5 py-2 rounded-xl shadow-2xs border border-brand-200 hover:border-brand-400 transition-all cursor-pointer text-left"
                >
                  <span className="font-bold text-brand-900 text-sm">
                    {s.size}
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-md font-bold transition-colors ${
                      s.inStock
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {s.inStock ? 'Em Estoque' : 'Esgotado'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEÇÃO 4: GALERIA DE MÍDIAS (FOTOS E VÍDEOS) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-brand-900">
            Galeria de Mídias (Fotos e Vídeos)
          </label>
          <span className="text-xs bg-brand-100 text-brand-800 font-bold px-2.5 py-0.5 rounded-full">
            {media.length} {media.length === 1 ? 'mídia' : 'mídias'}
          </span>
        </div>
        <p className="text-xs text-brand-900/60 mb-4">
          A vitrine principal e o carrinho sempre utilizarão a primeira foto
          como capa estática. Ajuste os números de <strong>Ordem</strong> para
          organizar como fotos e vídeos aparecem na página da peça.
        </p>

        <div className="flex gap-4 mb-4 flex-wrap items-start">
          {media.map((item, idx) => {
            const isLowestPhotoOrder =
              item.type === 'image' &&
              !media.some((m) => m.type === 'image' && m.order < item.order)

            return (
              <div
                key={idx}
                className="w-32 sm:w-36 flex flex-col bg-white rounded-2xl border-2 border-brand-200/90 shadow-xs overflow-hidden group hover:border-brand-400 transition-colors"
              >
                <div className="h-36 relative bg-brand-50 overflow-hidden">
                  {item.type === 'video' ? (
                    <>
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                        playsInline
                      />
                      <div className="absolute top-2 left-2 bg-brand-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Video size={11} /> Vídeo
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={item.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {isLowestPhotoOrder && (
                        <div className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Star size={11} fill="white" /> Capa
                        </div>
                      )}
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(idx)}
                    className="absolute top-2 right-2 bg-red-500/90 text-white rounded-md w-7 h-7 flex items-center justify-center opacity-100 transition-opacity shadow-md hover:bg-red-600 cursor-pointer"
                    title={
                      item.type === 'video' ? 'Excluir vídeo' : 'Excluir foto'
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-2 bg-brand-50/70 border-t border-brand-100 flex items-center justify-between gap-1 text-xs text-brand-800">
                  <span className="font-semibold text-[11px]">Ordem:</span>
                  <input
                    type="number"
                    min="1"
                    value={item.order}
                    onChange={(e) => handleOrderChange(idx, e.target.value)}
                    className="w-14 text-center font-bold bg-white border border-brand-300 rounded-md py-1 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            )
          })}

          {/* Botão de Upload de Foto */}
          <label className="w-32 sm:w-36 h-48 flex flex-col items-center justify-center bg-brand-50 border-2 border-dashed border-brand-300 rounded-2xl cursor-pointer hover:bg-brand-100 transition-all text-brand-700 group p-3 text-center shadow-2xs">
            <ImageIcon
              size={26}
              className="group-hover:scale-110 transition-transform mb-1 text-brand-700"
            />
            <span className="text-xs font-bold leading-tight">
              + Adicionar Foto
            </span>
            <span className="text-[10px] text-brand-400 mt-1">
              JPG, PNG, WebP
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={loading}
            />
          </label>

          {/* Botão de Upload de Vídeo */}
          <label className="w-32 sm:w-36 h-48 flex flex-col items-center justify-center bg-sky-50/70 border-2 border-dashed border-sky-300 rounded-2xl cursor-pointer hover:bg-sky-100/70 transition-all text-sky-700 group p-3 text-center shadow-2xs">
            <Video
              size={26}
              className="group-hover:scale-110 transition-transform mb-1 text-sky-600"
            />
            <span className="text-xs font-bold leading-tight">
              + Adicionar Vídeo
            </span>
            <span className="text-[10px] text-sky-500 mt-1">
              MP4, WebM (Até 40MB)
            </span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={loading}
            />
          </label>
        </div>
      </div>

      {/* Botões de Ação do Formulário */}
      <div className="pt-6 border-t border-brand-100 flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 py-3 text-brand-800 font-medium hover:bg-brand-50 rounded-xl transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-brand-700 text-white font-bold rounded-xl hover:bg-brand-800 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? 'Salvando...'
            : initialData
              ? 'Salvar Alterações'
              : 'Cadastrar Produto'}
        </button>
      </div>
    </form>
  )
}
