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

| Token Tailwind     | Cor Hexadecimal | Papel / Aplicação                                                                        |
| :----------------- | :-------------- | :--------------------------------------------------------------------------------------- |
| **`brand-50`**     | `#FFFDF9`       | Fundo principal suave (creme / marfim acolhedor). Transmite conforto sem cansar a vista. |
| **`brand-100`**    | `#FFF3E8`       | Fundo secundário suave / bordas e divisores discretos.                                   |
| **`brand-200`**    | `#FEE2D5`       | Pílulas inativas, cartões em destaque suave.                                             |
| **`brand-pink`**   | `#FF6584`       | Rosa afetuoso / botões principais de ação e destaque feminino.                           |
| **`brand-blue`**   | `#38BDF8`       | Azul céu / botões secundários, laço do mascote e destaques infantis.                     |
| **`brand-yellow`** | `#FBBF24`       | Amarelo sol / estrelinhas, tags de novidade e detalhes vibrantes.                        |
| **`brand-purple`** | `#A855F7`       | Lilás doce / destaques lúdicos.                                                          |
| **`brand-text`**   | `#4A2E18`       | Marrom chocolate quente / texto principal com excelente contraste e toque carinhoso.     |
| **`brand-muted`**  | `#7D6556`       | Marrom suave / textos secundários, legendas e descrições.                                |
| **`brand-badge`**  | `#EF4444`       | Vermelho suave / tag de desconto visível ("-20% OFF").                                   |

---

## 3. Tipografia

- **Fonte Principal:** Inter / Sans amigável.
- **Títulos:** Pesos médios a semibold (`font-medium` / `font-bold`), visual limpo, com bom espaçamento de leitura.
- **Tags e Destaques:** Letras maiúsculas ou pílulas arredondadas com ícones lúdicos (ex: 📏 para medidas, 🏷️ para ofertas).

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
