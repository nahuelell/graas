import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";
import { Sidebar } from "@/components/admin/sidebar";

// El panel siempre se renderiza al momento (depende de la sesión), no hace falta prerender.
export const instant = false;

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="px-5 py-8 sm:px-8 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <Suspense
            fallback={
              <div className="grid min-h-[50vh] place-items-center text-muted">
                <LoaderCircle className="size-6 animate-spin" />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
