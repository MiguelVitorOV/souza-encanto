'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminGuard({
  children
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      // Se não tem sessão e não está na tela de login, expulsa pro login
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      // Se já tem sessão e está tentando acessar o login, manda pro painel
      else if (session && pathname === '/admin/login') {
        router.push('/admin')
      }
      // Se está tudo certo, libera a renderização
      else {
        setLoading(false)
      }
    }

    checkUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/admin/login')
      } else if (event === 'SIGNED_IN' && pathname === '/admin/login') {
        router.push('/admin')
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  // Evita flash indesejado bloqueando a UI enquanto valida a sessão
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
