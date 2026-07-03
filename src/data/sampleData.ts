import { Event, Task, TaskPriority, TaskStatus } from '../models/types';

const evento1Id = 'evt-001';
const evento2Id = 'evt-002';
const evento3Id = 'evt-003';
const evento4Id = 'evt-004';

function bulkTasks(eventoId: string, startId: number, count: number, estado: TaskStatus): Task[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `tsk-bulk-${eventoId}-${startId + i}`,
    nombre: `Tarea ${startId + i}`,
    eventoId,
    fecha: '2026-08-01',
    horario: '12:00',
    descripcion: '',
    prioridad: 'Media' as TaskPriority,
    estado,
  }));
}

const tareasEvento1: Task[] = [
  {
    id: 'tsk-001', nombre: 'Revisar lista completa de invitados', eventoId: evento1Id,
    fecha: '2026-06-30', horario: '12:20',
    descripcion: 'Cruzar lista con confirmaciones recibidas por WhatsApp',
    prioridad: 'Alta', estado: 'Pendiente',
  },
  {
    id: 'tsk-002', nombre: 'Coordinar prueba de vestuario', eventoId: evento1Id,
    fecha: '2026-06-30', horario: '16:00',
    descripcion: 'Confirmar turno en atelier para novios y cortejo',
    prioridad: 'Media', estado: 'Pendiente',
  },
  {
    id: 'tsk-003', nombre: 'Definir DJ y armar playlist de la fiesta', eventoId: evento1Id,
    fecha: '2026-06-20', horario: '15:30',
    descripcion: 'Pedir presupuesto a 3 opciones y elegir una',
    prioridad: 'Media', estado: 'Hecho',
  },
  {
    id: 'tsk-005', nombre: 'Elegir centros de mesa', eventoId: evento1Id,
    fecha: '2026-07-01', horario: '18:00',
    descripcion: 'Seleccionar entre las 3 propuestas de la florista',
    prioridad: 'Baja', estado: 'Pendiente',
  },
  {
    id: 'tsk-006', nombre: 'Reservar salón de fotos', eventoId: evento1Id,
    fecha: '2026-07-03', horario: '11:15',
    descripcion: 'Coordinar photobooth y props temáticos',
    prioridad: 'Media', estado: 'En progreso',
  },
  {
    id: 'tsk-007', nombre: 'Enviar invitaciones digitales', eventoId: evento1Id,
    fecha: '2026-06-10', horario: '09:00',
    descripcion: 'Diseño listo, enviar por mail y WhatsApp',
    prioridad: 'Alta', estado: 'Hecho',
  },
  {
    id: 'tsk-030', nombre: 'Llamar al fotógrafo y confirmar horario', eventoId: evento1Id,
    fecha: '2026-06-30', horario: '10:00',
    descripcion: 'Confirmar paquete de fotos y video para la ceremonia',
    prioridad: 'Alta', estado: 'Pendiente',
  },
  {
    id: 'tsk-031', nombre: 'Confirmar asistencia a menú degustación', eventoId: evento1Id,
    fecha: '2026-07-02', horario: '13:00',
    descripcion: 'Asistir a la prueba de platos con el catering',
    prioridad: 'Alta', estado: 'Pendiente',
  },
  {
    id: 'tsk-032', nombre: 'Pagar seña del salón', eventoId: evento1Id,
    fecha: '2026-06-25', horario: '09:00',
    descripcion: 'Transferir segundo pago de la reserva',
    prioridad: 'Alta', estado: 'Hecho',
  },
];

const tareasEvento2: Task[] = [
  {
    id: 'tsk-004', nombre: 'Confirmar menú con el catering', eventoId: evento2Id,
    fecha: '2026-06-30', horario: '10:00',
    descripcion: 'Confirmar menú final y cantidad de platos',
    prioridad: 'Media', estado: 'Pendiente',
  },
  {
    id: 'tsk-008', nombre: 'Contratar profesor para vals coreografía', eventoId: evento2Id,
    fecha: '2026-07-04', horario: '17:00',
    descripcion: 'Buscar profesor de baile y agendar ensayos',
    prioridad: 'Media', estado: 'Pendiente',
  },
  {
    id: 'tsk-009', nombre: 'Definir paleta de colores', eventoId: evento2Id,
    fecha: '2026-06-18', horario: '14:30',
    descripcion: 'Elegir combinación para decoración y papelería',
    prioridad: 'Baja', estado: 'Hecho',
  },
  {
    id: 'tsk-010', nombre: 'Reservar carrito de tragos sin alcohol', eventoId: evento2Id,
    fecha: '2026-06-22', horario: '19:00',
    descripcion: 'Contactar proveedores de barra móvil teen',
    prioridad: 'Media', estado: 'Hecho',
  },
  {
    id: 'tsk-011', nombre: 'Probar tortas (degustación)', eventoId: evento2Id,
    fecha: '2026-06-28', horario: '16:45',
    descripcion: 'Agendar degustación en 2 pastelerías',
    prioridad: 'Alta', estado: 'Pendiente',
  },
  {
    id: 'tsk-033', nombre: 'Elegir souvenirs para invitados', eventoId: evento2Id,
    fecha: '2026-06-30', horario: '15:00',
    descripcion: 'Decidir entre cajitas personalizadas o bolsitas',
    prioridad: 'Baja', estado: 'Pendiente',
  },
  {
    id: 'tsk-034', nombre: 'Confirmar animador de juegos', eventoId: evento2Id,
    fecha: '2026-07-01', horario: '11:00',
    descripcion: 'Cerrar contrato con animador para juegos teen',
    prioridad: 'Media', estado: 'Pendiente',
  },
];

const tareasEvento3: Task[] = [
  {
    id: 'tsk-012', nombre: 'Armar slideshow de fotos', eventoId: evento3Id,
    fecha: '2026-06-15', horario: '10:00',
    descripcion: 'Recopilar fotos de los 50 años juntos y montar video',
    prioridad: 'Alta', estado: 'Hecho',
  },
  {
    id: 'tsk-013', nombre: 'Reservar restaurante', eventoId: evento3Id,
    fecha: '2026-06-20', horario: '11:30',
    descripcion: 'Salón privado para 40 personas con menú fijo',
    prioridad: 'Alta', estado: 'Hecho',
  },
  {
    id: 'tsk-014', nombre: 'Encargar torta temática', eventoId: evento3Id,
    fecha: '2026-07-02', horario: '14:00',
    descripcion: 'Torta de 3 pisos con decoración dorada',
    prioridad: 'Media', estado: 'Pendiente',
  },
  {
    id: 'tsk-015', nombre: 'Coordinar discurso de hijos y nietos', eventoId: evento3Id,
    fecha: '2026-06-30', horario: '16:30',
    descripcion: 'Pedir a hijos y nietos que preparen unas palabras',
    prioridad: 'Baja', estado: 'Pendiente',
  },
  {
    id: 'tsk-035', nombre: 'Comprar regalo sorpresa', eventoId: evento3Id,
    fecha: '2026-07-03', horario: '12:00',
    descripcion: 'Cuadro con foto familiar restaurada y enmarcada',
    prioridad: 'Alta', estado: 'Pendiente',
  },
];

const tareasEvento4: Task[] = [
  {
    id: 'tsk-020', nombre: 'Confirmar oradores del panel', eventoId: evento4Id,
    fecha: '2026-06-30', horario: '10:00',
    descripcion: 'Contactar a los 4 panelistas y confirmar asistencia',
    prioridad: 'Alta', estado: 'Pendiente',
  },
  {
    id: 'tsk-016', nombre: 'Confirmar venue', eventoId: evento4Id,
    fecha: '2026-06-12', horario: '09:00',
    descripcion: 'Firmar contrato del espacio de coworking para 80 personas',
    prioridad: 'Alta', estado: 'Hecho',
  },
  {
    id: 'tsk-017', nombre: 'Diseñar presentación keynote con resultados', eventoId: evento4Id,
    fecha: '2026-07-04', horario: '13:00',
    descripcion: 'Slides con resultados Q2 y preview de producto',
    prioridad: 'Alta', estado: 'Pendiente',
  },
  {
    id: 'tsk-018', nombre: 'Armar kit de bienvenida', eventoId: evento4Id,
    fecha: '2026-06-26', horario: '15:00',
    descripcion: 'Bolsa con merch, agenda del evento y QR de feedback',
    prioridad: 'Media', estado: 'En progreso',
  },
  {
    id: 'tsk-019', nombre: 'Contratar servicio de coffee break', eventoId: evento4Id,
    fecha: '2026-07-01', horario: '11:00',
    descripcion: 'Café, jugos y snacks para 2 pausas de 30 min',
    prioridad: 'Media', estado: 'Pendiente',
  },
  {
    id: 'tsk-036', nombre: 'Enviar invitaciones corporativas', eventoId: evento4Id,
    fecha: '2026-06-30', horario: '09:30',
    descripcion: 'Mail con agenda, ubicación y código de vestimenta',
    prioridad: 'Alta', estado: 'En progreso',
  },
];

export const sampleEvents: Event[] = [
  {
    id: evento1Id,
    titulo: 'Matías y Sofía Ocampo',
    tipo: 'Casamiento',
    fecha: '2026-10-25',
    imagen: require('../../assets/images/event1.jpg'),
    tareas: [...tareasEvento1, ...bulkTasks(evento1Id, 100, 6, 'Hecho'), ...bulkTasks(evento1Id, 200, 13, 'Pendiente')],
  },
  {
    id: evento2Id,
    titulo: 'Camila Beltrán 15 años',
    tipo: 'Cumpleaños',
    fecha: '2026-12-17',
    imagen: require('../../assets/images/event2.jpg'),
    tareas: [...tareasEvento2, ...bulkTasks(evento2Id, 100, 3, 'Hecho')],
  },
  {
    id: evento3Id,
    titulo: 'Bodas de Oro - Familia Ríos',
    tipo: 'Aniversario',
    fecha: '2026-09-08',
    imagen: require('../../assets/images/event3.jpg'),
    tareas: [...tareasEvento3, ...bulkTasks(evento3Id, 100, 4, 'Hecho')],
  },
  {
    id: evento4Id,
    titulo: 'Lanzamiento Q3, Nodriza Studio',
    tipo: 'Corporativo',
    fecha: '2026-10-25',
    imagen: require('../../assets/images/event4.jpg'),
    tareas: [...tareasEvento4, ...bulkTasks(evento4Id, 100, 8, 'Hecho'), ...bulkTasks(evento4Id, 200, 2, 'Pendiente')],
  },
];
