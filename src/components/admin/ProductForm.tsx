'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { uploadMedia, MAX_VIDEO_SIZE_BYTES } from '@/utils/storage'
import { Product, ProductSize, Category, ProductMedia } from '@/types'
import { getProductMedia } from '@/utils/media'
import { Trash2, Video, Image as ImageIcon, Star } from 'lucide-react'

interface ProductFormProps {
  initialData?: Product
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')

  // Notice that sizes is now an array of ProductSize
  const [sizes, setSizes] = useState<ProductSize[]>(initialData?.sizes || [])
  const [media, setMedia] = useState<ProductMedia[]>(() =>
    getProductMedia(initialData)
  )
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)

  const [categories, setCategories] = useState<Category[]>([])

  const sizeOptions = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'U']

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

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

    const productData = {
      name,
      description,
      price: parseFloat(price.replace(',', '.')),
      category_id: categoryId || null,
      sizes,
      images: photos,
      media: sortedMedia,
      is_active: isActive,
      is_out_of_stock: false // Out of stock is now managed by sizes, but we keep the column if needed
    }

    if (initialData) {
      let { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', initialData.id)

      // Fallback defensivo: se a coluna 'media' ainda não foi criada no Supabase
      if (error && error.message.includes('media')) {
        const fallback = { ...productData }
        delete (fallback as any).media
        const fallbackRes = await supabase
          .from('products')
          .update(fallback)
          .eq('id', initialData.id)
        if (!fallbackRes.error) {
          alert(
            'Produto atualizado! Aviso: Para ativar vídeos permanentemente, execute o script SQL da migration no painel do Supabase.'
          )
          router.push('/admin')
          return
        }
        error = fallbackRes.error
      }

      if (error) alert('Erro ao atualizar: ' + error.message)
      else router.push('/admin')
    } else {
      let { error } = await supabase.from('products').insert([productData])

      // Fallback defensivo para insert
      if (error && error.message.includes('media')) {
        const fallback = { ...productData }
        delete (fallback as any).media
        const fallbackRes = await supabase.from('products').insert([fallback])
        if (!fallbackRes.error) {
          alert(
            'Produto cadastrado! Aviso: Para ativar vídeos permanentemente, execute o script SQL da migration no painel do Supabase.'
          )
          router.push('/admin')
          return
        }
        error = fallbackRes.error
      }

      if (error) alert('Erro ao criar: ' + error.message)
      else router.push('/admin')
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-brand-100"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-brand-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 text-brand-700 rounded focus:ring-brand-500"
          />
          <span className="font-medium text-brand-900">
            Produto Ativo (Visível na loja)
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-800 mb-2">
            Nome do Produto
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-800 mb-2">
            Categoria
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-3 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/50"
          >
            <option value="">Selecione uma categoria...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-800 mb-2">
          Preço (R$)
        </label>
        <input
          required
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-800 mb-2">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-3 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-400 focus:outline-none bg-brand-50/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-800 mb-3">
          Tamanhos Disponíveis na Peça
        </label>
        <p className="text-xs text-brand-500 mb-3">
          Selecione quais tamanhos esta peça possui, independente de ter no
          estoque agora.
        </p>
        <div className="flex gap-3 flex-wrap">
          {sizeOptions.map((size) => {
            const hasSize = !!sizes.find((s) => s.size === size)
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSizeInclusion(size)}
                className={`w-12 h-12 rounded-full font-medium transition-colors border-2 ${hasSize ? 'bg-brand-700 text-white border-brand-700 shadow-md' : 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100'}`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {sizes.length > 0 && (
        <div className="p-5 bg-brand-50/80 rounded-xl border border-brand-100">
          <label className="block text-sm font-medium text-brand-800 mb-3">
            Status de Estoque por Tamanho
          </label>
          <div className="flex gap-3 flex-wrap">
            {[...sizes]
              .sort(
                (a, b) =>
                  sizeOptions.indexOf(a.size) - sizeOptions.indexOf(b.size)
              )
              .map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => toggleSizeStock(s.size)}
                  className="flex items-center justify-between gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-brand-100 min-w-[140px] hover:border-brand-300 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <span className="font-bold text-brand-900">{s.size}</span>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${s.inStock ? 'bg-green-100 text-green-800 group-hover:bg-green-200' : 'bg-stone-200 text-stone-700 group-hover:bg-stone-300'}`}
                  >
                    {s.inStock ? 'Em Estoque' : 'Esgotado'}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-brand-800">
            Galeria de Mídias (Fotos e Vídeos)
          </label>
          <span className="text-xs text-brand-500">
            {media.length} {media.length === 1 ? 'mídia' : 'mídias'}
          </span>
        </div>
        <p className="text-xs text-brand-500 mb-4">
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
          <label className="w-32 sm:w-36 h-48 flex flex-col items-center justify-center bg-brand-50 border-2 border-dashed border-brand-300 rounded-2xl cursor-pointer hover:bg-brand-100 transition-all text-brand-600 group p-3 text-center shadow-2xs">
            <ImageIcon
              size={26}
              className="group-hover:scale-110 transition-transform mb-1 text-brand-600"
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

      <div className="pt-6 border-t border-brand-100 flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 py-3 text-brand-700 font-medium hover:bg-brand-50 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-brand-700 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </div>
    </form>
  )
}
