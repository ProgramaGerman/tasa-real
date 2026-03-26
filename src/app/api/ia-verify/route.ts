import { NextResponse } from 'next/server';
import { verificarTasasConIA } from '@/lib/iaService';

export async function POST() {
  try {
    const resultado = await verificarTasasConIA();
    
    return NextResponse.json({
      success: true,
      data: resultado,
    });
  } catch (error) {
    console.error('Error en API IA:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al verificar con IA',
      },
      { status: 500 }
    );
  }
}
