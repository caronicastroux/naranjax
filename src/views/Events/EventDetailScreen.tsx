import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { useEventStore } from '../../store/EventStore';
import { TaskRow } from '../../components/TaskRow';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function EventDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'EventDetail'>>();
  const { getEvent, deleteEvent, deleteTask, updateTaskStatus, updateTask } = useEventStore();
  const event = getEvent(route.params.eventId);

  const [showDeleteEvent, setShowDeleteEvent] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!event) return <EmptyState icon="alert-circle-outline" title="Evento no encontrado" subtitle="" />;

  const realTasks = event.tareas.filter(t => !t.id.startsWith('tsk-bulk-'));
  const doneCount = event.tareas.filter(t => t.estado === 'Hecho').length;
  const totalCount = event.tareas.length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Custom header: back + more_vert */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => nav.goBack()} hitSlop={12}>
            <Ionicons name="chevron-back" size={32} color={colors.neutral1300} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(true)} hitSlop={12}>
            <Ionicons name="ellipsis-vertical" size={32} color={colors.neutral1300} />
          </TouchableOpacity>
        </View>

        {/* Event info */}
        <View style={styles.infoSection}>
          <View style={styles.titleBlock}>
            <Text style={styles.titulo}>{event.titulo}</Text>
            <Text style={styles.tipo}>{event.tipo.toUpperCase()}</Text>
          </View>

          {/* Featured image */}
          <View style={styles.imageCard}>
            {event.imagen ? (
              <Image source={event.imagen} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="calendar" size={48} color="rgba(255,255,255,0.4)" />
              </View>
            )}
            <View style={styles.imageOverlay} />
          </View>
        </View>

        {/* Tasks section */}
        <View style={styles.taskSection}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>Tareas</Text>
            <View style={styles.taskCount}>
              <MaterialCommunityIcons name="progress-clock" size={24} color={colors.neutral1300} />
              <Text style={styles.taskCountText}>{doneCount}/{totalCount}</Text>
            </View>
          </View>

          <View style={styles.taskList}>
            {realTasks.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>
                  Todavía no hay ninguna tarea{'\n'}creada para este evento.
                </Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  activeOpacity={0.7}
                  onPress={() => nav.navigate('TaskForm', { mode: 'create', preselectedEventId: event.id })}
                >
                  <Text style={styles.emptyBtnText}>CREAR TAREA</Text>
                </TouchableOpacity>
              </View>
            ) : (
              realTasks
                .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horario.localeCompare(b.horario))
                .map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onPress={() => nav.navigate('TaskDetail', { taskId: task.id })}
                    onStatusChange={(status) => updateTaskStatus(task.id, status)}
                    onPriorityChange={(p) => updateTask({ ...task, prioridad: p })}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating + button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.7}
        onPress={() => nav.navigate('TaskForm', { mode: 'create', preselectedEventId: event.id })}
      >
        {Platform.OS === 'web' ? (
          <View style={styles.fabBg} />
        ) : (
          <BlurView intensity={40} tint="light" style={styles.fabBlur} />
        )}
        <View style={styles.fabFill} />
        <Ionicons name="add" size={24} color={colors.neutral1300} />
      </TouchableOpacity>

      {/* More menu overlay */}
      {showMenu && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={styles.menuOverlayBg} activeOpacity={1} onPress={() => setShowMenu(false)} />
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                nav.navigate('EventForm', { mode: 'edit', event });
              }}
            >
              <Ionicons name="pencil" size={18} color={colors.label} />
              <Text style={styles.menuItemText}>Editar evento</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setShowMenu(false); setShowDeleteEvent(true); }}
            >
              <Ionicons name="trash" size={18} color={colors.destructive} />
              <Text style={[styles.menuItemText, { color: colors.destructive }]}>Eliminar evento</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <DeleteConfirmation
        visible={showDeleteEvent}
        title="Eliminar evento"
        message={`¿Seguro que querés eliminar "${event.titulo}"? Se borrarán también sus tareas.`}
        onDelete={() => { deleteEvent(event.id); setShowDeleteEvent(false); nav.goBack(); }}
        onCancel={() => setShowDeleteEvent(false)}
      />

    </View>
  );
}

export function EventDetailHeaderRight({ eventId }: { eventId: string }) {
  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingBottom: 120 },

  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 12,
    paddingBottom: 0,
  },

  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
    gap: 16,
  },
  titleBlock: { gap: 8 },
  titulo: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.neutral1300,
    lineHeight: 32,
  },
  tipo: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral600,
    lineHeight: 20,
    letterSpacing: 0.5,
  },

  imageCard: {
    height: 243,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.neutral1300,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  taskSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral1300,
    lineHeight: 28,
  },
  taskCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskCountText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral1300,
    lineHeight: 24,
  },
  taskList: { gap: 8 },

  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral1300,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyBtn: {
    backgroundColor: colors.neutral1300,
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },

  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 24 : 42,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 }
    ),
  } as any,
  fabBlur: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  fabBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
  } as any,
  fabFill: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 1000,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  menuOverlayBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menuCard: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 100 : 96,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    minWidth: 200,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }
    ),
  } as any,
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: { fontSize: 15, color: colors.label },
});
