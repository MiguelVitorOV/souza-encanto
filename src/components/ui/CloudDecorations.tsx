import React from 'react'

interface CloudProps {
  className?: string
  color?: 'pink' | 'blue' | 'yellow' | 'purple' | 'white'
  smiling?: boolean
  width?: number
  height?: number
}

const colorMap = {
  pink: 'text-[#FFA5C8]',
  blue: 'text-[#7CC2F5]',
  yellow: 'text-[#FBDD59]',
  purple: 'text-[#D6B5FF]',
  white: 'text-white'
}

export function Cloud({
  className = '',
  color = 'pink',
  smiling = false
}: CloudProps) {
  return (
    <div className={`relative inline-block ${className} ${colorMap[color]}`}>
      <svg
        viewBox="0 0 140 85"
        fill="currentColor"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Forma fofa de nuvem orgânica */}
        <path d="M 28 72 C 12 72 0 60 0 46 C 0 33 9 22 22 21 C 26 9 38 0 52 0 C 68 0 81 11 85 25 C 92 20 101 18 110 21 C 127 25 140 39 140 56 C 140 72 127 72 115 72 Z" />

        {/* Rostinho feliz opcional (como no poster oficial) */}
        {smiling && (
          <g
            className="text-brand-900"
            stroke="#4A2E18"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          >
            {/* Olho esquerdo piscando ou sorrindo */}
            <path d="M 52 42 Q 58 36 64 42" />
            {/* Olho direito piscando ou sorrindo */}
            <path d="M 76 42 Q 82 36 88 42" />
            {/* Boquinha feliz */}
            <path d="M 66 48 Q 70 54 74 48" />
            {/* Bochechas rosadas */}
            <circle
              cx="48"
              cy="46"
              r="3.5"
              fill="#FF7E9F"
              stroke="none"
              opacity="0.6"
            />
            <circle
              cx="92"
              cy="46"
              r="3.5"
              fill="#FF7E9F"
              stroke="none"
              opacity="0.6"
            />
          </g>
        )}
      </svg>
    </div>
  )
}

export function Star({ className = '' }: { className?: string }) {
  return (
    <div className={`text-[#FBDD59] ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full drop-shadow-2xs"
      >
        <path d="M12 1.5l2.8 6.5 7.1.6-5.3 4.8 1.6 7-6.2-3.6-6.2 3.6 1.6-7-5.3-4.8 7.1-.6z" />
      </svg>
    </div>
  )
}

export function BackgroundClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-75">
      {/* Nuvem Rosa no Topo Esquerdo */}
      <div className="absolute -top-10 -left-12 w-48 sm:w-64 opacity-80 animate-pulse">
        <Cloud color="pink" smiling />
      </div>

      {/* Nuvem Azul no Topo Direito */}
      <div className="absolute -top-6 -right-10 w-44 sm:w-60 opacity-80">
        <Cloud color="blue" smiling />
      </div>

      {/* Estrelinhas decorativas no alto */}
      <div className="absolute top-16 left-36 w-6 h-6 animate-bounce">
        <Star />
      </div>
      <div className="absolute top-24 right-48 w-5 h-5 hidden sm:block">
        <Star />
      </div>

      {/* Nuvem Amarela lateral esquerda */}
      <div className="absolute top-[40%] -left-14 w-40 sm:w-52 opacity-70">
        <Cloud color="yellow" />
      </div>

      {/* Nuvem Lilás lateral direita */}
      <div className="absolute top-[55%] -right-12 w-40 sm:w-56 opacity-70">
        <Cloud color="purple" />
      </div>

      {/* Nuvem Azul na Base Esquerda */}
      <div className="absolute -bottom-8 -left-8 w-48 sm:w-64 opacity-80">
        <Cloud color="blue" />
      </div>

      {/* Nuvem Rosa na Base Direita */}
      <div className="absolute -bottom-10 -right-8 w-52 sm:w-72 opacity-80">
        <Cloud color="pink" smiling />
      </div>
    </div>
  )
}
