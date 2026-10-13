# DESIGN SYSTEM - Mundo de Criança

Este documento centraliza as definições visuais, paleta de cores e princípios de interface (UI) da marca **Mundo de Criança**. Ele serve como fonte da verdade para o front-end, substituindo integralmente a identidade anterior da Souza Encanto.

---

## 1. Princípios Visuais da Marca

- **Afeto, Doçura e Alegria Infantil:** O design celebra o universo infantil e do bebê. Deve transmitir carinho, acolhimento, cuidado e segurança para mães, pais e familiares.
- **Formas Suaves e Amigáveis:** Bordas bem arredondadas (`rounded-2xl`, `rounded-full`), sombras suaves e acolhedoras, micro-interações gentis.
- **Mobile-First Afetivo:** Navegação fluida para quem está amamentando ou segurando o celular com uma mão só: botões de toque generosos (mínimo 44px), textos claros e contrastados, modais de fácil fechamento.

---

## 2. Paleta de Cores (Brand Tokens)

Inspirada diretamente nas peças oficiais da pasta `identidade-visual/` (ursinho com laço azul, arco-íris, nuvens, estrelas e lettering 3D colorido):

| Token Tailwind     | Cor Hexadecimal | Papel / Aplicação                                                                         |
| :----------------- | :-------------- | :---------------------------------------------------------------------------------------- |
| **`brand-50`**     | `#FAF2E8`       | Fundo bege quentinho oficial (extraído diretamente do poster). Conforto visual acolhedor. |
| **`brand-100`**    | `#F5E6D3`       | Fundo secundário suave / bordas e divisores discretos.                                    |
| **`brand-200`**    | `#EED3B8`       | Pílulas inativas, cartões em destaque suave.                                              |
| **`brand-700`**    | `#D82B66`       | Rosa framboesa vibrante de ação (botões principais e destaques).                          |
| **`brand-pink`**   | `#FFA5C8`       | Rosa algodão-doce das nuvens e detalhes afetivos.                                         |
| **`brand-blue`**   | `#7CC2F5`       | Azul céu das nuvens sorridentes e laço do mascote.                                        |
| **`brand-yellow`** | `#FBDD59`       | Amarelo sol das estrelinhas e nuvens ensolaradas.                                         |
| **`brand-purple`** | `#D6B5FF`       | Lilás doce para detalhes lúdicos.                                                         |
| **`brand-text`**   | `#4A2E18`       | Marrom chocolate quente para títulos e textos principais com contraste acolhedor.         |

---

## 3. Tipografia

- **Títulos e Destaques:** **Fredoka** (Google Fonts) — tipografia arredondada, fofa e expressiva, perfeita para marcas infantis.
- **Textos e Leitura:** **Quicksand** (Google Fonts) — família sem serifa arredondada e limpa para ótima legibilidade.
- **Tags e Destaques:** Pílulas arredondadas com ícones lúdicos (ex: 🧸, 💖, 🌈, 📏).

---

## 4. Componentes Chave

### 4.1 Header e Hero

- Logo oficial "Mundo de Criança" com o mascote ursinho e o arco-íris.
- Banner Hero afetuoso com a mensagem: _"Qualidade e conforto • Produtos com amor • Para todas as fases"_.

### 4.2 Filtros de Categorias

- Pílulas (chips) de seleção múltipla permitindo ativar mais de uma categoria ao mesmo tempo (ex: "Feminino" + "Até 4 anos").
- Tag selecionada recebe fundo colorido acolhedor com sombra suave; tag desmarcada recebe fundo creme com borda sutil.
- Botão "Limpar filtros" visível quando houver seleções ativas.

### 4.3 Tags de Desconto e Preço

- Badge de oferta no canto superior dos cards (ex: `-25% OFF`).
- Preço original com traço riscado (`line-through text-stone-400 text-sm`) ao lado do preço com desconto em destaque (`text-brand-pink text-lg font-bold`).

### 4.4 Tabela de Medidas

- Botão sutil e convidativo: `📏 Tabela de Medidas` abaixo da seleção de tamanhos.
- Modal responsivo com fundo claro, exibindo a tabela formatada (Blusa, Shorts, etc.) e o aviso afetuoso de orientação de compra.
