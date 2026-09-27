'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { uploadImage } from '@/utils/storage'
import { Product, ProductSize, Category } from '@/types'

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
  const [images, setImages] = useState<string[]>(initialData?.images || [])
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setLoading(true)

    const file = e.target.files[0]
    const url = await uploadImage(file)
    if (url) {
      setImages([...images, url])
    } else {
      alert('Erro ao fazer upload da imagem.')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      name,
      description,
      price: parseFloat(price.replace(',', '.')),
      category_id: categoryId || null,
      sizes,
      images,
      is_active: isActive,
      is_out_of_stock: false // Out of stock is now managed by sizes, but we keep the column if needed
    }

    if (initialData) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', initialData.id)
      if (error) alert('Erro ao atualizar: ' + error.message)
      else router.push('/admin')
    } else {
      const { error } = await supabase.from('products').insert([productData])
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
        <label className="block text-sm font-medium text-brand-800 mb-3">
          Galeria de Imagens
        </label>
        <div className="flex gap-4 mb-4 flex-wrap">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="w-28 h-36 relative bg-brand-50 rounded-xl overflow-hidden group border border-brand-200 shadow-sm"
            >
              <img
                src={img}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                &times;
              </button>
            </div>
          ))}
          <label className="w-28 h-36 flex flex-col items-center justify-center bg-brand-50 border-2 border-dashed border-brand-300 rounded-xl cursor-pointer hover:bg-brand-100 transition-colors text-brand-600 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">
              +
            </span>
            <span className="text-xs mt-2 font-medium">Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
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
