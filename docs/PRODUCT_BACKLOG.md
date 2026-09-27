# PRODUCT BACKLOG - Souza Encanto

## EPIC 1: Configuração e Infraestrutura Inicial (CONCLUÍDO)

- **US 1.1:** [x] Como desenvolvedor, quero inicializar o projeto (Next.js + Tailwind) e configurar o repositório.
- **US 1.2:** [x] Como desenvolvedor, quero configurar o projeto no Supabase (Database, Auth, Storage) para ter a base de dados pronta.
- **US 1.3:** [x] Como desenvolvedor, quero definir as políticas de segurança (RLS) no Supabase para garantir que apenas admins editem o banco.

## EPIC 2: Painel Administrativo (Admin) (CONCLUÍDO)

- **US 2.1:** [x] Como administradora, quero fazer login seguro no painel para gerenciar o catálogo.
- **US 2.2:** [x] Como administradora, quero cadastrar, editar e inativar produtos (Nome, Preço, Categoria, Imagens, Tamanhos).
- **US 2.3:** [x] Como administradora, quero marcar um produto como "Fora de Estoque" para que ele não possa ser adicionado ao carrinho, mas continue visível.
- **US 2.4:** Como administradora, quero poder adicionar clientes a uma "Lista de Interessados" dentro da página de um produto esgotado, para lembrete futuro.

## EPIC 3: Catálogo Digital (Vitrine Pública)

- **US 3.1:** [x] Como cliente, quero ver a página inicial com os produtos em destaque ou últimos lançamentos.
- **US 3.2:** [x] Como cliente, quero poder filtrar ou navegar pelos produtos através de categorias (Ex: Pijamas, Moda Íntima).
- **US 3.3:** [x] Como cliente, quero abrir os detalhes de um produto e ver suas fotos, preço e tamanhos disponíveis.
- **US 3.4:** [x] Como cliente, ao ver um produto "Fora de Estoque", quero ter um botão que me leve direto ao WhatsApp para perguntar quando chega.

## EPIC 4: Carrinho de Compras e Checkout (WhatsApp) (CONCLUÍDO)

- **US 4.1:** [x] Como cliente, quero poder adicionar produtos (com tamanho específico) ao carrinho de compras para continuar navegando.
- **US 4.2:** [x] Como cliente, quero ver um indicador flutuante persistente mostrando que há itens no meu carrinho.
- **US 4.3:** [x] Como cliente, quero acessar meu carrinho para alterar quantidades ou remover itens.
- **US 4.4:** [x] Como cliente, quero clicar em "Finalizar Pedido" e ser redirecionada para o WhatsApp da loja, com uma mensagem gerada automaticamente listando todos os itens, tamanhos e valor total.

## EPIC 5: Páginas Institucionais (CONCLUÍDO)

- **US 5.1:** [x] Como cliente, quero acessar a página "Sobre a Loja" para entender como funciona o modelo de vendas.
- **US 5.2:** [x] Como cliente, quero acessar a página de "Contato" ou rodapé para encontrar os links das redes sociais e WhatsApp direto.

## EPIC 6: Gestão Avançada de Catálogo e Estoque (CONCLUÍDO)

- **US 6.1:** [x] Como administradora, quero gerenciar (CRUD) as categorias de produtos no painel administrativo.
- **US 6.2:** [x] Como administradora, quero poder atrelar um produto a uma categoria durante a criação ou edição.
- **US 6.3:** [x] Como administradora, quero controlar o estoque de um produto de forma granular (por tamanho) marcando se a variação "M" está em estoque ou esgotada independentemente da "P".
- **US 6.4:** [x] Como cliente, quero ver os tamanhos esgotados na vitrine de forma visualmente desabilitada/cortada (mas ainda presentes na tela).
- **US 6.5:** [x] Como cliente, ao tentar interagir com um tamanho esgotado, quero ser direcionada para pedir um "Aviso de Reposição" via WhatsApp.

## EPIC 5: CRM Básico - Lista de Interessados

**Objetivo:** Controlar e reter clientes que manifestaram desejo em peças esgotadas, otimizando o fluxo de contato pós-reposição.

- **Story 5.1:** Como Administrador, desejo ter um cadastro básico de Clientes (nome e apelido) para vincular os interesses a uma pessoa específica.
- **Story 5.2:** Como Administrador, desejo visualizar uma aba "Interessados" que agrupe todos os clientes e me permita ver/cadastrar os produtos e tamanhos que eles aguardam.
- **Story 5.3:** Como Administrador, na tela de edição de um produto específico, desejo visualizar a lista de todos os clientes interessados naquela peça, para facilitar o contato quando a mesma chegar ao estoque.
- **Story 5.4:** Como Administrador, desejo poder atualizar o status de interesse de um cliente de "Aguardando" para "Notificado", garantindo que eu não perca o controle do histórico.
