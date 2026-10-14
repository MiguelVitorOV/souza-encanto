/**
 * Utilitário de ordenação lógica e humana de tamanhos para moda infantil e geral.
 * Trata RN, meses (1M a 24M), numéricos com ou sem zero à esquerda (01, 1, 04, 4, 10, etc.)
 * e letras (PP, P, M, G, GG, U).
 */

export function getSizeOrderRank(
  sizeStr: string,
  categorySizes?: string[] | null
): number {
  if (!sizeStr) return 999
  const clean = sizeStr.trim().toUpperCase()

  // 1. Se o produto estiver associado a uma grade de tamanho customizada criada pelo admin,
  // respeitar rigorosamente a ordem configurada na grade!
  if (
    categorySizes &&
    Array.isArray(categorySizes) &&
    categorySizes.length > 0
  ) {
    const idx = categorySizes.findIndex((s) => {
      const catClean = s.trim().toUpperCase()
      if (catClean === clean) return true
      // Normalização caso um tenha zero à esquerda e o outro não (ex: '04' e '4')
      const numA = catClean.replace(/^0+/, '')
      const numB = clean.replace(/^0+/, '')
      return numA === numB && numA !== ''
    })
    if (idx !== -1) {
      return idx
    }
  }

  // 2. RN (Recém-Nascido)
  if (clean === 'RN') return 1

  // 3. Meses de bebê (ex: 1M, 01M, 2M, 3M, 6M, 9M, 12M, 18M, 24M, 36M)
  const monthMatch = clean.match(/^0*(\d+)\s*M(?:ESES?)?$/i)
  if (monthMatch) {
    return 10 + parseInt(monthMatch[1], 10)
  }

  // 4. Numéricos infantis e juvenis (ex: 01, 1, 02, 2, 04, 4, 06, 6, 08, 8, 10, 12, 14, 16)
  const numMatch = clean.match(/^0*(\d+)$/)
  if (numMatch) {
    return 100 + parseInt(numMatch[1], 10)
  }

  // 5. Letras padrão
  const letterMap: Record<string, number> = {
    PP: 501,
    P: 502,
    M: 503,
    G: 504,
    GG: 505,
    XG: 506,
    XXG: 507,
    U: 900,
    UN: 900,
    ÚNICO: 900,
    UNICO: 900
  }

  if (letterMap[clean]) {
    return letterMap[clean]
  }

  return 999
}

export function sortProductSizes<T extends { size: string }>(
  sizes: T[],
  categorySizes?: string[] | null
): T[] {
  if (!sizes || !Array.isArray(sizes)) return []
  return [...sizes].sort((a, b) => {
    const rankA = getSizeOrderRank(a.size, categorySizes)
    const rankB = getSizeOrderRank(b.size, categorySizes)
    if (rankA !== rankB) {
      return rankA - rankB
    }
    return a.size.localeCompare(b.size, undefined, { numeric: true })
  })
}
