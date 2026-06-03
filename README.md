# Biosfera Producción — Landing Page

Landing page oficial de Biosfera Producción, empresa de audio, iluminación y efectos especiales para eventos, Guadalajara, Jalisco.  
Construida con Astro (SSG), CSS personalizado, GSAP y ScrollTrigger para animaciones de scroll.

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| [Astro 5](https://astro.build) | Framework — generación estática en build time |
| [GSAP 3](https://gsap.com) | Animaciones de scroll, reveal y stacking de tarjetas |
| [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Animaciones vinculadas al scroll (pin, scrub) |
| [Vercel](https://vercel.com) | Hosting y deployment |

---

## Arquitectura

```
Build time (npm run build)
    ├── Astro compila src/pages/index.astro
    ├── Lee public/scripts/main.js e inyecta el JS inline en el HTML
    ├── Compila los estilos globales desde src/layouts/Layout.astro
    └── Output: /dist — archivos estáticos listos para deploy
```

El sitio es **100% estático** — sin backend, sin llamadas a APIs en runtime. El JS se sirve inline para eliminar una petición HTTP extra.

---

## Estructura del proyecto

```
biosfera-landing/
├── public/
│   ├── assets/             # Imágenes del sitio (galería, arsenal, about)
│   ├── scripts/
│   │   └── main.js         # JavaScript del sitio (GSAP, cursor, animaciones)
│   └── logo.png            # Logotipo principal
├── src/
│   ├── components/
│   │   ├── Hero.astro          # Sección hero con partículas canvas
│   │   ├── Nav.astro           # Navbar fijo con scroll effect
│   │   ├── Ticker.astro        # Banda de texto animado
│   │   ├── About.astro         # Sección sobre nosotros
│   │   ├── Services.astro      # Servicios con tarjetas 3D tilt
│   │   ├── Gallery.astro       # Galería de proyectos (2 columnas)
│   │   ├── Stats.astro         # Contadores animados
│   │   ├── VinylSection.astro  # Sección "La Experiencia" con disco vinilo 3D
│   │   ├── Equipment.astro     # Arsenal — stacking cards con scroll
│   │   ├── CTA.astro           # Call to action final
│   │   └── Footer.astro        # Footer con navegación y redes sociales
│   ├── layouts/
│   │   └── Layout.astro        # Layout base — CSS global + GSAP CDN
│   └── pages/
│       └── index.astro         # Página principal — inyecta main.js inline
├── vercel.json             # Configuración de deployment
├── astro.config.mjs        # Configuración de Astro (output: static)
└── package.json
```

---

## Instalación y setup local

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd biosfera-landing
npm install
```

### 2. Iniciar servidor de desarrollo

```bash
npm run dev
# → http://localhost:4321
```

> No se requieren variables de entorno. El sitio es completamente estático.

---

## Desarrollo

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build estático → /dist
npm run preview  # Preview del build en local
```

---

## Imágenes

Todas las imágenes viven en `public/assets/` y se sirven como archivos estáticos:

```
public/assets/
├── Concert.jpeg            # Sección About
├── Festival.png            # Galería
├── Night-Club.png          # Galería
├── Private-Event.png       # Galería
├── Corporate-Event.png     # Galería
├── Wedding.png             # Galería
├── Quinceanera.png         # Galería
├── Arsenal-1.png           # Equipment — Allen & Heath SQ-7
├── Arsenal-2.png           # Equipment — Pioneer CDJ-3000
├── Arsenal-3.png           # Equipment — Moving Heads Pro
├── Arsenal-4.png           # Equipment — d&b audiotechnik
├── Arsenal-5.png           # Equipment — Sistema Láser ILDA
└── Arsenal-6.png           # Equipment — Efectos Especiales
```

Para reemplazar una imagen, basta con sustituir el archivo en `public/assets/` manteniendo el mismo nombre y hacer `npm run build`.

---

## Deploy en Vercel

### Opción A — Deploy automático desde GitHub (recomendado)

1. Sube el proyecto a un repositorio de GitHub
2. Importa el repositorio en [vercel.com/new](https://vercel.com/new)
3. Vercel detecta Astro automáticamente
4. Haz clic en **Deploy** — no se requieren variables de entorno

### Opción B — Deploy manual con Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Configuración aplicada (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "astro"
}
```

---

## Licencia

Todos los derechos reservados © 2026 Biosfera Producción.
