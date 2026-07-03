import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Event, EVENT_ICONS } from '../models/types';
import { colors } from '../theme/colors';

interface Props {
  event: Event;
  onPress: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

const ionIconName: Record<string, keyof typeof Ionicons.glyphMap> = {
  heart: 'heart', gift: 'gift', star: 'star', briefcase: 'briefcase',
};

export function EventCard({ event, onPress }: Props) {
  const iconKey = EVENT_ICONS[event.tipo];
  const doneCount = event.tareas.filter(t => t.estado === 'Hecho').length;
  const totalCount = event.tareas.length;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {event.imagen ? (
          <>
            <Image source={event.imagen} style={styles.image} resizeMode="cover" />
            <View style={styles.imageOverlay} />
          </>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name={ionIconName[iconKey] || 'calendar'} size={32} color="rgba(255,255,255,0.4)" />
          </View>
        )}
        <View style={styles.badge}>
          <MaterialCommunityIcons name="progress-clock" size={16} color={colors.white} />
          <Text style={styles.badgeText}>{doneCount}/{totalCount}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.tipo}>{event.tipo.toUpperCase()}</Text>
        <View style={styles.titleBlock}>
          <Text style={styles.titulo} numberOfLines={2}>{event.titulo}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.neutral400} />
            <Text style={styles.metaText}>{formatDate(event.fecha)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 207,
    gap: 17,
  },
  imageContainer: {
    width: 207,
    height: 166,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.neutral1300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,10,11,0.4)',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral1300,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    lineHeight: 20,
  },
  info: {
    gap: 4,
  },
  tipo: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral400,
    lineHeight: 18,
  },
  titleBlock: {
    gap: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral1300,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral400,
    lineHeight: 20,
  },
});
