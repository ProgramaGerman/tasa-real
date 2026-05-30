export interface TasasBCV {
  usd: number;
  eur: number;
  usdParalelo: number;
  diferenciaPorcentual: number;
  fecha: string;
  ultimaActualizacion: string;
}

export interface ResultadoCalculadora {
  cantidad: number;
  monedaOrigen: 'USD' | 'EUR' | 'VES';
  monedaDestino: 'USD' | 'EUR' | 'VES';
  resultado: number;
}

export interface ResponseAPI<T> {
  success: boolean;
  data?: T;
  error?: string;
}


