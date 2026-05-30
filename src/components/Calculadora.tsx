'use client';

import { useState } from 'react';
import { formatNumber, parseNumber } from '@/utils/formatters';

type Moneda = 'USD_OFICIAL' | 'USD_PARALELO' | 'EUR' | 'VES';

interface CalculadoraProps {
  tasaUSD: number;
  tasaEUR: number;
  tasaUSDParalelo: number;
}

const MONEDAS: { value: Moneda; label: string; simbolo: string }[] = [
  { value: 'USD_OFICIAL', label: 'Dólar Oficial (BCV)', simbolo: '$ (BCV)' },
  { value: 'USD_PARALELO', label: 'Dólar Paralelo', simbolo: '$ (Paralelo)' },
  { value: 'EUR', label: 'Euro Oficial', simbolo: '€' },
  { value: 'VES', label: 'Bolívares', simbolo: 'Bs' },
];

export default function Calculadora({ tasaUSD, tasaEUR, tasaUSDParalelo }: CalculadoraProps) {
  const [cantidad, setCantidad] = useState<string>('');
  const [monedaOrigen, setMonedaOrigen] = useState<Moneda>('USD_OFICIAL');
  const [monedaDestino, setMonedaDestino] = useState<Moneda>('VES');

  const obtenerTasa = (moneda: Moneda): number => {
    switch (moneda) {
      case 'USD_OFICIAL': return tasaUSD;
      case 'USD_PARALELO': return tasaUSDParalelo;
      case 'EUR': return tasaEUR;
      case 'VES': return 1;
      default: return 1;
    }
  };

  const resultado = (() => {
    const valor = parseNumber(cantidad);
    if (!valor) return 0;
    
    const tasaOrigen = obtenerTasa(monedaOrigen);
    const tasaDestino = obtenerTasa(monedaDestino);

    if (monedaOrigen === 'VES') {
      return valor / tasaDestino;
    } else if (monedaDestino === 'VES') {
      return valor * tasaOrigen;
    } else {
      return (valor * tasaOrigen) / tasaDestino;
    }
  })();

  const invertirMonedas = () => {
    const temp = monedaOrigen;
    setMonedaOrigen(monedaDestino);
    setMonedaDestino(temp);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 card-glow">
        <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight mb-5 font-mono">
          <span className="text-[var(--purple)]">&gt;_</span> CALCULADORA MULTI-DIVISA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-xs font-mono text-[var(--foreground-secondary)] mb-2 uppercase tracking-wider">
              Cantidad
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground)] text-lg font-mono focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-mono text-[var(--foreground-secondary)] mb-2 uppercase tracking-wider">
              De
            </label>
            <select
              value={monedaOrigen}
              onChange={(e) => setMonedaOrigen(e.target.value as Moneda)}
              className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground)] font-mono focus:outline-none focus:border-[var(--blue)] transition-all cursor-pointer"
            >
              {MONEDAS.map((m) => (
                <option key={m.value} value={m.value} className="bg-[var(--background-secondary)] text-[var(--foreground)]">
                  {m.label} ({m.simbolo})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center md:col-span-1 h-[50px]">
            <button
              onClick={invertirMonedas}
              className="p-3 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--blue)] hover:text-[var(--blue)] transition-all duration-200 cursor-pointer text-[var(--foreground-secondary)] shadow-sm"
              title="Invertir monedas"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-6 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-mono text-[var(--foreground-secondary)] mb-2 uppercase tracking-wider">
              A
            </label>
            <select
              value={monedaDestino}
              onChange={(e) => setMonedaDestino(e.target.value as Moneda)}
              className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground)] font-mono focus:outline-none focus:border-[var(--blue)] transition-all cursor-pointer"
            >
              {MONEDAS.map((m) => (
                <option key={m.value} value={m.value} className="bg-[var(--background-secondary)] text-[var(--foreground)]">
                  {m.label} ({m.simbolo})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-mono text-[var(--foreground-secondary)] mb-2 uppercase tracking-wider">
              Resultado
            </label>
            <div className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-4 py-[11px] min-h-[50px] flex items-center justify-between font-mono">
              <span className="text-sm text-[var(--foreground-secondary)]">
                {MONEDAS.find(m => m.value === monedaDestino)?.simbolo}
              </span>
              <span className="text-xl font-bold text-[var(--success)]">
                {formatNumber(resultado)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
