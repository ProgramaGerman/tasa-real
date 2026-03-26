import OpenAI from 'openai';
import { IAVerifyResponse } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Eres un asistente financiero especializado en tasas de cambio oficiales del Banco Central de Venezuela (BCV).

TU TAREA:
1. Buscar en fuentes oficiales el precio actual del dólar (USD) y euro (EUR) en Bolivares Venezolanos (VES/BS)
2. Indicar claramente:
   - Tasa del Dólar (USD) en Bolivares
   - Tasa del Euro (EUR) en Bolivares
   - Fecha de actualización

REGLAS:
- Solo devuelve datos del día de HOY si están disponibles
- Si no hay datos de HOY, indica la última fecha disponible
- Formato de respuesta必须是 JSON simple con las claves: usd, eur, fecha
- Ejemplo de respuesta: {"usd": 35.50, "euro": 38.20, "fecha": "26/03/2026", "verificado": true, "notas": "Datos obtenidos de fuente oficial"}
- Si no puedes confirmar los datos, indica "verificado": false y explica por qué`;

export async function verificarTasasConIA(): Promise<IAVerifyResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { 
          role: 'user', 
          content: '¿Cuál es la tasa del dólar y euro hoy según el Banco Central de Venezuela (BCV)? Por favor responde solo con JSON.' 
        },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta de la IA');
    }

    const data = JSON.parse(jsonMatch[0]);
    
    return {
      usd: data.usd || 0,
      eur: data.eur || 0,
      fecha: data.fecha || new Date().toLocaleDateString('es-VE'),
      verificado: data.verificado !== false,
      notas: data.notas || 'Datos verificados con IA',
    };
  } catch (error) {
    console.error('Error en verificación con IA:', error);
    return {
      usd: 0,
      eur: 0,
      fecha: new Date().toLocaleDateString('es-VE'),
      verificado: false,
      notas: 'Error al verificar con IA',
    };
  }
}

export async function buscarTasasIA(): Promise<{ usd: number; eur: number; fecha: string }> {
  const resultado = await verificarTasasConIA();
  return {
    usd: resultado.usd,
    eur: resultado.eur,
    fecha: resultado.fecha,
  };
}
