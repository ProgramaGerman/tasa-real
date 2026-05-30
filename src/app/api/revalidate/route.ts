import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  // Vercel inyecta automáticamente CRON_SECRET en producción para validar el origen del Cron
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    // Forzar la revalidación de la página principal (home)
    revalidatePath('/');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json(
      { message: 'Error revalidando', error: err?.message || err },
      { status: 500 }
    );
  }
}
