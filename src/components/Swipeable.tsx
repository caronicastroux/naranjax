import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface Props {
  children: React.ReactNode;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = -80;

export function Swipeable({ children, onDelete }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderMove: (_, gs) => {
        if (gs.dx < 0) translateX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < SWIPE_THRESHOLD) {
          Animated.spring(translateX, { toValue: -80, useNativeDriver: true }).start();
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const resetSwipe = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.deleteAction}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => { resetSwipe(); onDelete(); }}
        >
          <Ionicons name="trash" size={22} color={colors.white} />
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[styles.foreground, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  foreground: { backgroundColor: colors.white },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  deleteText: { fontSize: 11, color: colors.white, fontWeight: '500' },
});
