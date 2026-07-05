import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TaskPriority, TASK_PRIORITIES } from '../models/types';
import { colors } from '../theme/colors';

interface Props {
  priority: TaskPriority;
  onPress?: (next: TaskPriority) => void;
}

export function PriorityTag({ priority, onPress }: Props) {
  const [showSheet, setShowSheet] = useState(false);

  const handleSelect = (p: TaskPriority) => {
    setShowSheet(false);
    onPress?.(p);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.chip}
        activeOpacity={onPress ? 0.7 : 1}
        onPress={() => onPress && setShowSheet(true)}
        disabled={!onPress}
      >
        <Text style={styles.text}>{priority}</Text>
        <MaterialIcons name="expand-more" size={14} color={colors.neutral500} />
      </TouchableOpacity>

      <Modal visible={showSheet} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowSheet(false)}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Prioridad</Text>
            {TASK_PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.option}
                onPress={() => handleSelect(p)}
              >
                <Text style={[
                  styles.optionText,
                  priority === p && styles.optionTextActive,
                ]}>
                  {p}
                </Text>
                {priority === p && (
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
    paddingLeft: 12,
    paddingRight: 6,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: colors.neutral500,
    gap: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral500,
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
