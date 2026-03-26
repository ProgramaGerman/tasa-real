'use client';

import { useState, useEffect } from 'react';
import { formatNumber } from '@/utils/formatters';

interface TasasBCV {
  usd: number;
  eur: number;
  fecha: string;
  ultimaActualizacion: string;
}

interface IABadgeProps {
  verificado: boolean;
  cargando: boolean;
}

function IABadge({ verificado, cargando }: IABadgeProps) {
  if (cargando) {
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-[var(--card)] px-2 py-1 rounded-full border border-[var(--border)]">
        <span className="w-2 h-2 bg-[var(--golden)] rounded-full animate-pulse"></span>
        <span className="text-[var(--foreground-secondary)]">Verificando con IA...</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
      verificado 
        ? 'bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]' 
        : 'bg-[var(--golden)]/10 border-[var(--golden)]/30 text-[var(--golden)]'
    }`}>
      <span className={`w-2 h-2 rounded-full ${verificado ? 'bg-[var(--success)]' : 'bg-[var(--golden)]'}`}></span>
      <span>{verificado ? 'Verificado por IA' : 'Verificación pendiente'}</span>
    </span>
  );
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

export default function TasaDisplay({ tasasIniciales }: TasaDisplayProps) {
  const [tasas, setTasas] = useState<TasasBCV | null>(null);
  const [cargando, setCargando] = useState(false);
  const [verificandoIA, setVerificandoIA] = useState(false);
  const [verificadoIA, setVerificadoIA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (tasasIniciales) {
      setTasas(tasasIniciales);
      verificarConIA();
    } else {
      obtenerTasas();
    }
  }, [mounted]);

  const verificarConIA = async () => {
    setVerificandoIA(true);
    try {
      const respuesta = await fetch('/api/ia-verify', { method: 'POST' });
      const data = await respuesta.json();
      if (data.success && data.data) {
        setVerificadoIA(data.data.verificado);
      }
    } catch (err) {
      console.error('Error verificando con IA:', err);
    } finally {
      setVerificandoIA(false);
    }
  };

  const obtenerTasas = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch('/api/bcv');
      const data = await respuesta.json();
      if (data.success && data.data) {
        setTasas(data.data);
        setVerificadoIA(false);
        await verificarConIA();
      } else {
        setError(data.error || 'Error al obtener tasas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Tasas de Cambio
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TasaCard titulo="Dólar Estadounidense" simbolo="💵" valor={0} tipo="USD" />
          <TasaCard titulo="Euro" simbolo="💶" valor={0} tipo="EUR" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Tasas de Cambio
        </h2>
        <div className="flex items-center gap-3">
          <IABadge verificado={verificadoIA} cargando={verificandoIA} />
          <button
            onClick={obtenerTasas}
            disabled={cargando}
            className="text-sm text-[var(--golden)] hover:text-[var(--golden-light)] disabled:opacity-50"
          >
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
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
