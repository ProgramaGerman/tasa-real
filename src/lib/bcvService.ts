import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

export interface TasasBCV {
  usd: number;
  eur: number;
  usdParalelo: number;
  diferenciaPorcentual: number;
  fecha: string;
  ultimaActualizacion: string;
}

async function obtenerTasaParalelo(): Promise<number> {
  try {
    const { data } = await axios.get('https://ve.dolarapi.com/v1/dolares/paralelo', {
      timeout: 10000,
    });
    if (data && typeof data.promedio === 'number') {
      return data.promedio;
    }
    throw new Error('Respuesta inválida de DolarApi');
  } catch (error) {
    console.error('Error al obtener tasa del paralelo:', error);
    throw error;
  }
}

const BCV_URL = 'https://www.bcv.org.ve/';

export async function obtenerTasasBCV(): Promise<TasasBCV> {
  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    
    const { data } = await axios.get(BCV_URL, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-VE,es;q=0.9,en;q=0.8',
      },
      httpsAgent,
    });

    const $ = cheerio.load(data);
    
    const tasas: { usd?: number; eur?: number } = {};
    let fecha = '';

    const selectors = [
      '.currency .currencyValue',
      '.indicador .value',
      '.tc-bcv .valor',
      '[class*="currencyValue"]',
      '[class*="indicador"] .value',
      '.price-item .price-value',
      '.valorDivisa',
      '#USD .valor',
      '#EUR .valor',
      '.dolar .precio',
      '.euro .precio',
    ];

    for (const selector of selectors) {
      $(selector).each((_, el) => {
        const text = $(el).text().trim();
        const valueMatch = text.replace(/[^\d.,]/g, '').match(/(\d+[\.,]\d+)/);
        if (valueMatch) {
          const valor = parseFloat(valueMatch[1].replace(',', '.'));
          if (!tasas.usd && (selector.includes('dolar') || text.toLowerCase().includes('dólar') || text.toLowerCase().includes('usd'))) {
            tasas.usd = valor;
          }
          if (!tasas.eur && (selector.includes('euro') || text.toLowerCase().includes('euro') || text.toLowerCase().includes('eur'))) {
            tasas.eur = valor;
          }
        }
      });
    }

    const textContent = $('body').text();
    
    const usdMatch = textContent.match(/(?:dólar|dollar|usd)\s*[\s:]*\s*(\d+[\.,]\d{2,})/i);
    const eurMatch = textContent.match(/(?:euro|eur)\s*[\s:]*\s*(\d+[\.,]\d{2,})/i);

    if (!tasas.usd && usdMatch) {
      tasas.usd = parseFloat(usdMatch[1].replace(',', '.'));
    }
    if (!tasas.eur && eurMatch) {
      tasas.eur = parseFloat(eurMatch[1].replace(',', '.'));
    }

    const fechaSelectors = [
      '.fechaActualizacion',
      '.last-update',
      '[class*="fecha"]',
      '.update-date',
      '#fecha',
    ];
    
    for (const selector of fechaSelectors) {
      const fechaEl = $(selector).first();
      const fechaText = fechaEl.text().trim();
      if (fechaText) {
        fecha = fechaText;
        break;
      }
    }

    if (!fecha) {
      fecha = new Date().toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    if (!tasas.usd || !tasas.eur) {
      throw new Error('No se pudieron obtener las tasas del BCV');
    }

    const usdParalelo = await obtenerTasaParalelo().catch(() => {
      // Si la API del paralelo falla, estimamos un 12% por encima como fallback
      return tasas.usd ? tasas.usd * 1.12 : 0;
    });

    const diferenciaPorcentual = tasas.usd > 0 
      ? ((usdParalelo - tasas.usd) / tasas.usd) * 100 
      : 0;

    return {
      usd: tasas.usd,
      eur: tasas.eur,
      usdParalelo,
      diferenciaPorcentual,
      fecha,
      ultimaActualizacion: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error obteniendo tasas del BCV, intentando usar caché local:', error);
    try {
      const fs = require('fs');
      const path = require('path');
      const cachePath = path.join(process.cwd(), 'src/data/tasas.json');
      if (fs.existsSync(cachePath)) {
        const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        return cacheData;
      }
    } catch (cacheError) {
      console.error('Error leyendo caché local de tasas:', cacheError);
    }
    throw new Error('Error al obtener las tasas del BCV');
  }
}

export async function obtenerTasaUSD(): Promise<number> {
  const tasas = await obtenerTasasBCV();
  return tasas.usd;
}

export async function obtenerTasaEUR(): Promise<number> {
  const tasas = await obtenerTasasBCV();
  return tasas.eur;
}

export async function obtenerTasaUSDParalelo(): Promise<number> {
  const tasas = await obtenerTasasBCV();
  return tasas.usdParalelo;
}
