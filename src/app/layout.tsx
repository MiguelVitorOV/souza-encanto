import type { Metadata } from 'next'
import { Fredoka, Quicksand } from 'next/font/google'
import './globals.css'
import { CartWrapper } from '@/components/cart/CartWrapper'
import { BackgroundClouds } from '@/components/ui/CloudDecorations'

const fredoka = Fredoka({
  variable: '--font-fredoka-family',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
})

const quicksand = Quicksand({
  variable: '--font-quicksand-family',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Mundo de Criança | Moda Infantil e Bebê',
  description:
    'Catálogo digital com carinho para o seu pequeno. Roupas infantis e de bebê com qualidade, amor e conforto.',
  icons: {
    icon: '/icon.png'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fredoka.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-50 text-brand-900 relative font-sans">
        <BackgroundClouds />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        <CartWrapper />
      </body>
    </html>
  )
}
