import type { SVGProps } from "react";
import type { TruckKind } from "@/lib/catalog";

/** Ícono lineal de camión según el tipo de carrocería (mismo estilo que la propuesta). */
export function TruckIcon({ kind = "box", className, strokeWidth = 1.6 }: { kind?: TruckKind | string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 64 44" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" className={className} aria-hidden>
      {/* cabina */}
      <path d="M45 35V14h9l7 9.5V35" />
      <path d="M48 17h5l4 6h-9z" />
      <path d="M1 35h44" />
      {kind === "termico" && (
        <>
          <rect x="1" y="6" width="41" height="27" rx="1" />
          <path d="M21.5 12v14M15.4 15.5l12.2 7M15.4 22.5l12.2-7" />
        </>
      )}
      {kind === "baranda" && (
        <>
          <rect x="1" y="21" width="41" height="12" />
          <path d="M8 21v12M15 21v12M22 21v12M29 21v12M36 21v12" />
          <path d="M38 21V9h4v12" />
        </>
      )}
      {kind === "sider" && (
        <>
          <rect x="1" y="6" width="41" height="27" rx="1" />
          <path d="M6 9v21M11 9v21M16 9v21M21 9v21M26 9v21M31 9v21M36 9v21" />
        </>
      )}
      {kind === "playa" && (
        <>
          <rect x="1" y="27" width="41" height="6" />
          <path d="M38 27V14h4v13" />
        </>
      )}
      {kind === "box" && <rect x="1" y="6" width="41" height="27" rx="1" />}
      <circle cx="10" cy="37" r="4" fill="var(--color-ink, #0d0d0f)" />
      <circle cx="19" cy="37" r="4" fill="var(--color-ink, #0d0d0f)" />
      <circle cx="53" cy="37" r="4" fill="var(--color-ink, #0d0d0f)" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.96-3.48-.23-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.38 9.38 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.2-4.24 9.44-9.45 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.6l6.01-1.58a11.33 11.33 0 0 0 5.45 1.39h.01c6.27 0 11.37-5.1 11.37-11.36 0-3.04-1.18-5.89-3.33-8.03z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.87.25-1.46 1.5-1.46h1.6V4.36A21 21 0 0 0 14.27 4.2c-2.3 0-3.86 1.4-3.86 3.97v2.24H7.8v3h2.6V21z" />
    </svg>
  );
}
