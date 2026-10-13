'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin'
    return pathname?.startsWith(path)
  }

  return (
    <header className="bg-white border-b border-brand-100 px-4 md:px-6 py-3.5 flex flex-wrap justify-between items-center shadow-xs gap-4">
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img
            src="/images/logo.png"
            alt="Mundo de Criança"
            className="h-10 w-auto object-contain"
          />
          <span className="text-lg font-bold text-brand-900 shrink-0">
            Mundo de Criança Admin
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex md:hidden items-center gap-1.5 text-brand-700 hover:text-brand-900 transition-colors bg-brand-50 px-3 py-1.5 rounded-lg text-sm font-medium"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto">
        <nav className="flex gap-4 md:gap-6 text-sm md:text-base w-full md:w-auto overflow-x-auto">
          <Link
            href="/admin"
            className={`whitespace-nowrap pb-1 font-medium transition-colors ${
              isActive('/admin')
                ? 'text-brand-700 border-b-2 border-brand-700'
                : 'text-brand-900/60 hover:text-brand-900'
            }`}
          >
            Produtos
          </Link>
          <Link
            href="/admin/categories"
            className={`whitespace-nowrap pb-1 font-medium transition-colors ${
              isActive('/admin/categories')
                ? 'text-brand-700 border-b-2 border-brand-700'
                : 'text-brand-900/60 hover:text-brand-900'
            }`}
          >
            Categorias
          </Link>
          <Link
            href="/admin/interessados"
            className={`whitespace-nowrap pb-1 font-medium transition-colors ${
              isActive('/admin/interessados')
                ? 'text-brand-700 border-b-2 border-brand-700'
                : 'text-brand-900/60 hover:text-brand-900'
            }`}
          >
            Interessados
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 text-brand-700 hover:text-brand-900 transition-colors bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl ml-6 text-sm font-medium"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </header>
  )
}
