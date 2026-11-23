import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { cloudinaryFolder, cloudinaryServerReady, signUpload } from "@/lib/cloudinary-server";

const ALLOWED = new Set(["usados", "catalogo", "trabajos", "sitio"]);

/** Firma subidas directas a Cloudinary. Solo para administradores logueados. */
export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!cloudinaryServerReady) return NextResponse.json({ error: "Cloudinary no está configurado" }, { status: 500 });

  const body = (await request.json().catch(() => ({}))) as { folder?: string };
  const sub = ALLOWED.has(body.folder ?? "") ? body.folder : "otros";
  return NextResponse.json(signUpload(`${cloudinaryFolder}/${sub}`));
}
