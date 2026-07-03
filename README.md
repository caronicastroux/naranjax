# NaranjaX — Prototipo de gestión de eventos

Prototipo low-fi en React Native (Expo) para validar el user flow de una app de gestión de eventos y tareas.

## Cómo correr

```bash
npm start
# Luego presionar "w" para abrir en el browser, o escanear el QR con Expo Go
```

## Estructura de archivos

```
src/
├── models/types.ts              — Tipos: Event, Task, enums
├── data/sampleData.ts           — Seed data (4 eventos, ~19 tareas)
├── store/EventStore.tsx         — Estado global (Context + hooks)
├── theme/colors.ts              — Paleta de grises + acento
├── navigation.tsx               — Stack + Tab navigator
├── components/
│   ├── StatusChip.tsx           — Chip de estado (Pendiente/En progreso/Hecho)
│   ├── PriorityTag.tsx          — Tag de prioridad (Alta/Media/Baja)
│   ├── EventCard.tsx            — Card de evento (scroll horizontal del Home)
│   ├── TaskRow.tsx              — Fila de tarea con estado y horario
│   ├── ToastView.tsx            — Toast animado (3.5s)
│   ├── DeleteConfirmation.tsx   — Action sheet de confirmación de borrado
│   ├── EmptyState.tsx           — Estado vacío reutilizable
│   └── Swipeable.tsx            — Swipe-to-delete
└── views/
    ├── Home/HomeScreen.tsx      — Dashboard (saludo, eventos, tareas)
    ├── Events/
    │   ├── EventListScreen.tsx  — Lista de todos los eventos
    │   ├── EventDetailScreen.tsx— Detalle de evento + sus tareas
    │   └── EventFormScreen.tsx  — Form crear/editar evento (modal)
    ├── Tasks/
    │   ├── TaskListScreen.tsx   — Lista de todas las tareas
    │   ├── TaskDetailScreen.tsx — Detalle de tarea + cambio de estado
    │   └── TaskFormScreen.tsx   — Form crear/editar tarea (modal)
    └── Placeholders/
        └── PlaceholderScreen.tsx— Calendario, Notificaciones, Buscar
```

## Pantallas (7) + Overlays

1. **Home/Dashboard** — Saludo, eventos en scroll horizontal, tareas con filtro segmentado
2. **Lista de Eventos** — Todos los eventos con swipe-to-delete
3. **Lista de Tareas** — Todas las tareas con swipe-to-delete
4. **Detalle de Evento** — Header + tareas del evento, menú (...) para editar/eliminar
5. **Detalle de Tarea** — Datos + cambio de estado, menú (...) para editar/eliminar
6. **Form de Evento** — Modal crear/editar con Cancelar/Guardar
7. **Form de Tarea** — Modal crear/editar con picker de evento y prioridad segmentada

**Overlays:** Confirmación de borrado (action sheet), Toast animado, Estados vacíos
