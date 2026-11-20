"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { login } from "@/app/admin/actions";
import { FormMessage, inputCls } from "./ui";

export function LoginForm({ disabled }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">Usuario</span>
        <input name="username" required autoComplete="username" autoCapitalize="none" placeholder="usuario" className={inputCls} disabled={disabled} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold tracking-wide text-muted uppercase">Contraseña</span>
        <span className="relative block">
          <input name="password" required type={show ? "text" : "password"} autoComplete="current-password" className={inputCls + " pr-12"} disabled={disabled} />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-white" aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </span>
      </label>
      <FormMessage state={state} />
      <button type="submit" disabled={pending || disabled} className="btn-brand w-full py-4 disabled:opacity-50">
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Ingresar
      </button>
    </form>
  );
}
