import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.neutral300} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    gap: 8,
  },
  title: { fontSize: 17, fontWeight: '600', color: colors.neutral400 },
  subtitle: { fontSize: 14, color: colors.neutral500, textAlign: 'center' },
});
