export type EventType = 'Casamiento' | 'Cumpleaños' | 'Aniversario' | 'Corporativo';

export type TaskPriority = 'Alta' | 'Media' | 'Baja';

export type TaskStatus = 'Pendiente' | 'Hecho';

export interface Event {
  id: string;
  titulo: string;
  tipo: EventType;
  fecha: string; // ISO date string
  imagen?: any;
  tareas: Task[];
}

export interface Task {
  id: string;
  nombre: string;
  eventoId: string;
  fecha: string;
  horario: string; // "HH:mm"
  descripcion: string;
  prioridad: TaskPriority;
  estado: TaskStatus;
}

export const EVENT_TYPES: EventType[] = ['Casamiento', 'Cumpleaños', 'Aniversario', 'Corporativo'];
export const TASK_PRIORITIES: TaskPriority[] = ['Alta', 'Media', 'Baja'];
export const TASK_STATUSES: TaskStatus[] = ['Pendiente', 'Hecho'];

export const EVENT_ICONS: Record<EventType, string> = {
  Casamiento: 'heart',
  Cumpleaños: 'gift',
  Aniversario: 'star',
  Corporativo: 'briefcase',
};
