export type KidColorTheme = 'pink' | 'blue' | 'yellow'

export interface ColorScheme {
  name: KidColorTheme
  priceClass: string
  borderClass: string
  bgLightClass: string
  bgActiveClass: string
  textActiveClass: string
}

export const KID_COLOR_PALETTES: ColorScheme[] = [
  {
    name: 'pink',
    priceClass: 'text-[#D82B66]',
    borderClass: 'border-[#FFA5C8]',
    bgLightClass:
      'bg-[#FFF0F5] text-[#D82B66] hover:bg-[#FFE4EE] border-[#FFA5C8]',
    bgActiveClass: 'bg-[#FF6584] text-white border-[#FF6584]',
    textActiveClass: 'text-white'
  },
  {
    name: 'blue',
    priceClass: 'text-[#0284C7]',
    borderClass: 'border-[#7CC2F5]',
    bgLightClass:
      'bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE] border-[#7CC2F5]',
    bgActiveClass: 'bg-[#38BDF8] text-white border-[#38BDF8]',
    textActiveClass: 'text-white'
  },
  {
    name: 'yellow',
    priceClass: 'text-[#D97706]',
    borderClass: 'border-[#FBDD59]',
    bgLightClass:
      'bg-[#FFFBEB] text-[#B45309] hover:bg-[#FEF3C7] border-[#FBDD59]',
    bgActiveClass: 'bg-[#FBDD59] text-brand-900 border-[#FBDD59]',
    textActiveClass: 'text-brand-900'
  }
]

export function getRandomColorPalette(): ColorScheme {
  const randomIndex = Math.floor(Math.random() * KID_COLOR_PALETTES.length)
  return KID_COLOR_PALETTES[randomIndex]
}

export function getProductAccentColor(id: string): ColorScheme {
  if (!id) return KID_COLOR_PALETTES[0]
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return KID_COLOR_PALETTES[hash % KID_COLOR_PALETTES.length]
}

export function getSizeColorPalette(index: number): ColorScheme {
  return KID_COLOR_PALETTES[index % KID_COLOR_PALETTES.length]
}
