import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventStore } from '../../store/EventStore';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { Event, EVENT_ICONS } from '../../models/types';
import { RootStackParamList } from '../../navigation';
import { LinearGradient } from 'expo-linear-gradient';

type Nav = NativeStackNavigationProp<RootStackParamList>;

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

export function EventListScreen() {
  const nav = useNavigation<Nav>();
  const { events, deleteEvent } = useEventStore();
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Eventos</Text>
        </View>
        <EmptyState icon="calendar-outline" title="Sin eventos" subtitle="Creá tu primer evento para empezar" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Event }) => {
    const iconKey = EVENT_ICONS[item.tipo];
    const doneCount = item.tareas.filter(t => t.estado === 'Hecho').length;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => nav.navigate('EventDetail', { eventId: item.id })}
        activeOpacity={0.8}
        onLongPress={() => setDeleteTarget(item)}
      >
        {item.imagen ? (
          <Image source={item.imagen} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.cardPlaceholder}>
            <Ionicons name={ionIconName[iconKey] || 'calendar'} size={44} color="rgba(255,255,255,0.4)" />
          </View>
        )}
        <View style={styles.darkOverlay} />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.71)']}
          locations={[0.19, 0.95]}
          style={styles.gradient}
        />
        <View style={styles.cardContent}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="progress-clock" size={20} color={colors.white} />
            <Text style={styles.badgeText}>{doneCount}/{item.tareas.length}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTipo}>{item.tipo.toUpperCase()}</Text>
            <Text style={styles.cardTitulo} numberOfLines={1}>{item.titulo}</Text>
            <View style={styles.cardMeta}>
              <Ionicons name="calendar-outline" size={20} color={colors.white} />
              <Text style={styles.cardDate}>{formatDate(item.fecha)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={32} color={colors.neutral1300} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={e => e.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />

      <DeleteConfirmation
        visible={!!deleteTarget}
        title="Eliminar evento"
        message="¿Seguro que querés eliminar este evento? Se borrarán también sus tareas."
        onDelete={() => { if (deleteTarget) deleteEvent(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '600', color: colors.neutral1300, lineHeight: 32 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
  card: {
    height: 243,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.neutral1300,
    position: 'relative',
  },
  cardImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  cardPlaceholder: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  darkOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  gradient: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 168,
  },
  cardContent: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    padding: 24,
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-end',
  },
  badgeText: { fontSize: 14, fontWeight: '500', color: colors.white, lineHeight: 20 },
  cardInfo: {
    gap: 4,
  },
  cardTipo: {
    fontSize: 12, fontWeight: '500', color: colors.white, lineHeight: 18,
  },
  cardTitulo: { fontSize: 16, fontWeight: '600', color: colors.white, lineHeight: 24 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDate: { fontSize: 14, fontWeight: '500', color: colors.white, lineHeight: 20 },
});
