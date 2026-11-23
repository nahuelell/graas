import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-center">
      <div>
        <p className="kicker">Error 404</p>
        <h1 className="h-display mt-4 text-7xl sm:text-9xl">
          Ruta <span className="text-brand">cortada</span>
        </h1>
        <p className="mt-4 text-muted">La página que buscás no existe o fue movida.</p>
        <Link href="/" className="btn-brand mt-8">Volver al inicio</Link>
      </div>
    </main>
  );
}
