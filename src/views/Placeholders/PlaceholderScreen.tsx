import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function PlaceholderScreen({ title, icon }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.neutral300} />
      <Text style={styles.text}>Próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: colors.white },
  text: { fontSize: 15, color: colors.neutral500 },
});
