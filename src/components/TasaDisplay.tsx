'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatNumber } from '@/utils/formatters';

interface TasasBCV {
  usd: number;
  eur: number;
  usdParalelo: number;
  diferenciaPorcentual: number;
  fecha: string;
  ultimaActualizacion: string;
}

interface TasaCardProps {
  titulo: string;
  simbolo: string;
  valor: number;
  tipo: string;
  badge?: {
    texto: string;
    tipo: 'success' | 'warning' | 'info';
  };
}

function TasaCard({ titulo, simbolo, valor, tipo, badge }: TasaCardProps) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 card-glow relative overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--foreground-secondary)] text-xs font-mono tracking-wider uppercase">{titulo}</span>
        <span className="text-2xl">{simbolo}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-[var(--foreground)]">
          Bs {formatNumber(valor)}
        </span>
        {badge && (
          <span className={`text-xs px-2 py-0.5 rounded-md font-mono font-bold ${
            badge.tipo === 'success' ? 'bg-[var(--success)]/10 text-[var(--success)]' :
            badge.tipo === 'warning' ? 'bg-[var(--error)]/10 text-[var(--error)]' :
            'bg-[var(--blue)]/10 text-[var(--blue)]'
          }`}>
            {badge.texto}
          </span>
        )}
      </div>
      <div className="text-xs text-[var(--foreground-secondary)] mt-2 font-mono">
        1 {tipo} = Bs {formatNumber(valor)}
      </div>
    </div>
  );
}

interface TasaDisplayProps {
  tasasIniciales?: TasasBCV;
}

export default function TasaDisplay({ tasasIniciales }: TasaDisplayProps) {
  const [tasas, setTasas] = useState<TasasBCV | null>(tasasIniciales || null);
  const [cargando, setCargando] = useState(!tasasIniciales);
  const [error, setError] = useState<string | null>(null);

  const fetchTasas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch('/api/bcv');
      const data = await respuesta.json();
      if (data.success && data.data) {
        setTasas(data.data);
      } else {
        setError(data.error || 'Error al obtener tasas');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setCargando(false);
    }
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!tasasIniciales) {
      fetchTasas();
    }
  }, [fetchTasas, tasasIniciales]);

  const diffText = tasas ? `${tasas.diferenciaPorcentual > 0 ? '+' : ''}${tasas.diferenciaPorcentual.toFixed(2)}%` : '';
  const diffTipo = tasas && tasas.diferenciaPorcentual > 0 ? 'warning' : 'success';

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight font-mono">
          <span className="text-[var(--blue)]">&gt;_</span> MONITOREO DE TASAS
        </h2>
        <button
          onClick={() => fetchTasas()}
          disabled={cargando}
          className="text-xs font-mono bg-[var(--background-secondary)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--blue)] hover:text-[var(--foreground)] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {cargando ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] px-4 py-3 rounded-lg mb-4 text-sm font-mono">
          Error: {error}
        </div>
      )}

      {cargando && !tasas ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TasaCard 
            titulo="Dólar Oficial BCV" 
            simbolo="💵" 
            valor={tasas?.usd || 0} 
            tipo="USD" 
          />
          <TasaCard 
            titulo="Dólar Paralelo" 
            simbolo="📊" 
            valor={tasas?.usdParalelo || 0} 
            tipo="USD" 
            badge={tasas ? { texto: diffText, tipo: diffTipo } : undefined}
          />
          <TasaCard 
            titulo="Euro Oficial BCV" 
            simbolo="💶" 
            valor={tasas?.eur || 0} 
            tipo="EUR" 
          />
        </div>
      )}

      {mounted && tasas?.fecha && (
        <div className="flex flex-col sm:flex-row justify-between items-center text-[var(--foreground-secondary)] text-xs mt-4 font-mono gap-1">
          <span>Actualización oficial: {tasas.fecha}</span>
          <span>Sincronizado: {new Date(tasas.ultimaActualizacion).toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
}