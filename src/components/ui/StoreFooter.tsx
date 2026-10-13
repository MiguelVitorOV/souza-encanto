import Link from 'next/link'
import { STORE_CONFIG } from '@/config/constants'
import { Phone, Clock } from 'lucide-react'

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.39 1.28-1.92 1.36-.5.08-1.15.11-3.69-.93-3.25-1.33-5.34-4.63-5.5-4.85-.16-.22-1.31-1.74-1.31-3.32 0-1.58.83-2.36 1.12-2.68.29-.32.64-.4.85-.4.22 0 .43 0 .62.01.2.01.47-.08.73.55.27.65.92 2.25 1 2.41.08.16.13.35.03.56-.11.22-.16.35-.32.54-.16.19-.34.42-.49.56-.16.16-.33.33-.14.66.19.33.85 1.4 1.82 2.26 1.25 1.11 2.3 1.46 2.63 1.62.33.16.52.14.71-.08.19-.22.82-.95 1.04-1.28.22-.33.44-.27.74-.16.3.11 1.91.9 2.24 1.06.33.16.55.25.63.38.08.14.08.79-.16 1.47z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function StoreFooter() {
  return (
    <footer
      id="contato"
      className="bg-brand-50/90 backdrop-blur-xs border-t-2 border-brand-200/80 pt-16 pb-8 px-5 mt-auto relative z-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/logo.png"
              alt="Mundo de Criança"
              className="h-12 w-auto object-contain drop-shadow-2xs"
            />
            <span className="font-fredoka text-brand-900 text-2xl tracking-normal">
              Mundo de Criança
            </span>
          </div>
          <p className="text-brand-900/80 font-medium text-sm leading-relaxed max-w-xs">
            Moda infantil e bebê pensada com amor, carinho e o aconchego que os
            pequenos merecem em cada fase.
          </p>
        </div>

        <div>
          <h4 className="font-fredoka text-brand-900 text-lg mb-4">
            Navegação
          </h4>
          <ul className="space-y-3 text-brand-900/80 text-sm font-medium">
            <li>
              <Link href="/" className="hover:text-brand-700 transition-colors">
                Vitrine de Produtos
              </Link>
            </li>
            <li>
              <Link
                href="/sobre"
                className="hover:text-brand-700 transition-colors"
              >
                Nossa História
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-fredoka text-brand-900 text-lg mb-4">
            Atendimento com Carinho
          </h4>
          <ul className="space-y-3.5 text-brand-900/85 text-sm font-medium">
            <li className="flex items-start gap-2.5">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/80 shrink-0 mt-0.5">
                <WhatsAppIcon className="w-4 h-4" />
              </span>
              <div className="leading-snug">
                <span className="text-xs text-brand-900/60 block uppercase font-bold tracking-wider mb-0.5">
                  WhatsApp
                </span>
                <a
                  href={`https://wa.me/${STORE_CONFIG.WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-brand-700 hover:text-brand-800"
                >
                  {STORE_CONFIG.WHATSAPP_DISPLAY}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 border border-pink-200/80 shrink-0 mt-0.5">
                <InstagramIcon className="w-4 h-4" />
              </span>
              <div className="leading-snug">
                <span className="text-xs text-brand-900/60 block uppercase font-bold tracking-wider mb-0.5">
                  Instagram
                </span>
                <a
                  href={STORE_CONFIG.INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-brand-700 hover:text-brand-800"
                >
                  @{STORE_CONFIG.INSTAGRAM_HANDLE}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200/80 shrink-0 mt-0.5">
                <Phone size={16} />
              </span>
              <div className="leading-snug">
                <span className="text-xs text-brand-900/60 block uppercase font-bold tracking-wider mb-0.5">
                  Ligação / Telefone
                </span>
                <a
                  href={`tel:${STORE_CONFIG.WHATSAPP_NUMBER}`}
                  className="font-bold text-brand-700 hover:text-brand-800"
                >
                  {STORE_CONFIG.WHATSAPP_DISPLAY}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/80 shrink-0 mt-0.5">
                <Clock size={16} />
              </span>
              <div className="leading-snug">
                <span className="text-xs text-brand-900/60 block uppercase font-bold tracking-wider mb-0.5">
                  Horário de Atendimento
                </span>
                <span>{STORE_CONFIG.BUSINESS_HOURS}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t-2 border-brand-200/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-900/70 font-semibold">
        <p>
          &copy; {new Date().getFullYear()} Mundo de Criança. Todos os direitos
          reservados.
        </p>
        <p className="flex items-center gap-1.5">
          Feito com carinho para o seu pequeno 🧸✨
        </p>
      </div>
    </footer>
  )
}
