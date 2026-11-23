import Link from "next/link";
import { CircleCheck, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { getCategory } from "@/lib/catalog";
import { mediaUrl } from "@/lib/cloudinary";
import type { MediaAsset } from "@/lib/types";
import { TruckIcon } from "@/components/site/icons";

export function NewButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn-brand">
      <Plus className="size-4" /> {label}
    </Link>
  );
}

export function SavedBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="mb-6 flex items-center gap-2 rounded-xl bg-wa/15 px-4 py-3 text-sm font-semibold text-wa">
      <CircleCheck className="size-4" /> Guardado. Ya se ve en la web.
    </p>
  );
}

export function Thumb({ images, category }: { images: MediaAsset[]; category: string }) {
  const first = images[0];
  return (
    <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-ink">
      {first ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaUrl(first, 160)} alt="" className="h-full w-full object-cover" />
      ) : (
        <TruckIcon kind={getCategory(category).icon} className="w-10 text-brand" />
      )}
    </span>
  );
}

export function ListRow({ thumb, title, meta, children, href }: { thumb: ReactNode; title: string; meta: ReactNode; children: ReactNode; href: string }) {
  return (
    <li className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
      {thumb}
      <Link href={href} className="min-w-0 flex-1">
        <p className="truncate font-semibold hover:text-brand">{title}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dim">{meta}</div>
      </Link>
      <div className="flex items-center gap-3">{children}</div>
    </li>
  );
}

export function EmptyState({ text, href, label }: { text: string; href: string; label: string }) {
  return (
    <div className="card grid place-items-center gap-4 p-14 text-center">
      <p className="text-muted">{text}</p>
      <NewButton href={href} label={label} />
    </div>
  );
}
