# Carrocerías Graas · Sitio web + Panel de administración

Sitio de **Carrocerías Graas** (Hugo Graas e Hijos S.R.L., Crespo, Entre Ríos), con línea destacada de **furgones térmicos** (`/termicos`) y panel para administrar usados, trabajos entregados, catálogo y datos del sitio.

Desarrollado por **Lell Digital** junto a **Communitypym**.

| Pieza | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components) + React 19 + TypeScript |
| Estilos y animación | Tailwind CSS 4 + Motion (intro, carrusel de portada, entradas sutiles al hacer scroll) |
| Base de datos y login | Supabase (Postgres + Auth + Row Level Security) |
| Imágenes y video | Cloudinary (subida firmada directa desde el panel, formato y calidad automáticos) |
| Hosting recomendado | Vercel |

---

## 1. Probarlo en 1 minuto (modo demo)

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. **Sin configurar nada**, el sitio funciona con datos de ejemplo (`src/lib/demo.ts`), así se puede presentar al cliente. El panel (`/admin`) pide la base de datos para poder ingresar.

---

## 2. Supabase (base de datos + usuarios)

1. Creá un proyecto en https://supabase.com (región São Paulo, la más cercana).
2. **SQL Editor → New query**, pegá y ejecutá, en este orden:
   1. `supabase/schema.sql` (tablas, seguridad y permisos)
   2. `supabase/seed.sql` (datos de contacto y catálogo inicial)
3. **Authentication → Sign In / Providers → Email**: dejá Email activado y **desactivá "Allow new users to sign up"**. Así nadie puede crearse una cuenta desde afuera.
4. **Project Settings → API**: copiá `Project URL`, `anon public` y `service_role` al `.env.local` (ver punto 4).

### Crear el usuario administrador

El login es con **usuario y contraseña**. Por detrás, el usuario se convierte en un email interno: `graas` → `graas@hugograas.com.ar` (el dominio se define en `ADMIN_USER_DOMAIN`).

```bash
npm run create-admin -- graas UnaClaveSegura123 "Hugo"
```

Se pueden crear varios usuarios. Si el usuario ya existe, el comando le cambia la contraseña.

> Alternativa manual: en Supabase, **Authentication → Users → Add user** (email `graas@hugograas.com.ar`, marcar "Auto confirm"), y después en el SQL Editor:
> `insert into admins (user_id, name) select id, 'Hugo' from auth.users where email = 'graas@hugograas.com.ar';`

---

## 3. Cloudinary (fotos y videos)

1. Creá una cuenta en https://cloudinary.com (el plan gratuito alcanza para arrancar).
2. **Dashboard → API Keys**: copiá `Cloud name`, `API Key` y `API Secret` al `.env.local`.
3. No hace falta crear "upload presets": el panel firma cada subida desde el servidor y el secreto nunca llega al navegador.

Las imágenes se guardan en carpetas `graas/usados`, `graas/trabajos`, `graas/catalogo` y `graas/sitio`. Al borrar una foto o un ítem en el panel, también se borra de Cloudinary.

---

## 4. Variables de entorno

Copiá `.env.example` como `.env.local` y completalo:

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL final, ej. `https://hugograas.com.ar` (SEO, sitemap, Open Graph) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Conexión a Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo para `npm run create-admin`. **No se carga en Vercel.** |
| `ADMIN_USER_DOMAIN` | Dominio que se agrega al usuario del login |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Subida de imágenes |
| `CLOUDINARY_FOLDER` | Carpeta raíz en Cloudinary (por defecto `graas`) |

---

## 5. Publicar en Vercel

1. Subí el proyecto a un repositorio de GitHub.
2. En https://vercel.com → **Add New → Project** → importá el repo.
3. En **Environment Variables** cargá todas las del punto 4 **menos** `SUPABASE_SERVICE_ROLE_KEY`.
4. Deploy. Después, en **Settings → Domains**, agregá `hugograas.com.ar` y `www.hugograas.com.ar` y apuntá el DNS como indica Vercel.

Cada vez que se guarda algo en el panel, la web se actualiza al instante (no hace falta volver a publicar).

---

## 6. SEO local: checklist de lanzamiento

Ya incluido en el código:
- Títulos y descripciones únicos por página, URLs limpias, `sitemap.xml` y `robots.txt` automáticos.
- Datos estructurados `LocalBusiness` (empresa, dirección, zona de influencia) y `Product` en cada carrocería y usado.
- Una página por modelo y por usado, campos de "Título y descripción para Google" editables en el catálogo.
- Imágenes optimizadas (WebP/AVIF automático), sitio rápido y adaptado al celular.

A hacer al publicar:
1. **Google Search Console**: verificar el dominio y enviar `https://hugograas.com.ar/sitemap.xml`.
2. **Google Business Profile**: reclamar/optimizar la ficha con el **mismo** nombre, dirección y teléfono que la web, categorías ("Fabricante de carrocerías", "Taller de carrocería"), fotos y horario.
3. Unificar datos en Facebook, Instagram, Páginas Amarillas y Foursquare (hoy hay teléfonos distintos).
4. Pedir reseñas en Google a clientes que retiran unidades.
5. Reemplazar las imágenes de ejemplo (`public/demo/`) y el logo (`public/brand/logo-graas.png`, `src/app/icon.png`) por los originales en alta calidad.

---

## 7. El panel (`/admin`)

| Sección | Qué permite |
|---|---|
| **Inicio** | Resumen, accesos rápidos "Subir un usado" y "Cargar una entrega", últimas consultas |
| **Usados** | Subir unidades con varias fotos (arrastrar o desde el celular), medidas, precio opcional, estado Disponible / Reservado / Vendido, publicar u ocultar |
| **Trabajos entregados** | Galería de unidades entregadas |
| **Catálogo** | Modelos de carrocerías nuevas con ficha propia y SEO |
| **Consultas** | Mensajes del formulario de contacto, con botón para responder por WhatsApp |
| **Ajustes del sitio** | Fotos de portada (carrusel, máx. 10), título grande y textos del inicio, teléfonos, WhatsApp, email, dirección, horario, redes y texto "Nosotros" |

Detalles:
- Las fotos pesadas se achican en el navegador antes de subir (rápido desde el celular).
- La primera foto es la portada; se reordenan con flechas o la estrella.
- Seguridad: solo los usuarios de la tabla `admins` pueden editar (lo controla la base de datos con RLS, no solo la interfaz).

---

## 8. Estructura del proyecto

```
src/
  app/
    (site)/            → sitio público: inicio, /termicos (landing principal), /carrocerias, /usados, /trabajos
    admin/             → login y panel (protegido)
    api/cloudinary/    → firma de subidas
    sitemap.ts, robots.ts
  components/
    site/              → intro, portada con carrusel, secciones de térmicos, tarjetas, galería, formulario
    admin/             → formularios, subidor de imágenes, listas
  lib/
    data.ts            → lecturas públicas cacheadas (se invalidan al guardar en el panel)
    admin-data.ts      → lecturas del panel
    catalog.ts         → categorías y servicios (agregar una categoría nueva acá)
    termicos.ts        → textos de la línea térmica: características, rubros, proceso y preguntas frecuentes
    demo.ts            → datos de ejemplo del modo demo
  proxy.ts             → protege /admin y refresca la sesión
supabase/
  schema.sql, seed.sql
scripts/
  create-admin.mjs
```

### Personalizar

- **Colores y tipografía**: `src/app/globals.css` (bloque `@theme`). Negro y amarillo Graas, como el logo. Tipografía Saira (variable): títulos en mayúsculas y ancho extendido como "GRAAS", etiquetas semicondensadas en amarillo como "CARROCERÍAS".
- **Intro de apertura**: `src/components/site/intro.tsx`. Logo sobre fondo negro que se levanta (≈1,4 s). Se ve una vez por sesión, se puede saltar y se desactiva si el usuario prefiere menos movimiento.
- **Portada**: carrusel de hasta 10 fotos y título grande editables desde **Ajustes del sitio**. La primera foto es la que aparece siempre al entrar (recomendado: un furgón térmico); las demás pasan solas cada 6 segundos.
- **Textos de térmicos**: `src/lib/termicos.ts`. Validar con Graas antes de publicar (materiales, alcance del equipo de frío, etc.).

---

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo en http://localhost:3000 |
| `npm run build` / `npm start` | Compilar y correr en producción |
| `npm run lint` | Revisar el código |
| `npm run create-admin -- <usuario> <clave> "<Nombre>"` | Crear o actualizar un administrador |
