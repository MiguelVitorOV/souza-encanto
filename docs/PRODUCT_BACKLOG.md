# PRODUCT BACKLOG - Mundo de Criança

## EPIC 1: Configuração e Infraestrutura Inicial (CONCLUÍDO)

- **US 1.1:** [x] Como desenvolvedor, quero inicializar o projeto (Next.js + Tailwind) e configurar o repositório.
- **US 1.2:** [x] Como desenvolvedor, quero configurar o projeto no Supabase (Database, Auth, Storage) para ter a base de dados pronta.
- **US 1.3:** [x] Como desenvolvedor, quero definir as políticas de segurança (RLS) no Supabase para garantir que apenas admins editem o banco.

## EPIC 2: Painel Administrativo Base e Produtos (CONCLUÍDO)

- **US 2.1:** [x] Como administradora, quero fazer login seguro no painel para gerenciar o catálogo.
- **US 2.2:** [x] Como administradora, quero cadastrar, editar e inativar produtos com fotos e tamanhos básicos.
- **US 2.3:** [x] Como administradora, quero marcar um produto como "Fora de Estoque" para desativar compra imediata.
- **US 2.4:** [x] Como administradora, quero poder remover fotos de um produto existente com confirmação.

## EPIC 3: Carrinho e Checkout WhatsApp (CONCLUÍDO)

- **US 3.1:** [x] Como cliente, quero adicionar produtos com tamanho ao carrinho e vê-lo persistir entre páginas.
- **US 3.2:** [x] Como cliente, quero ver o botão flutuante com a quantidade de itens no carrinho.
- **US 3.3:** [x] Como cliente, quero clicar em finalizar e abrir o WhatsApp com a mensagem formatada contendo produtos e total.

## EPIC 4: CRM de Clientes e Interessados (CONCLUÍDO)

- **US 4.1:** [x] Como administradora, quero cadastrar clientes e vincular peças/tamanhos que eles estão aguardando.
- **US 4.2:** [x] Como administradora, quero marcar status do interesse como Notificado.

---

## EPIC 5: Refatoração de Marca e Design "Mundo de Criança" (CONCLUÍDO)

**Objetivo:** Transformar completamente a estética da loja de moda íntima para o universo acolhedor, lúdico e afetuoso de moda infantil e bebê.

- **US 5.1:** [x] Como cliente, quero ver a nova paleta de cores infantil (tons pastéis quentes, rosa chiclete, azul céu, amarelo sol, lilás e creme suave) com excelente legibilidade e harmonia.
- **US 5.2:** [x] Como cliente, quero ver o novo logo "Mundo de Criança" (ursinho com arco-íris e lettering 3D colorido das imagens oficiais) no cabeçalho, rodapé e favicon.
- **US 5.3:** [x] Como cliente, quero ver um banner Hero acolhedor na página inicial destacando o carinho da marca, qualidade, conforto e produtos para todas as fases.
- **US 5.4:** [x] Como administradora e cliente, quero que todos os textos, metatags de SEO, títulos de abas e rodapé sejam atualizados para "Mundo de Criança".

## EPIC 6: Suporte a Vídeos de Demonstração e Ordenação Manual de Mídias (CONCLUÍDO)

**Objetivo:** Permitir que o lojista adicione vídeos curtos demonstrando o caimento, textura e detalhes das roupinhas infantis, ordenando manualmente fotos e vídeos por número de exibição.

- **US 6.1:** [x] Como administradora, no cadastro/edição de produtos, quero enviar vídeos curtos (até 40MB) além de fotos para a galeria de mídias.
- **US 6.2:** [x] Como administradora, quero definir a ordem de exibição de cada foto e vídeo digitando um número sequencial simples (ex: 1, 2, 3...), sem necessidade de arrastar elementos.
- **US 6.3:** [x] Como cliente na vitrine (Home) e no carrinho, quero que a capa exibida seja sempre uma foto de alta resolução (a primeira foto da galeria), garantindo carregamento instantâneo no celular.
- **US 6.4:** [x] Como cliente na vitrine, quero uma visualização limpa e focada no card do produto sem tags de vídeo poluindo a foto de capa.
- **US 6.5:** [x] Como cliente na página de detalhes do produto, quero que o vídeo inicie automaticamente (autoplay em loop silencioso) assim que exibido, com controles para pausar e ativar som.

## EPIC 7: Categorização N:N e Filtros Avançados na Vitrine (NOVO)

**Objetivo:** Permitir que uma roupa pertença a múltiplas categorias e fornecer filtros combináveis por tags/chips intuitivos.

- **US 7.1:** Como administradora, no cadastro/edição do produto, quero selecionar múltiplas categorias simultaneamente através de tags/checkboxes simples.
- **US 7.2:** Como administradora, quero poder migrar com segurança as categorias antigas: os produtos existentes recebem a categoria "A mudar", permitindo a exclusão segura das categorias de lingerie legadas.
- **US 7.3:** Como cliente na vitrine, quero selecionar múltiplas categorias através de chips interativos (ex: "Feminino" + "Até 4 anos") vendo os produtos que combinam os filtros.
- **US 7.4:** Como cliente, quero desmarcar tags facilmente ou clicar em "Limpar filtros" para voltar a ver todos os produtos.

## EPIC 8: Grades de Tamanho e Tabela de Medidas com Modal (NOVO)

**Objetivo:** Permitir a criação de categorias de tamanhos personalizáveis pelo admin com tabela de medidas e texto explicativo, consultável pelo cliente.

- **US 8.1:** Como administradora, quero ter um CRUD de Categorias de Tamanho (`/admin/tamanhos`), definindo o nome da grade (ex: "Bebê", "Infantil 4 a 10") e a lista de tamanhos disponíveis.
- **US 8.2:** Como administradora, quero preencher a Tabela de Medidas (texto formatado com seções de blusa, shorts, etc.) e o texto descritivo de instruções/variações, com pré-visualização em tempo real.
- **US 8.3:** Como administradora, no cadastro do produto, quero selecionar a qual Categoria de Tamanho ele pertence, carregando automaticamente os tamanhos daquela grade para marcar presença e estoque.
- **US 8.4:** Como cliente na página do produto, quero visualizar os tamanhos daquela grade e ter um botão "📏 Tabela de Medidas" que abre um modal elegante com as medidas e instruções daquela categoria.
- **US 8.5:** Como cliente, caso o produto não tenha categoria de tamanho vinculada (ex: acessórios/laços), o botão de tabela de medidas deve ser ocultado de forma transparente.

## EPIC 9: Desconto Visível e Preço Promocional (NOVO)

**Objetivo:** Destacar ofertas na vitrine e nos detalhes do produto, com cálculo automático e sincronização flexível.

- **US 9.1:** Como administradora, no formulário do produto, quero informar o preço promocional OU a porcentagem de desconto, vendo ambos os campos se sincronizarem em tempo real.
- **US 9.2:** Como cliente na vitrine, quero ver uma tag chamativa de desconto (ex: "-20% OFF") nos produtos em oferta.
- **US 9.3:** Como cliente, na vitrine e na página de detalhes, quero ver o preço original riscado e o preço promocional em destaque.
- **US 9.4:** Como cliente, ao adicionar um produto em oferta ao carrinho e finalizar via WhatsApp, o valor considerado deve ser o preço com desconto, com menção explícita à promoção na mensagem enviada.
