# DESIGN SYSTEM - Souza Encanto

Este documento centraliza as definições visuais, paleta de cores e princípios de interface (UI) da marca Souza Encanto. Ele deve ser utilizado como guia absoluto para a criação e manutenção de todos os componentes visuais do e-commerce.

## 1. Princípios Visuais

- **Elegância e Delicadeza:** O design reflete o nicho de moda íntima e pijamas. As linhas devem ser finas, os espaços generosos (white-space) e as transições sutis.
- **Simplicidade (Mobile-First):** As interfaces devem ser construídas primariamente para telas de celular, com botões grandes, fáceis de tocar (touch targets) e informações diretas ao ponto.
- **Micro-interações:** Pequenos feedbacks de ação (como hover, escala ao clicar, e modals que deslizam) são fundamentais para passar a sensação de aplicativo nativo.

## 2. Paleta de Cores (Brand Colors)

A paleta foi extraída diretamente das referências fotográficas e de marca enviadas.

| Uso                    | Nome da Cor no Tailwind   | Hexadecimal | Descrição                                                                                                                             |
| :--------------------- | :------------------------ | :---------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Fundo Principal**    | `brand-50`                | `#FCF5F3`   | Creme claro rosado. Usado para fundos de página, backgrounds de cartões e placeholders de imagens.                                    |
| **Bordas e Divisores** | `brand-100`               | `#F3E8E6`   | Tom ligeiramente mais escuro que o fundo para separar seções suavemente.                                                              |
| **Texto Secundário**   | `brand-500` / `brand-600` | `#DDA99B`   | Rosa seco/nude. Usado para descrições, labels e ícones inativos.                                                                      |
| **Primária (Ação)**    | `brand-700`               | `#C48E7F`   | Terracota/Rosê intenso. Cor principal de identidade. Usada no Botão "Adicionar ao Carrinho" e destaques.                              |
| **Hover de Ação**      | `brand-800`               | `#B57E70`   | Tom mais escuro para feedback de clique/hover nos botões.                                                                             |
| **Texto Principal**    | `brand-900`               | `#4A3B38`   | Marrom escuro (quase grafite). Usado para títulos (h1, h2, h3) e textos importantes para garantir excelente legibilidade e contraste. |
| **Contraste / Neutro** | `stone-900`               | `#1C1917`   | Usado para etiquetas extremas (ex: Botão "Esgotado", "Avisar no WhatsApp") passando urgência e sobriedade.                            |

## 3. Tipografia

- Fonte base: **Inter** (padrão otimizado da web).
- Títulos (`h1`, `h2`): Utilizam peso `font-light` ou `font-medium` para passar sofisticação, sempre com letter-spacing um pouco mais apertado (`tracking-tight`).
- Tags e Labels: Utilizam texto em letras maiúsculas (`uppercase`) com espaçamento largo (`tracking-widest`) em tamanhos pequenos (`text-xs`).

## 4. Componentes Chave

### Botões

- **Primário:** Fundo `bg-brand-700`, texto branco, bordas arredondadas (`rounded-xl`), com leve elevação (`shadow-lg`). Ao clicar (active), reduz levemente a escala.
- **Esgotado:** Fundo preto/stone (`bg-stone-900`), texto branco. Transmite a mensagem de indisponibilidade sem parecer um botão de erro (vermelho).

### Galeria e Cards

- Proporção de imagem para roupas é `aspect-[3/4]` ou `aspect-[4/5]` para garantir que peças longas (como calças e camisolas) não fiquem cortadas.
- Sem cantos duros: imagens usam bordas suaves (`rounded-2xl` ou `rounded-xl`).

### Comportamentos de UI

- **Offcanvas / Sidebar:** O carrinho abre lateralmente em desktops e de baixo para cima em celulares, sem redirecionar o usuário para outra página.
- **Filtros (Categorias):** Devem ser exibidos como pílulas ("pills") roláveis horizontalmente, para economia de espaço no celular.
