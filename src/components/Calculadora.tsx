'use client';

import { useState, useEffect } from 'react';
import { formatNumber, parseNumber } from '@/utils/formatters';

type Moneda = 'USD' | 'EUR' | 'VES';

interface CalculadoraProps {
  tasaUSD: number;
  tasaEUR: number;
}

const MONEDAS: { value: Moneda; label: string; simbolo: string }[] = [
  { value: 'USD', label: 'Dólar', simbolo: '$' },
  { value: 'EUR', label: 'Euro', simbolo: '€' },
  { value: 'VES', label: 'Bolívar', simbolo: 'Bs' },
];

export default function Calculadora({ tasaUSD, tasaEUR }: CalculadoraProps) {
  const [cantidad, setCantidad] = useState<string>('');
  const [monedaOrigen, setMonedaOrigen] = useState<Moneda>('USD');
  const [monedaDestino, setMonedaDestino] = useState<Moneda>('VES');
  const [resultado, setResultado] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const obtenerTasa = (moneda: Moneda): number => {
    switch (moneda) {
      case 'USD': return tasaUSD;
      case 'EUR': return tasaEUR;
      case 'VES': return 1;
      default: return 1;
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    const valor = parseNumber(cantidad);
    const tasaOrigen = obtenerTasa(monedaOrigen);
    const tasaDestino = obtenerTasa(monedaDestino);

    if (monedaOrigen === 'VES') {
      setResultado(valor / tasaDestino);
    } else if (monedaDestino === 'VES') {
      setResultado(valor * tasaOrigen);
    } else {
      const valorEnBS = valor * tasaOrigen;
      setResultado(valorEnBS / tasaDestino);
    }
  }, [cantidad, monedaOrigen, monedaDestino, tasaUSD, tasaEUR, mounted]);

  const invertirMonedas = () => {
    const temp = monedaOrigen;
    setMonedaOrigen(monedaDestino);
    setMonedaDestino(temp);
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Calculadora de Divisas
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          Calculadora de Divisas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
              Cantidad
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground)] text-lg focus:outline-none focus:border-[var(--golden)]"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
              De
            </label>
            <select
              value={monedaOrigen}
              onChange={(e) => setMonedaOrigen(e.target.value as Moneda)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--golden)]"
            >
              {MONEDAS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.simbolo} {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center md:justify-start">
            <button
              onClick={invertirMonedas}
              className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-full hover:border-[var(--golden)] transition-colors"
              title="Invertir monedas"
            >
              <svg className="w-5 h-5 text-[var(--golden)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
              A
            </label>
            <select
              value={monedaDestino}
              onChange={(e) => setMonedaDestino(e.target.value as Moneda)}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--golden)]"
            >
              {MONEDAS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.simbolo} {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
              Resultado
            </label>
            <div className="w-full bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg px-4 py-3">
              <span className="text-2xl font-bold golden-text">
                {MONEDAS.find(m => m.value === monedaDestino)?.simbolo} {formatNumber(resultado)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
