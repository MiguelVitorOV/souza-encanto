# PROJECT DNA - Souza Encanto

## 1. Visão do Projeto

Desenvolver um catálogo digital de alta qualidade visual para a loja "Souza Encanto", focado em moda íntima e pijamas. O sistema funcionará como uma vitrine interativa onde a conversão e fechamento de vendas ocorrem exclusivamente via WhatsApp, preservando o atendimento humano e personalizado.

## 2. Objetivos

- Exibir produtos agrupados por categorias com detalhes de preço, tamanhos e disponibilidade.
- Permitir que clientes montem um "carrinho de compras" e enviem a lista final de interesse via WhatsApp.
- Fornecer um fluxo ágil para produtos "fora de estoque", permitindo contato direto para reserva.
- Prover um painel administrativo simples e seguro para gestão de inventário (sem controle quantitativo, apenas status de disponibilidade).

## 3. Drivers Arquiteturais

1. **Custo Zero:** A infraestrutura deve operar em tiers gratuitos (Free Tiers) indefinidamente.
2. **Experiência do Usuário (UX):** O carrinho não pode ser "esquecido" pela cliente; deve haver estímulos visuais claros para o envio da mensagem ao WhatsApp.
3. **Simplicidade Operacional:** O painel deve ser direto ao ponto (CRUD de produtos, upload de imagens e lista de interessados).

## 4. Restrições Invioláveis

- **Sem gateway de pagamento:** Nenhuma transação financeira ocorrerá no site.
- **Gestão de Estoque Booleana (Por Tamanho):** Não haverá controle de quantidade em estoque (ex: "5 peças"), apenas o status booleano (Em Estoque / Fora de Estoque) definido manualmente para cada variação de tamanho de um produto.
- **Sem Autenticação Pública:** Clientes finais não precisam (e não devem) criar conta para usar o site.

## 5. Decisões por Dimensão

- **Negócio & Atendimento:** O "checkout" é substituído por um gerador de link dinâmico para a API do WhatsApp (wa.me) contendo a lista formatada de produtos.
- **Armazenamento (Carrinho):** O estado do carrinho será mantido no lado do cliente (Local Storage), reduzindo necessidade de banco de dados e processamento no servidor.
- **Interessados em Produtos Esgotados:** Clientes entram em contato direto; a administração (loja) cadastra os clientes na lista de interessados dentro do painel administrativo.

## 6. Arquitetura Lógica

- **Client-Side Rendering (CSR) / Static Site Generation (SSG):** A aplicação consumirá os dados diretamente do banco de dados (BaaS).
- **Backend as a Service (BaaS):** Delegação completa de Banco de Dados, Autenticação (para admin) e Storage de Imagens para um provedor gerenciado (Supabase).

## 7. Arquitetura Física

- **Frontend (Hospedagem):** Vercel (Edge Network).
- **Backend / DB:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage).

## 8. Stack Tecnológica

- **Framework:** Next.js (App Router) ou React (Vite). _Recomendado Next.js para melhor SEO (indexação no Google dos produtos)._
- **Estilização:** Tailwind CSS (Permite design rico e responsivo sem dependências pesadas).
- **Gerenciamento de Estado:** Zustand (Leve, ideal para gerenciar o estado global do carrinho).
- **Banco de Dados/Auth:** Supabase (Gratuito, relacional, resolve autenticação e upload de imagens out-of-the-box).

## 9. Estratégia de Segurança

- **Row Level Security (RLS) no Supabase:**
  - Tabela de Produtos: `SELECT` público; `INSERT/UPDATE/DELETE` apenas para usuários autenticados (Admin).
  - Tabela de Interessados: Acesso exclusivo para Admin.
  - Storage (Imagens): Leitura pública; Upload apenas Admin.

## 10. Estratégia de Dados

- Relacionamentos Simples: `Produtos` (id, nome, preco, categoria, ativo, fora_de_estoque, imagens) -> `Lista_Interessados` (id, produto_id, nome_cliente, whatsapp).

## 11. Identidade Visual e Assets

- As definições completas de interface, cores (Creme, Rosa Seco, Terracota) e tipografia estão centralizadas no documento **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**, que serve como fonte da verdade para o front-end.
- O projeto possui um diretório de identidade visual (`identidade-visual/`), cujos assets foram movidos para `public/images/`.
- O arquivo `logo.png` deve ser utilizado globalmente (header, footer, painel admin) para reforçar o branding da "Souza Encanto".
- As demais imagens (`1.png`, `2.png`, `3.png`, `4.png`) devem ser utilizadas como material de apoio (ex: banners, placeholders, seções "Sobre") visando transmitir a estética de alta qualidade da marca.

## 12. Riscos e Trade-offs Aceitos

- **Trade-off:** Não há sincronização em tempo real do estoque entre duas clientes comprando simultaneamente. _Aceito_, pois o fechamento é no WhatsApp.
- **Risco:** O Supabase Free Tier "pausa" o banco de dados caso fique 1 semana sem nenhum acesso. _Mitigação:_ Configurar um cron job gratuito (ex: cron-job.org) para fazer um ping no banco a cada 3 dias, ou assumir o cold start (demora alguns segundos para religar no primeiro acesso da semana).
