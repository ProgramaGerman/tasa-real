export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t border-[var(--border)] mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[var(--foreground-secondary)] text-sm">
          Tasas proporcionadas por el Banco Central de Venezuela (BCV)
        </p>
        <p className="text-[var(--foreground-secondary)] text-xs mt-2">
          © {new Date().getFullYear()} TasaReal. Solo para fines informativos.
        </p>
      </div>
    </footer>
  );
}
