# Publicar Gastito como web app

Guía para dejar la web andando con tu propia cuenta (una sola vez). Diseño en
`specs/002-web-app/spec.md`.

## 1. Crear el proyecto en Supabase

1. Entrá a <https://supabase.com>, creá una cuenta y un proyecto nuevo (plan Free alcanza).
   Elegí la región más cercana (São Paulo para Argentina).
2. En **SQL Editor → New query**, pegá el contenido de
   [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) y ejecutalo. Crea:
   - la tabla `vaults` (un blob cifrado por usuario, con control de versión),
   - el bucket privado `attachments` para comprobantes cifrados,
   - las políticas RLS para que cada usuario solo vea lo suyo.
3. En **Authentication → Sign In / Providers → Email**: dejá habilitado email + contraseña y
   **desactivá "Confirm email"**. Por ahora la app no manda mails (ni confirmación de cuenta ni
   "olvidé mi contraseña"): la cuenta queda activa apenas se crea. Si "Confirm email" queda
   prendido, la cuenta se crea pero no se puede entrar, y la app lo avisa.
4. En **Authentication → URL Configuration**: poné en *Site URL* la URL donde vas a publicar la
   web (por ejemplo `https://gastito.vercel.app`) y agregala también en *Redirect URLs*.
   Hoy no se usa; hace falta cuando se activen los mails (el código queda comentado con
   `EMAILS DESACTIVADOS`).
5. En **Project Settings → API** copiá:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

   La `anon` key es pública por diseño (va dentro del JavaScript del sitio); la seguridad la dan
   las políticas RLS y el cifrado de punta a punta. **Nunca** uses la `service_role` key en el
   front.

## 2. Probar en local

```bash
cp .env.example .env      # y completar las dos variables
yarn install
yarn dev:web              # web en http://localhost:5173
yarn dev                  # app de escritorio (Electron) con la misma cuenta
```

## 3. Publicar la web (Vercel)

1. En <https://vercel.com> → **Add New → Project** → importá el repo de GitHub.
2. Vercel lee `vercel.json` (build `yarn build:web`, salida `dist-web`).
3. En **Settings → Environment Variables** cargá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Cada push a `main` vuelve a publicar.

Cualquier hosting estático sirve (Cloudflare Pages, Netlify, GitHub Pages): la app usa
`HashRouter`, así que no hace falta configurar rewrites.

### En el celular

Abrí la URL en el navegador e iniciá sesión. Para tenerla como app: en Chrome/Android
"Agregar a la pantalla principal"; en Safari/iOS "Compartir → Agregar a inicio".

## 4. App de escritorio

El workflow `.github/workflows/release.yml` necesita los mismos dos valores como **secrets** del
repo (`Settings → Secrets and variables → Actions`): `VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY`. Después, como siempre: `git tag vX.Y.Z && git push origin vX.Y.Z`.

## 5. Primer uso

Al iniciar sesión por primera vez se crea el hogar con una **clave del hogar** nueva. Si tenés
un respaldo `.dat` de la app de escritorio anterior, se puede importar desde *Importar respaldo
existente* (con la clave del hogar con la que se creó; los adjuntos no viajan en el `.dat`).

## Seguridad

- Hay dos credenciales: la contraseña de la **cuenta** (Supabase; mientras no haya mails, si
  se olvida se resetea desde el panel de Supabase en *Authentication → Users*) y la
  **clave del hogar** (cifra los datos en tu dispositivo, nunca se envía; si se pierde, los datos
  no se pueden recuperar).
- Supabase solo guarda blobs cifrados con AES-256-GCM; no puede leer tus finanzas.
