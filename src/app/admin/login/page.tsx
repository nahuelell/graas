import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";

export const metadata: Metadata = { title: "Ingresar" };

async function AlreadyLogged() {
  const admin = await getAdmin();
  if (admin) redirect("/admin");
  return null;
}

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
      <Suspense>
        <AlreadyLogged />
      </Suspense>
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/brand/logo-graas.png" alt="Carrocerías Graas" width={72} height={72} className="rounded-full" priority />
          <h1 className="h-display mt-5 text-4xl">Panel de administración</h1>
          <p className="mt-2 text-sm text-muted">Usados, trabajos entregados, catálogo y datos del sitio.</p>
        </div>
        <div className="card p-6 sm:p-8">
          {!isSupabaseConfigured && (
            <p className="mb-5 rounded-xl bg-brand/10 p-4 text-sm text-brand">
              Falta conectar la base de datos. Completá las variables de Supabase en <code>.env.local</code> (ver README) para poder ingresar.
            </p>
          )}
          <LoginForm disabled={!isSupabaseConfigured} />
        </div>
        <p className="mt-6 text-center text-xs text-dim">
          <Link href="/" className="hover:text-white">← Volver al sitio</Link>
        </p>
      </div>
    </main>
  );
}
