# Mission Control

Dashboard de control para OpenClaw. Todo vanilla JS, sin dependencias pesadas.

## 🚀 Inicio Rápido

### 1. Iniciar el API Bridge (datos reales)

```bash
cd repos/mission-control
node server.js
```

Esto inicia el servidor API en `http://localhost:3456`

### 2. Abrir el Dashboard

**Opción A - Abrir directamente:**
```bash
# En otra terminal
open index.html
```

**Opción B - Servidor local (recomendado):**
```bash
npx serve . -p 8080
# Abre http://localhost:8080
```

## 📡 API Endpoints

El servidor expone estos endpoints con datos reales de OpenClaw:

| Endpoint | Datos |
|----------|-------|
| `GET /api/status` | Estado del gateway y sistema |
| `GET /api/skills` | Skills disponibles |
| `GET /api/agents` | Agentes del equipo (lee `agents/*/IDENTITY.md`) |
| `GET /api/sessions` | Sesiones activas (via `openclaw sessions list`) |
| `GET /api/chats` | Chats recientes |
| `GET /api/memory` | Archivos de memoria (`MEMORY.md`, `memory/*.md`) |
| `GET /api/config` | Configuración del sistema |
| `GET /api/stats` | Estadísticas en tiempo real |
| `GET /api/cron` | Trabajos cron programados |

## 🏗️ Arquitectura

```
┌─────────────────┐      HTTP       ┌──────────────┐     CLI/FS      ┌─────────────┐
│  Mission Control │  ◄────────────► │ API Bridge   │ ◄────────────► │  OpenClaw   │
│   (Frontend)     │   localhost:3456 │  (server.js) │   openclaw cmd │   (Real)    │
└─────────────────┘                 └──────────────┘                └─────────────┘
       │                                   │
       │                                   ▼
       │                            ┌──────────────┐
       │                            │  Workspace   │
       │                            │  files       │
       │                            └──────────────┘
       ▼
┌─────────────────┐
│  Fallback Data  │  ← Si el API no está disponible
└─────────────────┘
```

## 📁 Estructura

```
mission-control/
├── index.html              # App SPA
├── server.js               # API Bridge (Node.js)
├── css/
│   └── styles.css          # Estilos vanilla
└── js/
    ├── app.js              # Router y app principal
    ├── api.js              # Cliente API (con fallback)
    ├── components/
    │   └── cards.js
    └── views/
        ├── dashboard.js
        ├── skills.js
        ├── agents.js
        ├── chats.js
        ├── sessions.js
        ├── memory.js
        └── config.js
```

## 🎨 Personalización

### Cambiar puerto del API

```bash
node server.js 5000  # Usa puerto 5000
```

Y actualiza `js/api.js`:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

### Cambiar workspace

```bash
OPENCLAW_WORKSPACE=/otro/path node server.js
```

### Modificar datos mostrados

Edita los archivos en `js/views/*.js` para cambiar cómo se renderiza la información.

## 🔧 Troubleshooting

### "API no disponible"
Asegúrate de que el servidor esté corriendo:
```bash
node server.js
```

### "Cannot fetch /api/sessions"
El comando `openclaw` debe estar en el PATH. Verifica:
```bash
which openclaw
openclaw --version
```

### Datos no actualizan
El frontend cachea los datos. Usa el botón 🔄 (refresh) o recarga la página.

## 🛣️ Roadmap

- [x] Conexión a datos reales via API Bridge
- [ ] WebSocket para actualizaciones en tiempo real
- [ ] Gráficos de uso y estadísticas
- [ ] Logs en tiempo real
- [ ] Terminal integrado
- [ ] Edición de configuración

## 📝 Notas

- **Sin dependencias**: Todo vanilla JS, sin React, Vue, ni Angular
- **Responsive**: Funciona en desktop y móvil
- **Fallback**: Si el API no está disponible, muestra datos simulados
