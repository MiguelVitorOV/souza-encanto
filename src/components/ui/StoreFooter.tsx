import Link from 'next/link'
import { STORE_CONFIG } from '@/config/constants'

export function StoreFooter() {
  return (
    <footer
      id="contato"
      className="bg-brand-50 border-t border-brand-100 pt-16 pb-8 px-5 mt-auto"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-6 opacity-90">
            <img
              src="/images/logo-sem-bg.png"
              alt="Souza Encanto"
              className="h-10 w-auto object-contain"
            />
            <span className="font-kudryashev text-brand-900 text-[1.35rem] leading-none pt-1">
              Souza Encanto
            </span>
          </div>
          <p className="text-brand-700 font-light text-sm leading-relaxed max-w-xs">
            Moda íntima e pijamas com curadoria impecável. Acreditamos que o
            conforto é o maior luxo que você pode ter no seu dia a dia.
          </p>
        </div>

        <div>
          <h4 className="text-brand-900 font-semibold mb-6 uppercase tracking-widest text-xs">
            Navegação
          </h4>
          <ul className="space-y-4 text-brand-700 font-light text-sm">
            <li>
              <Link href="/" className="hover:text-brand-900 transition-colors">
                Vitrine de Produtos
              </Link>
            </li>
            <li>
              <Link
                href="/sobre"
                className="hover:text-brand-900 transition-colors"
              >
                Nossa História
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-brand-900 font-semibold mb-6 uppercase tracking-widest text-xs">
            Atendimento
          </h4>
          <ul className="space-y-4 text-brand-700 font-light text-sm">
            <li>
              WhatsApp:{' '}
              <a
                href={`https://wa.me/${STORE_CONFIG.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:text-brand-900"
              >
                {STORE_CONFIG.WHATSAPP_DISPLAY}
              </a>{' '}
              e{' '}
              <a
                href={`https://wa.me/${STORE_CONFIG.WHATSAPP_NUMBER_2}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:text-brand-900"
              >
                {STORE_CONFIG.WHATSAPP_DISPLAY_2}
              </a>
            </li>
            <li>
              Instagram:{' '}
              <a
                href={STORE_CONFIG.INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:text-brand-900"
              >
                @{STORE_CONFIG.INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>Horário: {STORE_CONFIG.BUSINESS_HOURS}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-brand-200/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-500 font-light">
        <p>
          &copy; {new Date().getFullYear()} Souza Encanto. Todos os direitos
          reservados.
        </p>
        <p>Feito com carinho para o seu conforto.</p>
      </div>
    </footer>
  )
}
