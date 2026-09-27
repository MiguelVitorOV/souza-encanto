import Link from 'next/link'

export function StoreHeader() {
  return (
    <header className="bg-white border-b border-brand-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/logo-sem-bg.png"
            alt="Souza Encanto"
            className="h-12 w-auto object-contain"
          />
          <span className="font-kudryashev text-brand-900 text-[1.35rem] leading-none hidden sm:block pt-1">
            Souza Encanto
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-brand-800 font-medium text-sm">
          <Link href="/" className="hover:text-brand-700 transition-colors">
            Vitrine
          </Link>
          <Link
            href="/sobre"
            className="hover:text-brand-700 transition-colors"
          >
            Nossa História
          </Link>
          <Link
            href="#contato"
            className="hover:text-brand-700 transition-colors"
          >
            Contato
          </Link>
        </nav>

        <div className="md:hidden flex gap-4 text-brand-800">
          <Link
            href="/"
            className="text-sm font-medium hover:text-brand-700 transition-colors"
          >
            Vitrine
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium hover:text-brand-700 transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="#contato"
            className="text-sm font-medium hover:text-brand-700 transition-colors"
          >
            Contato
          </Link>
        </div>
      </div>
    </header>
  )
}
