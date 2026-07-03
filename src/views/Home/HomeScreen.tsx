import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventStore } from '../../store/EventStore';
import { EventCard } from '../../components/EventCard';
import { TaskRow } from '../../components/TaskRow';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { Task } from '../../models/types';
import { RootStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type TaskFilter = 'Hoy' | 'Semana' | 'Mes';
const filters: TaskFilter[] = ['Hoy', 'Semana', 'Mes'];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getWeekBounds(d: Date) {
  const day = startOfDay(d);
  const dow = day.getDay();
  const start = new Date(day);
  start.setDate(start.getDate() - dow);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  const now = new Date();
  const today = startOfDay(now);

  const real = tasks.filter(t => !t.id.startsWith('tsk-bulk-'));

  if (filter === 'Hoy') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return real.filter(t => {
      const d = new Date(t.fecha + 'T00:00:00');
      return d >= today && d < tomorrow;
    });
  }

  if (filter === 'Semana') {
    const { start, end } = getWeekBounds(now);
    return real.filter(t => {
      const d = new Date(t.fecha + 'T00:00:00');
      return d >= start && d < end;
    });
  }

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return real.filter(t => {
    const d = new Date(t.fecha + 'T00:00:00');
    return d >= monthStart && d < monthEnd;
  });
}

export function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { events, allTasks, updateTaskStatus, updateTask, deleteTask, getEvent } = useEventStore();
  const [filter, setFilter] = useState<TaskFilter>('Hoy');

  const filteredTasks = useMemo(
    () => filterTasks(allTasks, filter).sort((a, b) =>
      a.fecha.localeCompare(b.fecha) || a.horario.localeCompare(b.horario)
    ),
    [allTasks, filter],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.greeting}>Hola Carla!</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={32} color={colors.neutral1300} />
        </TouchableOpacity>
      </View>

      {/* Próximos eventos */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionRow} onPress={() => nav.navigate('MainTabs', { screen: 'Eventos' } as any)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos eventos</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.neutral1300} />
          </View>
        </TouchableOpacity>

        {events.length === 0 ? (
          <EmptyState icon="calendar-outline" title="Sin eventos" subtitle="Creá tu primer evento para empezar" />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => nav.navigate('EventDetail', { eventId: event.id })}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Tus tareas */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionRow} onPress={() => nav.navigate('MainTabs', { screen: 'Tareas' } as any)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus tareas</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.neutral1300} />
          </View>
        </TouchableOpacity>

        {/* Segmented control */}
        <View style={styles.segmented}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.segBtn, filter === f && styles.segBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.segText, filter === f && styles.segTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon="checkmark-circle-outline"
            title={`Sin tareas para ${filter.toLowerCase()}`}
            subtitle="Las tareas de tus eventos aparecerán acá"
          />
        ) : (
          <View style={styles.taskList}>
            {filteredTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                eventName={getEvent(task.eventoId)?.titulo}
                onPress={() => nav.navigate('TaskDetail', { taskId: task.id })}
                onStatusChange={(status) => updateTaskStatus(task.id, status)}
                onPriorityChange={(p) => updateTask({ ...task, prioridad: p })}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: 100 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.neutral1300,
    lineHeight: 32,
  },
  section: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 24,
  },
  sectionRow: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral1300,
    lineHeight: 28,
  },
  cardsRow: {
    gap: 16,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 1000,
    padding: 4,
    height: 48,
    gap: 2,
  },
  segBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
  },
  segBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1.5,
    elevation: 2,
  },
  segText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#78787F',
    lineHeight: 18,
  },
  segTextActive: {
    color: colors.neutral1300,
  },
  taskList: {
    gap: 8,
  },
});
