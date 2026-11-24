import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, size = 38, tone = "dark" }: { className?: string; size?: number; tone?: "dark" | "light" }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label="Carrocerías Graas, inicio">
      <Image src="/brand/logo-graas.png" alt="" width={size} height={size} className="rounded-full" priority />
      <span className={cn("text-[0.95rem] font-bold leading-tight transition-colors duration-500", tone === "light" ? "text-white" : "text-char")}>
        <span className="wide block">Graas</span>
        <span className="block text-xs font-medium opacity-60">Carrocerías</span>
      </span>
    </Link>
  );
}
