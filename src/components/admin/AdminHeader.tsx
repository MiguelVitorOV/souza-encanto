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
    <header className="bg-white border-b border-brand-100 px-4 md:px-6 py-4 flex flex-wrap justify-between items-center shadow-sm gap-4">
      <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-start">
        <h1 className="text-xl font-medium text-brand-900 shrink-0">
          Painel Admin
        </h1>
        <button
          onClick={handleLogout}
          className="flex md:hidden items-center gap-2 text-brand-700 hover:text-brand-900 transition-colors bg-brand-50 px-3 py-1.5 rounded-lg text-sm"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
      <div className="flex items-center justify-between w-full md:w-auto">
        <nav className="flex gap-4 md:gap-6 text-sm md:text-base w-full md:w-auto overflow-x-auto">
          <Link
            href="/admin"
            className={`whitespace-nowrap pb-1 ${isActive('/admin') ? 'text-brand-700 font-medium border-b-2 border-brand-700' : 'text-brand-500 hover:text-brand-900'}`}
          >
            Produtos
          </Link>
          <Link
            href="/admin/categories"
            className={`whitespace-nowrap pb-1 ${isActive('/admin/categories') ? 'text-brand-700 font-medium border-b-2 border-brand-700' : 'text-brand-500 hover:text-brand-900'}`}
          >
            Categorias
          </Link>
          <Link
            href="/admin/interessados"
            className={`whitespace-nowrap pb-1 ${isActive('/admin/interessados') ? 'text-brand-700 font-medium border-b-2 border-brand-700' : 'text-brand-500 hover:text-brand-900'}`}
          >
            Interessados
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 text-brand-700 hover:text-brand-900 transition-colors bg-brand-50 px-4 py-2 rounded-lg ml-6"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </header>
  )
}
