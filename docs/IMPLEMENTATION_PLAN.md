# IMPLEMENTATION PLAN - Souza Encanto

A abordagem visa focar primeiramente nas lógicas mais complexas (Carrinho) e garantir que a base esteja sólida, mantendo entregas incrementais.

## FASE 1: Fundação e Core (Semana 1) - CONCLUÍDA

**Foco:** Preparar o terreno e deixar o banco de dados e repositório prontos.

- [x] Inicialização do projeto frontend (Next.js + Tailwind).
- [x] Criação do projeto no Supabase.
- [x] Modelagem das tabelas (`products`, `categories`, `interested_leads`).
- [x] Configuração do Supabase Storage para os uploads de imagens.
- [x] Definição do Row Level Security (RLS) no Supabase.

## FASE 2: Carrinho e UX Principal (Semana 1-2) - CONCLUÍDA

**Foco:** Desenvolver o "Coração" do sistema antes mesmo de ter o painel admin (usando dados mockados se necessário).

- [x] Implementação da loja global de estado do Carrinho (usando Zustand ou Context API + LocalStorage).
- [x] Desenvolvimento do componente visual do "Carrinho Lateral/Modal".
- [x] Desenvolvimento do Botão Flutuante persistente (indicador de itens no carrinho).
- [x] Desenvolvimento do gerador dinâmico de texto para API do WhatsApp (`https://wa.me/...`).

## FASE 3: Painel Administrativo (Semana 2) - CONCLUÍDA

**Foco:** Dar autonomia para a administração preencher o catálogo real.

- [x] Implementação da Tela de Login e proteção de rotas admin.
- [x] CRUD completo de Produtos (Listagem, Criação, Edição, Upload de Imagens Múltiplas).
- [x] Botão de toggle rápido: "Ativo/Inativo" e "Em Estoque/Fora de Estoque".
- [x] Funcionalidade de "Lista de Interessados" (Foi transformada na FASE 7).

## FASE 4: Vitrine Pública Dinâmica (Semana 3)

**Foco:** Conectar o frontend público ao banco de dados real.

- [x] Tela Home com listagem dos produtos cadastrados (ativos).
- [x] Navegação por categorias.
- [x] Tela de Detalhes do Produto (com regras de negócio: se fora de estoque, esconde o botão "Adicionar ao Carrinho" e exibe "Tenho Interesse via WhatsApp").
- [x] Integração do estado do carrinho com os produtos reais.

## FASE 5: Gestão Avançada de Catálogo e Estoque (Semana 3-4) - CONCLUÍDA

**Foco:** Refinar o banco de dados e as interfaces para suportar estoque por tamanho e categorização real.

- [x] Refatoração do schema do banco (Supabase) para migrar o campo `sizes` de um array de strings para JSONB ou tabela auxiliar (controlando inStock de cada tamanho).
- [x] CRUD de Categorias no Painel Administrativo.
- [x] Atualização do Formulário de Produto para vincular categorias e definir o status de estoque individual de cada tamanho.
- [x] Atualização da Vitrine Pública para desabilitar visualmente botões de tamanhos esgotados.
- [x] Lógica de clique em botão esgotado acionar WhatsApp "Avisar Quando Chegar".

## FASE 6: Páginas Institucionais e Polimento (Semana 4) - CONCLUÍDA

- [x] Construção da página Sobre.
- [x] Rodapé e Menus de Navegação.
- [x] Validações finais de layout e responsividade em dispositivos móveis (foco mobile-first).
- [ ] Deploy em produção (Vercel).

## FASE 7: CRM Básico - Lista de Interessados (Sprint 7)

**Foco:** Cadastrar clientes e gerenciar peças e tamanhos aguardados por eles, com integração bidirecional (via cliente e via produto).

- [x] Modelagem de Dados: Criar tabelas `clients` (nome, apelido) e `client_interests` (client_id, product_id, tamanho, status: 'pending'/'notified').
- [x] Interface de Interessados: Nova aba no painel Admin `/admin/interessados`.
- [x] Gestão por Cliente (Visão Principal): Listagem de clientes, modal para cadastrar novo cliente, e interface para visualizar/adicionar/remover interesses (produtos + tamanhos) de cada cliente.
- [x] Gestão por Produto (Visão Secundária): Na tela de Edição de Produto (`/admin/products/[id]`), adicionar seção "Clientes Interessados" para visualizar e vincular clientes (existentes ou novos) àquela peça.
- [x] Controle de Status: Permitir alterar o status de um interesse de 'Aguardando' (pending) para 'Notificado' (notified).
