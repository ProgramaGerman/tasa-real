const fs = require('fs');
const path = require('path');

async function update() {
  try {
    console.log('Iniciando actualización diaria de tasas...');
    
    const resOficial = await fetch('https://ve.dolarapi.com/v1/dolares/oficial').then(r => r.json());
    const resParalelo = await fetch('https://ve.dolarapi.com/v1/dolares/paralelo').then(r => r.json());
    
    // Si no conseguimos euro directo en dolares, consultamos la API de euros o estimamos
    let euro = 0;
    try {
      const resEuro = await fetch('https://ve.dolarapi.com/v1/monedas/eur').then(r => r.json());
      euro = resEuro.promedio;
    } catch {
      euro = resOficial.promedio * 1.09;
    }

    const oficial = resOficial.promedio;
    const paralelo = resParalelo.promedio;
    const diferencia = ((paralelo - oficial) / oficial) * 100;

    const data = {
      usd: oficial,
      eur: euro,
      usdParalelo: paralelo,
      diferenciaPorcentual: diferencia,
      fecha: new Date().toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Caracas'
      }),
      ultimaActualizacion: new Date().toISOString()
    };

    const targetDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(targetDir, 'tasas.json'),
      JSON.stringify(data, null, 2)
    );

    console.log('✅ Tasas actualizadas exitosamente en src/data/tasas.json:');
    console.log(`- Dólar Oficial: Bs. ${oficial}`);
    console.log(`- Dólar Paralelo: Bs. ${paralelo}`);
    console.log(`- Diferencia: ${diferencia.toFixed(2)}%`);
  } catch (error) {
    console.error('❌ Error actualizando las tasas:', error);
  }
}

update();
