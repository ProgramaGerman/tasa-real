export default function Header() {
  return (
    <header className="w-full py-6 px-4 border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full golden-gradient flex items-center justify-center">
          <span className="text-2xl font-bold text-[var(--background)]">$</span>
        </div>
        <h1 className="text-3xl font-bold golden-text">TasaReal</h1>
      </div>
      <p className="text-center text-[var(--foreground-secondary)] mt-2 text-sm">
        Tasas oficiales del Banco Central de Venezuela
      </p>
    </header>
  );
}
