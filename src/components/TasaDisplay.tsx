'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatNumber } from '@/utils/formatters';

interface TasasBCV {
  usd: number;
  eur: number;
  fecha: string;
  ultimaActualizacion: string;
}

interface TasaCardProps {
  titulo: string;
  simbolo: string;
  valor: number;
  tipo: 'USD' | 'EUR';
}

function TasaCard({ titulo, simbolo, valor, tipo }: TasaCardProps) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 card-glow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--foreground-secondary)] text-sm">{titulo}</span>
        <span className="text-2xl">{simbolo}</span>
      </div>
      <div className="text-3xl font-bold text-[var(--foreground)]">
        Bs {formatNumber(valor)}
      </div>
      <div className="text-xs text-[var(--foreground-secondary)] mt-2">
        1 {tipo} = Bs {formatNumber(valor)}
      </div>
    </div>
  );
}

interface TasaDisplayProps {
  tasasIniciales?: TasasBCV;
}

export default function TasaDisplay({ tasasIniciales: _tasasInciales }: TasaDisplayProps) {
  const [tasas, setTasas] = useState<TasasBCV | null>(null);
  const [cargando, setCargando] = useState(true);
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasas();
  }, [fetchTasas]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Tasas de Cambio
        </h2>
        <button
          onClick={() => fetchTasas()}
          disabled={cargando}
          className="text-sm text-[var(--golden)] hover:text-[var(--golden-light)] disabled:opacity-50"
        >
          {cargando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {cargando && !tasas ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-[var(--golden)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TasaCard titulo="Dólar Estadounidense" simbolo="💵" valor={tasas?.usd || 0} tipo="USD" />
          <TasaCard titulo="Euro" simbolo="💶" valor={tasas?.eur || 0} tipo="EUR" />
        </div>
      )}

      {tasas?.fecha && (
        <p className="text-center text-[var(--foreground-secondary)] text-sm mt-4">
          Fecha de actualización: {tasas.fecha}
        </p>
      )}
    </div>
  );
}