import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Event, Task, TaskStatus } from '../models/types';
import { sampleEvents } from '../data/sampleData';

interface ToastState {
  message: string;
  visible: boolean;
}

interface EventStoreContextType {
  events: Event[];
  allTasks: Task[];
  toast: ToastState;
  getEvent: (id: string) => Event | undefined;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  addTask: (task: Task, eventId: string) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  hideToast: () => void;
}

const EventStoreContext = createContext<EventStoreContextType | null>(null);

export function EventStoreProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current !== null) clearTimeout(toastTimer.current);
    setToast({ message, visible: true });
    toastTimer.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const allTasks = events.flatMap(e => e.tareas);

  const getEvent = useCallback((id: string) => events.find(e => e.id === id), [events]);

  const addEvent = useCallback((event: Event) => {
    setEvents(prev => [...prev, event]);
    showToast('Evento creado');
  }, [showToast]);

  const updateEvent = useCallback((event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    showToast('Evento actualizado');
  }, [showToast]);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    showToast('Evento eliminado');
  }, [showToast]);

  const addTask = useCallback((task: Task, eventId: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, tareas: [...e.tareas, task] } : e
    ));
    showToast('Tarea creada');
  }, [showToast]);

  const updateTask = useCallback((task: Task) => {
    setEvents(prev => prev.map(e => ({
      ...e,
      tareas: e.tareas.map(t => t.id === task.id ? task : t),
    })));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setEvents(prev => prev.map(e => ({
      ...e,
      tareas: e.tareas.filter(t => t.id !== taskId),
    })));
    showToast('Tarea eliminada');
  }, [showToast]);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setEvents(prev => prev.map(e => ({
      ...e,
      tareas: e.tareas.map(t => t.id === taskId ? { ...t, estado: status } : t),
    })));
  }, []);

  return (
    <EventStoreContext.Provider value={{
      events, allTasks, toast, getEvent,
      addEvent, updateEvent, deleteEvent,
      addTask, updateTask, deleteTask, updateTaskStatus,
      hideToast,
    }}>
      {children}
    </EventStoreContext.Provider>
  );
}

export function useEventStore() {
  const ctx = useContext(EventStoreContext);
  if (!ctx) throw new Error('useEventStore must be inside EventStoreProvider');
  return ctx;
}
