# 🚀 Guía de despliegue — CRM Interenergy

Sigue estos pasos **en orden** para tener el CRM en marcha en ~15 minutos.

---

## PASO 1 — Crear el repositorio de datos en GitHub

Este repo guardará `data/channels.json` con todos los canales.

1. Ve a https://github.com/new
2. Nombre: `crm-interenergy-data`
3. Visibilidad: **Privado** ✅
4. ✔ Marca "Add a README file"
5. Clic en **Create repository**

---

## PASO 2 — Subir los datos iniciales (946 canales del Excel)

El archivo `channels_seed.json` que se incluye en esta carpeta contiene todos tus canales ya importados desde el Excel.

1. En el repositorio `crm-interenergy-data` que acabas de crear, haz clic en **Add file → Create new file**
2. En el nombre escribe: `data/channels.json` (al escribir `/` se crea la carpeta automáticamente)
3. Abre el archivo `channels_seed.json` de esta carpeta con cualquier editor de texto
4. Copia todo el contenido y pégalo en el editor de GitHub
5. Haz clic en **Commit changes**

---

## PASO 3 — Crear el repositorio del código en GitHub

1. Ve a https://github.com/new
2. Nombre: `crm-interenergy`
3. Visibilidad: Privado
4. **No** marques "Add a README"
5. Clic en **Create repository**

Sube el código desde tu ordenador:

```bash
cd crm-interenergy          # la carpeta del proyecto
git init
git add .
git commit -m "CRM Interenergy – versión inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/crm-interenergy.git
git push -u origin main
```

> Sustituye `TU_USUARIO` por tu nombre de usuario de GitHub.

---

## PASO 4 — Crear un GitHub Personal Access Token

1. Ve a https://github.com/settings/tokens/new
2. Nota: `CRM Interenergy`
3. Expiración: 1 año (o sin expiración)
4. Permisos: marca **`repo`** (incluye contents read/write)
5. Clic en **Generate token**
6. **Copia el token** — solo lo verás una vez

---

## PASO 5 — Conectar Netlify con GitHub

1. Ve a https://app.netlify.com → **Add new site → Import an existing project**
2. Elige **GitHub** y autoriza Netlify
3. Selecciona el repositorio `crm-interenergy`
4. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Clic en **Deploy site** (puede fallar la primera vez, es normal)

---

## PASO 6 — Añadir las variables de entorno en Netlify

**Site → Site configuration → Environment variables → Add a variable**

| Variable       | Valor                                          |
|----------------|------------------------------------------------|
| `GITHUB_TOKEN` | el token del paso 4                            |
| `GITHUB_OWNER` | tu usuario de GitHub (ej: `diego-alonso`)      |
| `GITHUB_REPO`  | `crm-interenergy-data`                         |

Luego ve a **Deploys → Trigger deploy → Deploy site**.

---

## PASO 7 — Personalizar los 5 usuarios

Edita `netlify/functions/auth.js` y cambia los nombres y contraseñas:

```js
const USERS = [
  { username: 'diego',    password: 'TuContraseña1!', name: 'Diego Alonso',  role: 'admin' },
  { username: 'maria',    password: 'TuContraseña2!', name: 'María García',  role: 'comercial' },
  { username: 'carlos',   password: 'TuContraseña3!', name: 'Carlos López',  role: 'comercial' },
  { username: 'ana',      password: 'TuContraseña4!', name: 'Ana Martínez',  role: 'comercial' },
  { username: 'lucia',    password: 'TuContraseña5!', name: 'Lucía Pérez',   role: 'comercial' },
]
```

Luego sube los cambios:

```bash
git add netlify/functions/auth.js
git commit -m "Actualizar usuarios"
git push
```

Netlify redesplegará automáticamente.

---

## ✅ ¡Listo!

Tu CRM estará en la URL que Netlify te asignó (algo como `https://nombre-aleatorio.netlify.app`).

Puedes vincular tu propio dominio en: **Site → Domain management → Add a domain**.

---

## Funcionalidades del CRM

**Datos por canal:**
- Nombre Fiscal + Nombre Comercial
- Dirección, Población, Provincia
- Email y Teléfono de contacto + Persona de contacto
- Estado de negociación (personalizable)
- Observaciones y Fecha de siguiente acción
- Notas con historial por autor y fecha

**Pipeline:**
- Vista Kanban con columnas por estado (drag & drop entre estados)
- Vista Lista con tabla completa y columnas ordenables
- Filtros por categoría y por estado
- Búsqueda por empresa, contacto, población, observaciones

**Estados personalizables:**
- Haz clic en el icono ⚙️ del navbar para gestionar estados
- Añade, edita, elimina y reordena estados
- Elige el color de cada estado con el selector visual

**Alertas de próximas acciones:**
- Badge en el navbar muestra cuántos canales tienen acción en los próximos 7 días
- Las fechas pasadas se marcan en rojo en la vista lista

**Datos precargados:**
- 946 canales de tus hojas NIBA, CHC, POTENCIALES, INSTALADORES y PISOS TURÍSTICOS
- Normalizados con 9 estados de negociación

---

## Resolución de problemas

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| Error 401 al cargar | Token expirado | Regenerar token y actualizar en Netlify |
| Error 404 en /api/channels | Variable de entorno faltante | Revisar paso 6 |
| Pantalla en blanco | Error de build | Ver logs en Netlify → Deploys |
| Login inválido | Usuario/contraseña incorrecto | Revisar `auth.js` y redesplegar |
| Sin datos al entrar | `channels.json` no está en el repo de datos | Repetir paso 2 |
