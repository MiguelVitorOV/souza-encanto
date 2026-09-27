'use client'
import { ProductForm } from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProduct() {
  return (
    <div className="min-h-screen bg-brand-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin"
            className="p-3 text-brand-600 hover:bg-brand-100 bg-white rounded-full transition-colors shadow-sm border border-brand-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-light text-brand-900">Novo Produto</h1>
            <p className="text-brand-600 mt-1">
              Preencha os detalhes para adicionar ao catálogo.
            </p>
          </div>
        </div>
        <ProductForm />
      </div>
    </div>
  )
}
