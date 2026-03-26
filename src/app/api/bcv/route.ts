import { NextResponse } from 'next/server';
import { obtenerTasasBCV } from '@/lib/bcvService';

export async function GET() {
  try {
    const tasas = await obtenerTasasBCV();
    
    return NextResponse.json({
      success: true,
      data: tasas,
    });
  } catch (error) {
    console.error('Error en API BCV:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las tasas del BCV',
      },
      { status: 500 }
    );
  }
}
