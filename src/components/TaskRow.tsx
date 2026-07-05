import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Animated, PanResponder, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Task, TaskStatus, TaskPriority } from '../models/types';
import { StatusChip } from './StatusChip';
import { PriorityTag } from './PriorityTag';
import { DeleteConfirmation } from './DeleteConfirmation';
import { colors } from '../theme/colors';

const DELETE_THRESHOLD = 80;
const SWIPE_OPEN_THRESHOLD = 40;
const nativeDriver = Platform.OS !== 'web';

interface Props {
  task: Task;
  eventName?: string;
  variant?: 'default' | 'white';
  onPress?: () => void;
  onStatusChange?: (status: TaskStatus) => void;
  onPriorityChange?: (priority: TaskPriority) => void;
  onDelete?: () => void;
}

function formatTaskDate(fecha: string): string {
  const d = new Date(fecha + 'T12:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export function TaskRow({ task, eventName, variant = 'default', onPress, onStatusChange, onPriorityChange, onDelete }: Props) {
  const isDone = task.estado === 'Hecho';
  const translateX = useRef(new Animated.Value(0)).current;
  const [showConfirm, setShowConfirm] = useState(false);
  const isSwipedOpen = useRef(false);
  const isSwiping = useRef(false);

  const closeSwipe = useCallback(() => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: nativeDriver }).start();
    isSwipedOpen.current = false;
  }, [translateX]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gs) =>
        !!onDelete && Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderGrant: () => {
        isSwiping.current = true;
      },
      onPanResponderMove: (_, gs) => {
        if (gs.dx < 0) {
          translateX.setValue(Math.max(-DELETE_THRESHOLD, gs.dx));
        } else if (isSwipedOpen.current) {
          translateX.setValue(Math.min(0, -DELETE_THRESHOLD + gs.dx));
        }
      },
      onPanResponderRelease: (_, gs) => {
        isSwiping.current = false;
        if (gs.dx < -SWIPE_OPEN_THRESHOLD) {
          Animated.spring(translateX, { toValue: -DELETE_THRESHOLD, useNativeDriver: nativeDriver }).start();
          isSwipedOpen.current = true;
        } else {
          closeSwipe();
        }
      },
      onPanResponderTerminate: () => {
        isSwiping.current = false;
        closeSwipe();
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  const handleDeletePress = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    closeSwipe();
    onDelete?.();
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    closeSwipe();
  };

  if (!onDelete) {
    return (
      <TouchableOpacity style={[styles.card, variant === 'white' && styles.cardWhite]} onPress={onPress} activeOpacity={0.7}>
        <CardContent
          task={task}
          isDone={isDone}
          eventName={eventName}
          onStatusChange={onStatusChange}
          onPriorityChange={onPriorityChange}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.swipeContainer}>
      <TouchableOpacity
        style={[styles.deleteAction, variant === 'white' && styles.deleteActionWhite]}
        activeOpacity={0.8}
        onPress={handleDeletePress}
      >
        <MaterialIcons name="delete-outline" size={24} color={colors.white} />
      </TouchableOpacity>

      <Animated.View
        style={[styles.card, variant === 'white' && styles.cardWhite, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Pressable onPress={onPress} style={styles.cardTouchable}>
          <CardContent
            task={task}
            isDone={isDone}
            eventName={eventName}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
          />
        </Pressable>
      </Animated.View>

      <DeleteConfirmation
        visible={showConfirm}
        title="Eliminar tarea"
        message={`¿Estás seguro de eliminar "${task.nombre}"?`}
        onDelete={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
}

function CardContent({
  task,
  isDone,
  eventName,
  onStatusChange,
  onPriorityChange,
}: {
  task: Task;
  isDone: boolean;
  eventName?: string;
  onStatusChange?: (status: TaskStatus) => void;
  onPriorityChange?: (priority: TaskPriority) => void;
}) {
  return (
    <View style={styles.cardInner}>
      <TouchableOpacity
        onPress={() => onStatusChange?.(isDone ? 'Pendiente' : 'Hecho')}
        hitSlop={8}
        style={styles.checkboxArea}
      >
        <Ionicons
          name={isDone ? 'checkbox' : 'square-outline'}
          size={24}
          color={isDone ? colors.green600 : colors.neutral400}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text style={[styles.nombre, isDone && styles.nombreDone]} numberOfLines={1}>
            {task.nombre}
          </Text>
          <View style={styles.metaRow}>
            {eventName && (
              <Text style={styles.eventName} numberOfLines={1}>{eventName}</Text>
            )}
            <Ionicons name="calendar-outline" size={20} color={colors.neutral600} />
            <Text style={styles.dateText}>{formatTaskDate(task.fecha)}</Text>
          </View>
        </View>
        <View style={styles.chipRow}>
          <StatusChip status={task.estado} onPress={onStatusChange} />
          <PriorityTag priority={task.prioridad} onPress={onPriorityChange} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_THRESHOLD,
    backgroundColor: colors.destructive,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionWhite: {
    borderRadius: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 16,
    gap: 8,
  },
  cardWhite: {
    backgroundColor: colors.white,
  },
  cardTouchable: {
    flex: 1,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxArea: {
    alignSelf: 'flex-start',
  },
  content: { flex: 1, gap: 8 },
  textBlock: { gap: 4 },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    lineHeight: 24,
  },
  nombreDone: {
    textDecorationLine: 'line-through',
    color: colors.neutral500,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral600,
    lineHeight: 20,
    marginRight: 0,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral600,
    lineHeight: 20,
  },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
