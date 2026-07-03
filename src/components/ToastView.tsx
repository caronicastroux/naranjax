import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useEventStore } from '../store/EventStore';

export function ToastView() {
  const { toast, hideToast } = useEventStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    if (toast.visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -30, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [toast.visible]);

  if (!toast.message) return null;

  const icon = toast.message.toLowerCase().includes('eliminad')
    ? 'trash-outline'
    : 'checkmark-circle';

  const iconColor = toast.message.toLowerCase().includes('eliminad')
    ? colors.destructive
    : '#34C759';

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.pill}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
        <Text style={styles.text}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 16 : 54,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'none',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.06)',
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(20px)' }
      : {}
    ),
  } as any,
  text: {
    color: colors.label,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});
