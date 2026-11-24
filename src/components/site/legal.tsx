import type { ReactNode } from "react";
import { PageBanner } from "./blocks";

/** Página legal: texto corrido, ancho de lectura cómodo. */
export function LegalPage({ title, updated, children }: { title: string[]; updated: string; children: ReactNode }) {
  return (
    <>
      <PageBanner title={title} text={`Última actualización: ${updated}`} />
      <article className="container-x pb-28">
        <div className="max-w-[68ch] space-y-10 leading-relaxed text-white/80 [&_h2]:wide [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-1.5 [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </article>
    </>
  );
}
