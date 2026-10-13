import { StoreHeader } from '@/components/ui/StoreHeader'
import { StoreFooter } from '@/components/ui/StoreFooter'

export const metadata = {
  title: 'Nossa História | Mundo de Criança',
  description:
    'Conheça a história e o carinho por trás da Mundo de Criança. Roupas infantis e de bebê feitas com amor e conforto.'
}

export default function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FAF2E8] py-20 px-5 border-b-2 border-brand-200/80">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <img
              src="/images/logo.png"
              alt="Mundo de Criança"
              className="h-28 sm:h-36 w-auto object-contain mb-4 drop-shadow-sm"
            />
            <h1 className="font-fredoka text-4xl sm:text-5xl text-brand-900 mb-4 tracking-tight">
              Nossa História
            </h1>
            <p className="text-brand-900/80 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
              O aconchego que abraça, a alegria que transforma. A Mundo de
              Criança nasceu para vestir os pequenos com amor, carinho e muito
              conforto.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-5 py-16 space-y-12">
          <section className="bg-white/95 backdrop-blur-xs p-8 sm:p-10 rounded-3xl border-2 border-brand-200 shadow-sm space-y-5 text-brand-900/85 leading-relaxed text-base sm:text-lg">
            <h2 className="font-fredoka text-2xl text-brand-900 flex items-center gap-2">
              🧸 Nosso Propósito
            </h2>
            <p>
              Acreditamos que a infância deve ser leve, colorida e confortável.
              Cada conjunto e roupinha é escolhido a dedo, priorizando tecidos
              macios que respeitam a pele sensível dos bebês e crianças,
              costuras suaves e modelagens que permitem total liberdade para
              brincar, crescer e sonhar.
            </p>
            <p>
              Na Mundo de Criança, nós não entregamos apenas roupas; nós fazemos
              parte dos momentos mais doces da vida da sua família.
            </p>
          </section>

          <section className="bg-white/95 backdrop-blur-xs p-8 sm:p-10 rounded-3xl border-2 border-brand-200 shadow-sm space-y-5 text-brand-900/85 leading-relaxed text-base sm:text-lg">
            <h2 className="font-fredoka text-2xl text-brand-900 flex items-center gap-2">
              💖 Atendimento com Amor
            </h2>
            <p>
              Sabemos que escolher o tamanho certo para uma criança pode gerar
              dúvidas. É exatamente por isso que mantemos o atendimento humano e
              carinhoso pelo WhatsApp.
            </p>
            <p>
              Ao escolher as peças na nossa vitrine e clicar em finalizar
              pedido, você conversa diretamente com a nossa equipe. Conferimos
              as medidas, indicamos o tamanho ideal e calculamos o melhor frete
              com toda a atenção que você e seu pequeno merecem!
            </p>
          </section>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
