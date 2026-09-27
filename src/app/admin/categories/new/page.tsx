import { CategoryForm } from '@/components/admin/CategoryForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewCategory() {
  return (
    <div className="min-h-screen bg-brand-50">
      <header className="bg-white border-b border-brand-100 px-6 py-4 shadow-sm">
        <Link
          href="/admin/categories"
          className="flex items-center gap-2 text-brand-600 hover:text-brand-900 w-max"
        >
          <ArrowLeft size={18} /> Voltar para Categorias
        </Link>
      </header>
      <main className="max-w-4xl mx-auto p-6 pt-12">
        <h2 className="text-3xl font-light text-brand-800 mb-8 text-center">
          Nova Categoria
        </h2>
        <CategoryForm />
      </main>
    </div>
  )
}
