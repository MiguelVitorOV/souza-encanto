# AI EXECUTION GUIDE - Souza Encanto

Este documento serve como diretriz para agentes de Inteligência Artificial que auxiliarão no desenvolvimento do catálogo da "Souza Encanto".

## 1. Regras Arquiteturais Absolutas

- **Zero Custo:** Nenhuma dependência, biblioteca, ou serviço de terceiros pago deve ser introduzido no projeto. Ficar restrito a Supabase (Free Tier) e Vercel.
- **Mobile-First:** Como 90%+ dos clientes acessarão por celular via Instagram, o layout primário gerado em CSS/Tailwind DEVE ser mobile-first. O desktop é secundário (mas não deve quebrar).
- **Carrinho Persistente:** O estado do carrinho deve obrigatoriamente persistir após _reload_ da página, utilizando estratégias nativas do navegador (LocalStorage) aliadas ao gerenciador de estado.
- **Segurança de Dados:** Nenhuma rota da API ou consulta via _client-side_ pode permitir a mutação de dados da tabela de produtos caso a sessão não seja do perfil `Admin` válido do Supabase.

## 2. Padrões de Código, Stack e Design

- Utilize `Next.js` no padrão App Router (`/app`).
- Para chamadas ao banco, utilize a biblioteca oficial `@supabase/supabase-js`.
- Todo design deve ser feito utilizando `Tailwind CSS`. Evite CSS puro a menos que estritamente necessário para animações complexas.
- Favoreça Componentes Funcionais React e React Hooks.
- **Identidade Visual:** Utilize impreterivelmente o `logo.png` e as imagens `1.png` a `4.png` (presentes em `/public/images/`) ao desenvolver seções visuais, como Header, Hero, Banners e Sobre. A paleta de cores deve ser derivada desses assets para manter o branding refinado.

## 3. Processo de Implementação (Para IAs)

1. Antes de gerar um novo componente, valide se um similar já existe ou se pode ser extraído.
2. Certifique-se de tratar adequadamente estados de "Loading", "Empty" e "Error" para chamadas no Supabase.
3. Todo formulário do lado Admin deve ter validação básica (não deixar nome de produto vazio, impedir preços negativos, etc).

## 4. Checklist de "Pronto" (Definition of Done)

- O código compila sem erros (sem falhas de lint no Next.js).
- O layout foi validado mentalmente/teoricamente para telas pequenas (`< 640px`).
- As políticas de RLS do Supabase impedem que visitantes façam alterações acidentais.
- Os links para o WhatsApp geram a string correta com `encodeURIComponent()`.
