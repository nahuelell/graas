import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, size = 38 }: { className?: string; size?: number }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label="Carrocerías Graas, inicio">
      <Image src="/brand/logo-graas.png" alt="" width={size} height={size} className="rounded-full" priority />
      <span className="leading-tight text-white">
        <span className="wide block text-lg font-bold uppercase">Graas</span>
        <span className="label block text-[0.6rem]">Carrocerías</span>
      </span>
    </Link>
  );
}
