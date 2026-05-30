export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t border-[var(--border)] mt-auto bg-[var(--background-secondary)] font-mono">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[var(--foreground-secondary)] text-xs">
          Tasas oficiales del Banco Central de Venezuela (BCV) y paralelo provisto por DolarApi.
        </p>
        <p className="text-[var(--foreground-secondary)] text-[10px] mt-2 opacity-70">
          © {new Date().getFullYear()} TasaReal. Solo para fines informativos y educativos.
        </p>
      </div>
    </footer>
  );
}
