import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Essa configuração libera o IP da sua máquina.
  // Na prática, ISSO JÁ LIBERA PARA TODOS OS CELULAES DA CASA, pois a restrição
  // não é "quais celulares podem entrar", mas sim "em qual IP/URL o servidor aceita rodar".
  // @ts-ignore (evita erro de tipagem caso o NextConfig ainda não tenha essa chave oficializada na versão)
  allowedDevOrigins: ['10.106.72.201', '25.0.49.119']
}

export default nextConfig
