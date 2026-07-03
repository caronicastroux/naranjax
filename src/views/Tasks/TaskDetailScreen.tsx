import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventStore } from '../../store/EventStore';
import { StatusChip } from '../../components/StatusChip';
import { PriorityTag } from '../../components/PriorityTag';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export function TaskDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'TaskDetail'>>();
  const { allTasks, getEvent, updateTask, deleteTask } = useEventStore();
  const task = allTasks.find(t => t.id === route.params.taskId);

  const [showMenu, setShowMenu] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (!task) return <View style={styles.container}><Text>Tarea no encontrada</Text></View>;

  const event = getEvent(task.eventoId);
  const eventName = event?.titulo ?? '—';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => nav.goBack()} hitSlop={12}>
            <Ionicons name="chevron-back" size={32} color={colors.neutral1300} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(true)} hitSlop={12}>
            <Ionicons name="ellipsis-vertical" size={32} color={colors.neutral1300} />
          </TouchableOpacity>
        </View>

        {/* Title section */}
        <View style={styles.titleSection}>
          <View style={styles.titleBlock}>
            <Text style={styles.label}>TAREA</Text>
            <Text style={styles.titulo}>{task.nombre}</Text>
          </View>
          <View style={styles.chipRow}>
            <StatusChip status={task.estado} />
            <PriorityTag
              priority={task.prioridad}
              onPress={(p) => updateTask({ ...task, prioridad: p })}
            />
          </View>
        </View>

        {/* General section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GENERAL</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>{eventName}</Text>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardText}>Vencimiento</Text>
              <Text style={styles.cardText}>{formatDate(task.fecha)}</Text>
            </View>
          </View>
        </View>

        {/* Notas section */}
        {task.descripcion ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NOTAS</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{task.descripcion}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* More menu overlay */}
      {showMenu && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={styles.menuOverlayBg} activeOpacity={1} onPress={() => setShowMenu(false)} />
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                nav.navigate('TaskForm', { mode: 'edit', task });
              }}
            >
              <Ionicons name="pencil" size={18} color={colors.label} />
              <Text style={styles.menuItemText}>Editar tarea</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setShowMenu(false); setShowDelete(true); }}
            >
              <Ionicons name="trash" size={18} color={colors.destructive} />
              <Text style={[styles.menuItemText, { color: colors.destructive }]}>Eliminar tarea</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <DeleteConfirmation
        visible={showDelete}
        title="Eliminar tarea"
        message={`¿Seguro que querés eliminar "${task.nombre}"?`}
        onDelete={() => { deleteTask(task.id); setShowDelete(false); nav.goBack(); }}
        onCancel={() => setShowDelete(false)}
      />
    </View>
  );
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

  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
    gap: 16,
  },
  titleBlock: { gap: 8 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral600,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.neutral1300,
    lineHeight: 32,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  section: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral600,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 19,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral1300,
    lineHeight: 24,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.neutral100,
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
