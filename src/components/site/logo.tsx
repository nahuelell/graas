import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label="Carrocerías Graas, inicio">
      <Image
        src="/brand/logo-graas.png"
        alt=""
        width={size}
        height={size}
        className="rounded-full transition duration-500 group-hover:rotate-[360deg]"
        priority
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-wider text-white">GRAAS</span>
        <span className="text-[0.55rem] font-bold tracking-[0.3em] text-brand">CARROCERÍAS</span>
      </span>
    </Link>
  );
}
