import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TaskStatus, TASK_STATUSES } from '../models/types';
import { colors } from '../theme/colors';

const statusStyles: Record<TaskStatus, { bg: string; fg: string; dot: string }> = {
  Pendiente: { bg: colors.neutral100, fg: colors.neutral500, dot: colors.neutral500 },
  Hecho: { bg: colors.green100, fg: colors.green600, dot: colors.green600 },
};

interface Props {
  status: TaskStatus;
  onPress?: (next: TaskStatus) => void;
}

export function StatusChip({ status, onPress }: Props) {
  const [showSheet, setShowSheet] = useState(false);
  const s = statusStyles[status];

  const handleSelect = (st: TaskStatus) => {
    setShowSheet(false);
    onPress?.(st);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.chip, { backgroundColor: s.bg }]}
        activeOpacity={onPress ? 0.7 : 1}
        onPress={() => onPress && setShowSheet(true)}
        disabled={!onPress}
      >
        <View style={[styles.dot, { backgroundColor: s.dot }]} />
        <Text style={[styles.text, { color: s.fg }]}>{status}</Text>
        {onPress && <MaterialIcons name="expand-more" size={14} color={s.fg} />}
      </TouchableOpacity>

      <Modal visible={showSheet} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowSheet(false)}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Estado</Text>
            {TASK_STATUSES.map((st) => (
              <TouchableOpacity
                key={st}
                style={styles.option}
                onPress={() => handleSelect(st)}
              >
                <Text style={[
                  styles.optionText,
                  status === st && styles.optionTextActive,
                ]}>
                  {st}
                </Text>
                {status === st && (
                  <MaterialIcons name="check" size={20} color={colors.brand700} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSheet(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    gap: 2,
    paddingLeft: 12,
    paddingRight: 6,
    borderRadius: 1000,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 8,
    paddingBottom: 34,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D1D6',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral600,
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  optionText: {
    fontSize: 17,
    color: colors.neutral1300,
  },
  optionTextActive: {
    color: colors.brand700,
    fontWeight: '600',
  },
  cancelBtn: {
    marginTop: 8,
    marginHorizontal: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17,
    color: colors.brand700,
    fontWeight: '600',
  },
});
