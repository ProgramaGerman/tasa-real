export default function Header() {
  return (
    <header className="w-full py-6 px-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl blue-gradient flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-[#282c34] font-mono">$</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="blue-text">Tasa</span>
          <span className="text-[var(--foreground)] font-light">Real</span>
        </h1>
      </div>
      <p className="text-center text-[var(--foreground-secondary)] mt-2 text-sm font-mono">
        Cotización Oficial del BCV vs Dólar Paralelo
      </p>
    </header>
  );
}
