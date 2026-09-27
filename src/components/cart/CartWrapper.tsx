'use client'

import { usePathname } from 'next/navigation'
import { CartSidebar } from './CartSidebar'
import { FloatingCartButton } from './FloatingCartButton'

export function CartWrapper() {
  const pathname = usePathname()

  // Se a rota começa com /admin, ocultamos o carrinho
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <CartSidebar />
      <FloatingCartButton />
    </>
  )
}
