import Link from 'next/link'

export function StoreHeader() {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b-2 border-brand-200/60 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/logo.png"
            alt="Mundo de Criança"
            className="h-14 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-2xs"
          />
          <span className="font-fredoka text-brand-900 text-2xl tracking-normal hidden sm:block">
            Mundo de Criança
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-brand-900 font-bold text-sm">
          <Link
            href="/"
            className="hover:text-brand-700 transition-colors py-1 border-b-2 border-transparent hover:border-brand-500"
          >
            Vitrine
          </Link>
          <Link
            href="/sobre"
            className="hover:text-brand-700 transition-colors py-1 border-b-2 border-transparent hover:border-brand-500"
          >
            Nossa História
          </Link>
          <Link
            href="#contato"
            className="hover:text-brand-700 transition-colors py-1 border-b-2 border-transparent hover:border-brand-500"
          >
            Contato
          </Link>
        </nav>

        <div className="md:hidden flex gap-4 text-brand-900 font-bold text-sm">
          <Link href="/" className="hover:text-brand-700 transition-colors">
            Vitrine
          </Link>
          <Link
            href="/sobre"
            className="hover:text-brand-700 transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="#contato"
            className="hover:text-brand-700 transition-colors"
          >
            Contato
          </Link>
        </div>
      </div>
    </header>
  )
}
