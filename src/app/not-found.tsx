import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="max-w-md">
        <p className="text-steel">Error 404</p>
        <h1 className="h-display mt-3 text-5xl sm:text-6xl">Esta página no existe</h1>
        <p className="mt-4 text-steel">Puede que la dirección esté mal escrita o que la página se haya movido.</p>
        <Link href="/" className="btn-dark mt-8">Volver al inicio</Link>
      </div>
    </main>
  );
}
