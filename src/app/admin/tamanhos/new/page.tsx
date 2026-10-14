'use client'

import { AdminHeader } from '@/components/admin/AdminHeader'
import { SizeCategoryForm } from '@/components/admin/SizeCategoryForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewSizeCategoryPage() {
  return (
    <div className="min-h-screen bg-brand-50">
      <AdminHeader />

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Link
            href="/admin/tamanhos"
            className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-900 transition-colors font-medium text-sm mb-3"
          >
            <ArrowLeft size={16} /> Voltar para Grades de Tamanho
          </Link>
          <h2 className="text-3xl font-fredoka text-brand-900 font-bold">
            Nova Grade de Tamanho
          </h2>
          <p className="text-sm text-brand-900/60 mt-1">
            Defina os tamanhos inclusos na grade e monte a tabela de medidas com
            preview em tempo real.
          </p>
        </div>

        <SizeCategoryForm />
      </main>
    </div>
  )
}
