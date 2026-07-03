import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onDelete: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({ visible, title, message, onDelete, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 20,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: colors.neutral400,
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteBtn: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  deleteText: {
    fontSize: 17,
    color: colors.destructive,
    fontWeight: '600',
  },
  cancelBtn: {
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
