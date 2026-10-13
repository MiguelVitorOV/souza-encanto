# AI EXECUTION GUIDE - Mundo de Criança

Este documento serve como diretriz obrigatória para agentes de Inteligência Artificial que desenvolverão novas funcionalidades ou manutenções na loja **Mundo de Criança**.

---

## 1. Regras Arquiteturais Absolutas

- **Zero Custo:** Nenhuma dependência, serviço ou API paga pode ser adicionada. Manter 100% no Free Tier de Next.js (Vercel) e Supabase.
- **Mobile-First Inegociável:** Mais de 90% dos usuários acessam por smartphones. Todos os modais, filtros e botões devem ter no mínimo 44px de área de toque e nunca quebrar em telas estreitas (360px a 420px).
- **Integridade de Produtos Existentes:** NUNCA deletar produtos já existentes ao realizar migrações de categorias ou tamanhos. O lojista já fez uploads de fotos e informações.
- **Segurança de Dados (RLS):** Toda mutação nas tabelas `categories`, `size_categories`, `products`, `product_categories`, `clients` e `client_interests` DEVE ser restrita a usuários autenticados no Supabase (`authenticated`). Leitura pública apenas para catálogo ativo.
- **Carrinho Persistente:** O estado do carrinho deve persistir com `localStorage` e refletir sempre o preço promocional quando ativo.

---

## 2. Padrões de Código e Stack

- **Framework:** Next.js (App Router, `/app`).
- **Estilização:** Tailwind CSS v4 com tokens da marca `Mundo de Criança` (definidos em `globals.css` e `DESIGN_SYSTEM.md`).
- **Componentes:** Priorizar Server Components para páginas de catálogo inicial e Client Components (`'use client'`) apenas onde há interatividade (filtros dinâmicos, modais, carrinho, formulários).
- **Ícones:** Usar exclusivamente `lucide-react`.

---

## 3. Regras de Domínio Específicas

### 3.1 Categorias de Produtos (N:N)

- Um produto pode estar associado a múltiplas categorias via tabela de junção `product_categories`.
- Na vitrine, a filtragem deve permitir seleção cumulativa de tags.

### 3.2 Grades de Tamanhos e Medidas

- Uma `size_category` contém: nome da grade, lista de tamanhos, texto de medidas e texto de instruções.
- O produto referencia opcionalmente `size_category_id`.
- Se o produto não tiver grade vinculada, o botão de "Tabela de Medidas" deve ser omitido na página do produto.
- A exclusão de uma grade de tamanho nunca deve apagar produtos (`ON DELETE SET NULL`).

### 3.3 Descontos

- Um produto possui `price` e opcionalmente `promotional_price`.
- O desconto só é válido se `promotional_price > 0` e `promotional_price < price`.
- No formulário do produto, o admin pode preencher tanto o preço promocional quanto a porcentagem, mantendo sincronização bidirecional.
- O checkout do WhatsApp e o subtotal do carrinho devem calcular exclusivamente sobre o preço promocional.

### 3.4 Mídias Mistas (Vídeos e Fotos) e Ordenação Numérica

- **Estrutura de Dados:** Cada produto armazena mídias em `media JSONB` como array de objetos `{ url: string, type: 'image' | 'video', order: number }`.
- **Retrocompatibilidade:** Se `media` for nulo ou vazio, o sistema deve automaticamente mapear o array existente `images text[]` atribuindo `type: 'image'` e ordens sequenciais `1, 2, ...`. Ao salvar o formulário do produto, além do JSON `media`, o array `images` deve ser preenchido com as URLs das fotos para garantir funcionamento com versões anteriores.
- **Vitrine Inteligente (Capa Fixa):** O card da vitrine (`ProductCard`) e as miniaturas do carrinho NUNCA devem tentar tocar vídeo como capa. Eles devem sempre buscar a foto de menor número de ordem como capa estática. Se o produto tiver vídeos cadastrados, exibir apenas uma tag/badge sutil indicando a presença de vídeo. O formulário admin deve garantir/recomendar ao menos 1 foto para servir de capa.
- **Validação de Upload:** O lojista pode subir vídeos de até 40MB. Se um arquivo de vídeo ultrapassar 40MB, emitir um alerta impeditivo no formulário admin para evitar exceder o free tier do Supabase e prejudicar a experiência em redes 4G.
- **Player de Vídeo nos Detalhes:** Na página de detalhes (`ClientProductDetails`), quando a mídia ativa for um vídeo, renderizar elemento `<video controls playsInline muted ...>` com design responsivo.

---

## 4. Checklist de Conclusão (Definition of Done)

- [ ] Todas as tipagens TypeScript em `src/types/` e `src/types/database.types.ts` estão sincronizadas com o banco.
- [ ] O comando de build (`npm run build`) executa sem erros ou avisos de lint impeditivos.
- [ ] A formatação respeita o Prettier configurado no projeto.
- [ ] A capa da vitrine e carrinho sempre renderiza foto estática válida, mesmo com vídeo em 1º lugar na galeria.
- [ ] O upload de vídeos valida e bloqueia arquivos acima de 40MB.
- [ ] O fluxo no WhatsApp gera texto legível e codificado com `encodeURIComponent`.
- [ ] A experiência visual transmite calor, afeto e a identidade oficial da "Mundo de Criança".
