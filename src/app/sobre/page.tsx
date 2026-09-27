import { StoreHeader } from '@/components/ui/StoreHeader'
import { StoreFooter } from '@/components/ui/StoreFooter'

export const metadata = {
  title: 'Sobre Nós | Souza Encanto'
}

export default function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1 bg-white">
        {/* Hero Section */}
        <div className="bg-brand-50 py-24 px-5 border-b border-brand-100">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light text-brand-900 mb-6">
              Nossa História
            </h1>
            <p className="text-brand-700 text-lg md:text-xl font-light leading-relaxed">
              O conforto que abraça, a beleza que transforma. A Souza Encanto
              nasceu do desejo de trazer moda íntima e pijamas com uma curadoria
              feita de mulher para mulher.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-5 py-24 space-y-16">
          <section className="space-y-6 text-brand-800 font-light leading-relaxed text-lg">
            <h2 className="text-2xl font-medium text-brand-900 mb-6">
              Nosso Propósito
            </h2>
            <p>
              Acreditamos que a primeira roupa que você veste no dia e a última
              que usa para dormir ditam como você vai se sentir. Por isso, nossa
              seleção de peças foge do óbvio: procuramos tecidos de alta
              qualidade, rendas macias que não pinicam e modelagens que
              respeitam e valorizam todos os tipos de corpos.
            </p>
            <p>
              Na Souza Encanto, não vendemos apenas pijamas; nós entregamos
              momentos de autocuidado e noites de sono mais aconchegantes.
            </p>
          </section>

          <section className="space-y-6 text-brand-800 font-light leading-relaxed text-lg pt-16 border-t border-brand-100">
            <h2 className="text-2xl font-medium text-brand-900 mb-6">
              Atendimento Humanizado
            </h2>
            <p>
              O digital nos aproxima, mas fazemos questão de manter o calor do
              atendimento físico. É por isso que optamos por não ter um
              "checkout frio e automático".
            </p>
            <p>
              Quando você adiciona peças ao seu carrinho na nossa vitrine e
              finaliza o pedido, você é direcionada diretamente para o nosso
              WhatsApp. Lá, conversamos com você, tiramos dúvidas sobre
              tamanhos, confirmamos as medidas e calculamos o frete com o
              carinho que você merece. Queremos que sua compra seja uma
              experiência única!
            </p>
          </section>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
