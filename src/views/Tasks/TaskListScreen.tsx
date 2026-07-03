import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventStore } from '../../store/EventStore';
import { TaskRow } from '../../components/TaskRow';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { Task, TaskPriority, Event } from '../../models/types';
import { RootStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function EventAccordion({
  event,
  tasks,
  onTaskPress,
  onStatusChange,
  onPriorityChange,
  onDelete,
  onAddTask,
}: {
  event: Event;
  tasks: Task[];
  onTaskPress: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['estado']) => void;
  onPriorityChange: (taskId: string, priority: TaskPriority) => void;
  onDelete: (taskId: string) => void;
  onAddTask: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const doneCount = tasks.filter(t => t.estado === 'Hecho').length;

  return (
    <View style={styles.accordion}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setExpanded(prev => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.accordionInfo}>
          <Text style={styles.accordionTitle} numberOfLines={1}>
            {event.titulo}
          </Text>
          <View style={styles.accordionMeta}>
            <Text style={styles.accordionCategory}>
              {event.tipo.toUpperCase()}
            </Text>
            <View style={styles.accordionCount}>
              <MaterialCommunityIcons name="progress-clock" size={20} color={colors.neutral600} />
              <Text style={styles.accordionCountText}>
                {doneCount}/{tasks.length}
              </Text>
            </View>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.neutral600}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.accordionBody}>
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              variant="white"
              onPress={() => onTaskPress(task.id)}
              onStatusChange={(status) => onStatusChange(task.id, status)}
              onPriorityChange={(p) => onPriorityChange(task.id, p)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
          <TouchableOpacity style={styles.addTaskBtn} activeOpacity={0.7} onPress={onAddTask}>
            <Text style={styles.addTaskText}>AGREGAR TAREA</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export function TaskListScreen() {
  const nav = useNavigation<Nav>();
  const { events, allTasks, deleteTask, updateTaskStatus, updateTask } = useEventStore();

  const realTasks = allTasks.filter(t => !t.id.startsWith('tsk-bulk-'));

  const groupedByEvent = events
    .map(event => ({
      event,
      tasks: realTasks
        .filter(t => t.eventoId === event.id)
        .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horario.localeCompare(b.horario)),
    }))
    .filter(g => g.tasks.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus tareas</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={32} color={colors.neutral1300} />
        </TouchableOpacity>
      </View>

      {groupedByEvent.length === 0 ? (
        <EmptyState icon="checkmark-circle-outline" title="Sin tareas" subtitle="Las tareas de tus eventos aparecerán acá" />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {groupedByEvent.map(group => (
            <EventAccordion
              key={group.event.id}
              event={group.event}
              tasks={group.tasks}
              onTaskPress={(taskId) => nav.navigate('TaskDetail', { taskId })}
              onStatusChange={(taskId, status) => updateTaskStatus(taskId, status)}
              onPriorityChange={(taskId, priority) => {
                const t = group.tasks.find(tk => tk.id === taskId);
                if (t) updateTask({ ...t, prioridad: priority });
              }}
              onDelete={(taskId) => deleteTask(taskId)}
              onAddTask={() => nav.navigate('TaskForm', { mode: 'create', preselectedEventId: group.event.id })}
            />
          ))}
        </ScrollView>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '600', color: colors.neutral1300, lineHeight: 32 },
  list: { paddingHorizontal: 16, paddingBottom: 100, gap: 12 },

  accordion: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 16,
    gap: 16,
  },
  accordionInfo: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    lineHeight: 28,
  },
  accordionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accordionCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral600,
    lineHeight: 18,
  },
  accordionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accordionCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral600,
    lineHeight: 20,
  },
  accordionBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  addTaskBtn: {
    borderWidth: 1.5,
    borderColor: colors.neutral1300,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addTaskText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral1300,
    letterSpacing: 0.5,
  },
});
