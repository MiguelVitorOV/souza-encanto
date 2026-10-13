'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-sm border border-brand-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="/images/logo.png"
            alt="Mundo de Criança"
            className="h-20 w-auto object-contain mb-3"
          />
          <h1 className="text-2xl font-bold text-brand-900 tracking-tight mb-1">
            Painel de Gestão
          </h1>
          <p className="text-brand-900/70 text-sm">
            Faça login para gerenciar o catálogo da Mundo de Criança.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50/50 text-brand-900"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-brand-50/50 text-brand-900"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-700 text-white font-semibold py-3.5 rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-50 mt-4 shadow-sm"
          >
            {loading ? 'Autenticando...' : 'Acessar Painel'}
          </button>
        </form>
      </div>
    </div>
  )
}
