import { obtenerTasasBCV } from '@/lib/bcvService';
import TasaDisplay from '@/components/TasaDisplay';
import Calculadora from '@/components/Calculadora';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const revalidate = 300;

async function obtenerTasasIniciales() {
  try {
    const tasas = await obtenerTasasBCV();
    return tasas;
  } catch {
    return null;
  }
}

export default async function Home() {
  const tasasIniciales = await obtenerTasasIniciales();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto">
          <TasaDisplay tasasIniciales={tasasIniciales || undefined} />
          
          <Calculadora 
            tasaUSD={tasasIniciales?.usd || 0} 
            tasaEUR={tasasIniciales?.eur || 0} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
