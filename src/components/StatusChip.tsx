import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskStatus } from '../models/types';
import { colors } from '../theme/colors';

interface Props {
  status: TaskStatus;
}

const statusStyles: Record<TaskStatus, { bg: string; fg: string; dot: string }> = {
  Pendiente: { bg: colors.neutral100, fg: colors.neutral500, dot: colors.neutral500 },
  'En progreso': { bg: colors.neutral100, fg: colors.neutral500, dot: colors.neutral500 },
  Hecho: { bg: colors.green100, fg: colors.green600, dot: colors.green600 },
};

export function StatusChip({ status }: Props) {
  const s = statusStyles[status];
  return (
    <View style={[styles.chip, { backgroundColor: s.bg }]}>
      <View style={[styles.dot, { backgroundColor: s.dot }]} />
      <Text style={[styles.text, { color: s.fg }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
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
});
