import { supabase } from '@/lib/supabase'

export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    // Cria um nome único usando timestamp e nome limpo do arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `public/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return null
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from('product-images').getPublicUrl(filePath)

    return publicUrl
  } catch (err) {
    console.error('Erro inesperado no upload:', err)
    return null
  }
}

export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extrai o caminho do arquivo a partir da URL pública
    // A URL tem o formato: .../storage/v1/object/public/product-images/public/nome-do-arquivo.jpg
    const pathSegments = url.split('/product-images/')
    if (pathSegments.length < 2) return false

    const filePath = pathSegments[1]

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath])

    if (error) {
      console.error('Erro ao deletar imagem:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Erro inesperado na deleção:', err)
    return false
  }
}
