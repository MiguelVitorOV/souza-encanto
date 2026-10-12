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

---

## 4. Checklist de Conclusão (Definition of Done)

- [ ] Todas as tipagens TypeScript em `src/types/` e `src/types/database.types.ts` estão sincronizadas com o banco.
- [ ] O comando de build (`npm run build`) executa sem erros ou avisos de lint impeditivos.
- [ ] A formatação respeita o Prettier configurado no projeto.
- [ ] O fluxo no WhatsApp gera texto legível e codificado com `encodeURIComponent`.
- [ ] A experiência visual transmite calor, afeto e a identidade oficial da "Mundo de Criança".
