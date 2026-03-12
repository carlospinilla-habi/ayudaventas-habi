# Subir Ayudaventas a GitHub y Vercel

## Paso 1: Aceptar licencia de Xcode (solo una vez)

Si nunca lo has hecho, en Terminal:

```bash
sudo xcodebuild -license
```

Acepta la licencia cuando te lo pida.

---

## Paso 2: Completar el código en GitHub

En Terminal, desde la carpeta del proyecto:

```bash
cd /Users/usermac/Documents/habi/vibecoding/Ayudaventas

# Si aún no hay git inicializado:
git init
git remote add origin https://github.com/carlospinilla-habi/ayudaventas-habi.git

# Traer lo que ya está en GitHub y enlazar tu código
git fetch origin
git checkout -b main origin/main

# Añadir todo tu proyecto (código + public)
git add .
git status   # revisa que se incluyan src/, public/, package.json, etc.

# Un solo commit con el proyecto completo
git commit -m "Add full project: pages, components, public assets"

# Subir a GitHub
git push -u origin main
```

Si te pide usuario/contraseña: usa tu usuario de GitHub y un **Personal Access Token** (no la contraseña de la cuenta).

### Opción más cómoda: usar SSH (sin token cada vez)

Para no tener que meter el token en cada `git push`:

1. **Añadir tu clave SSH a GitHub** (solo una vez):
   - Entra en: https://github.com/settings/keys
   - Clic en **"New SSH key"**.
   - Título: por ejemplo "Mac Ayudaventas".
   - En "Key" pega tu clave pública. Para verla en Terminal:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Guardar.

2. **Usar la URL por SSH** en este proyecto (ya está configurado):
   ```bash
   git remote set-url origin git@github.com:carlospinilla-habi/ayudaventas-habi.git
   ```

3. A partir de ahí, `git push origin main` usará tu clave SSH y no te pedirá token.

---

## Paso 3: Desplegar en Vercel

1. Entra a **https://vercel.com** e inicia sesión (con GitHub si quieres).
2. Clic en **Add New…** → **Project**.
3. En "Import Git Repository" elige **carlospinilla-habi/ayudaventas-habi**.
4. Vercel detectará **Vite**. Revisa:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`
5. Clic en **Deploy**.
6. Cuando termine, tendrás un enlace tipo:  
   `https://ayudaventas-habi-xxx.vercel.app`  
   Ese es tu proyecto en producción.

---

## Resumen

| Paso | Qué hacer |
|------|-----------|
| 1 | Aceptar licencia Xcode: `sudo xcodebuild -license` |
| 2 | En la carpeta del proyecto: `git init`, `remote add`, `fetch`, `checkout main`, `add .`, `commit`, `push` |
| 3 | En vercel.com: Import project → elegir repo → Deploy |

Cuando hagas más cambios, solo haz `git add .`, `git commit -m "..."` y `git push`; Vercel volverá a desplegar solo.
