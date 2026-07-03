import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Modal, Pressable, Platform, Animated, Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp, useNavigationState } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEventStore } from '../../store/EventStore';
import { Event, EventType, EVENT_TYPES } from '../../models/types';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_ICONS: Record<EventType, keyof typeof Ionicons.glyphMap> = {
  Casamiento: 'heart',
  Cumpleaños: 'gift',
  Aniversario: 'star',
  Corporativo: 'briefcase',
};

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const WEEKDAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

function AnimatedToggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      bounciness: 2,
      speed: 16,
    }).start();
  }, [value]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(60,60,67,0.3)', '#34C759'],
  });

  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, TOGGLE_W - THUMB_W - 2],
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
      <Animated.View style={[styles.toggle, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.toggleThumb,
            { transform: [{ translateX: thumbTranslate }] },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function EventFormScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'EventForm'>>();
  const canGoBack = useNavigationState(s => s.routes.length > 1);
  const { addEvent, updateEvent } = useEventStore();

  const handleClose = () => {
    if (canGoBack) nav.goBack();
    else nav.navigate('MainTabs' as any);
  };

  const isEdit = route.params?.mode === 'edit';
  const existing = route.params?.event;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const [titulo, setTitulo] = useState(existing?.titulo ?? '');
  const [tipo, setTipo] = useState<EventType>(existing?.tipo ?? 'Casamiento');
  const [fecha, setFecha] = useState(existing?.fecha ?? todayStr);
  const [hora, setHora] = useState('14');
  const [minuto, setMinuto] = useState('00');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [dateEnabled, setDateEnabled] = useState(!!existing?.fecha);
  const [timeEnabled, setTimeEnabled] = useState(false);

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const isValid = titulo.trim().length > 0;

  const selectedDay = (() => {
    const parts = fecha.split('-');
    if (parts.length === 3 && parseInt(parts[0]) === calYear && parseInt(parts[1]) - 1 === calMonth) {
      return parseInt(parts[2]);
    }
    return null;
  })();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleDayPress = (day: number) => {
    setFecha(`${calYear}-${pad(calMonth + 1)}-${pad(day)}`);
  };

  const handleSave = () => {
    if (!isValid) return;
    const fechaFinal = dateEnabled && fecha ? fecha : todayStr;
    if (isEdit && existing) {
      updateEvent({ ...existing, titulo, tipo, fecha: fechaFinal });
      handleClose();
    } else {
      const newId = `evt-${Date.now()}`;
      const newEvent: Event = {
        id: newId,
        titulo,
        tipo,
        fecha: fechaFinal,
        imagen: imageUri ? { uri: imageUri } : undefined,
        tareas: [],
      };
      addEvent(newEvent);
      nav.reset({
        index: 1,
        routes: [
          { name: 'MainTabs' },
          { name: 'EventDetail', params: { eventId: newId } },
        ],
      });
    }
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  const weeks = getCalendarDays(calYear, calMonth);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => pad(i * 5));

  return (
    <View style={styles.container}>
      {/* Grabber */}
      <View style={styles.grabberWrap}>
        <View style={styles.grabber} />
      </View>

      {/* Header toolbar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.headerBtn}>
          <MaterialIcons name="close" size={24} color={colors.neutral1300} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Editar Evento' : 'Nuevo Evento'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!isValid}
          style={[styles.headerBtn, !isValid && styles.headerBtnDisabled]}
        >
          <MaterialIcons
            name="check"
            size={24}
            color={isValid ? colors.neutral1300 : colors.neutral300}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* GENERAL section */}
        <Text style={styles.sectionLabel}>GENERAL</Text>
        <View style={styles.card}>
          {/* Nombre evento */}
          <TextInput
            style={styles.fieldText}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Nombre evento"
            placeholderTextColor={colors.neutral300}
          />

          <View style={styles.divider} />

          {/* Categoría */}
          <TouchableOpacity
            style={styles.fieldRow}
            onPress={() => setShowTypePicker(true)}
          >
            <Text style={styles.fieldText}>
              {tipo !== existing?.tipo || tipo ? tipo : 'Categoría'}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.neutral300} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Imagen destacada */}
          <TouchableOpacity style={styles.fieldRow} onPress={pickImage}>
            <Text style={styles.fieldText}>Imagen destacada</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.neutral300} />
          </TouchableOpacity>
          {imageUri && (
            <>
              <View style={styles.divider} />
              <View style={styles.imagePreviewWrap}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                <TouchableOpacity style={styles.imageRemoveBtn} onPress={() => setImageUri(null)}>
                  <MaterialIcons name="cancel" size={24} color={colors.neutral1300} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* FECHA Y HORA section */}
        <Text style={styles.sectionLabel}>FECHA Y HORA</Text>
        <View style={styles.card}>
          {/* Fecha toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <MaterialIcons name="calendar-month" size={24} color={colors.neutral1300} />
              <View>
                <Text style={styles.fieldText}>Fecha evento</Text>
                {dateEnabled && (
                  <Text style={styles.toggleSub}>
                    {fecha === todayStr ? 'Hoy' : fecha}
                  </Text>
                )}
              </View>
            </View>
            <AnimatedToggle value={dateEnabled} onToggle={() => setDateEnabled(!dateEnabled)} />
          </View>

          {/* Inline calendar */}
          {dateEnabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.calendarWrap}>
                <View style={styles.calHeader}>
                  <Text style={styles.calMonthLabel}>
                    {MONTHS[calMonth]} {calYear}
                  </Text>
                  <View style={styles.calNav}>
                    <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn}>
                      <MaterialIcons name="chevron-left" size={20} color={colors.neutral1300} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn}>
                      <MaterialIcons name="chevron-right" size={20} color={colors.neutral1300} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.calWeekRow}>
                  {WEEKDAYS.map(w => (
                    <Text key={w} style={styles.calWeekday}>{w}</Text>
                  ))}
                </View>

                {weeks.map((week, wi) => (
                  <View key={wi} style={styles.calWeekRow}>
                    {week.map((day, di) => {
                      if (day === null) return <View key={di} style={styles.calDayCell} />;
                      const isSelected = day === selectedDay;
                      const isTodayDay = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                      return (
                        <TouchableOpacity
                          key={di}
                          style={styles.calDayCell}
                          onPress={() => handleDayPress(day)}
                          activeOpacity={0.6}
                        >
                          <View style={[
                            styles.calDayCircle,
                            isSelected && styles.calDaySelected,
                          ]}>
                            <Text style={[
                              styles.calDayText,
                              isTodayDay && !isSelected && styles.calDayToday,
                              isSelected && styles.calDayTextSelected,
                            ]}>
                              {day}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.divider} />

          {/* Hora toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <MaterialIcons name="schedule" size={24} color={colors.neutral1300} />
              <View>
                <Text style={styles.fieldText}>Hora</Text>
                {timeEnabled && (
                  <Text style={styles.toggleSub}>{hora}:{minuto}</Text>
                )}
              </View>
            </View>
            <AnimatedToggle value={timeEnabled} onToggle={() => setTimeEnabled(!timeEnabled)} />
          </View>

          {/* Inline time picker */}
          {timeEnabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.timePickerWrap}>
                <View style={styles.timePickerHighlight} />
                <ScrollView
                  style={styles.timeCol}
                  contentContainerStyle={styles.timeColContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={40}
                  decelerationRate="fast"
                >
                  {hours.map(h => (
                    <TouchableOpacity
                      key={h}
                      style={styles.timeItem}
                      onPress={() => setHora(pad(h))}
                    >
                      <Text style={[
                        styles.timeItemText,
                        pad(h) === hora && styles.timeItemTextSelected,
                      ]}>
                        {pad(h)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Text style={styles.timeSeparator}>:</Text>
                <ScrollView
                  style={styles.timeCol}
                  contentContainerStyle={styles.timeColContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={40}
                  decelerationRate="fast"
                >
                  {minutes.map(m => (
                    <TouchableOpacity
                      key={m}
                      style={styles.timeItem}
                      onPress={() => setMinuto(m)}
                    >
                      <Text style={[
                        styles.timeItemText,
                        m === minuto && styles.timeItemTextSelected,
                      ]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Category picker modal */}
      <Modal visible={showTypePicker} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowTypePicker(false)}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <Text style={styles.pickerTitle}>Categoría</Text>
            {EVENT_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={styles.pickerItem}
                onPress={() => { setTipo(t); setShowTypePicker(false); }}
              >
                <View style={styles.pickerItemLeft}>
                  <Ionicons
                    name={CATEGORY_ICONS[t]}
                    size={20}
                    color={tipo === t ? colors.brand700 : colors.neutral500}
                  />
                  <Text style={[
                    styles.pickerText,
                    tipo === t && { color: colors.brand700, fontWeight: '600' },
                  ]}>
                    {t}
                  </Text>
                </View>
                {tipo === t && (
                  <MaterialIcons name="check" size={20} color={colors.brand700} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.pickerCancel}
              onPress={() => setShowTypePicker(false)}
            >
              <Text style={styles.pickerCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const TOGGLE_W = 64;
const TOGGLE_H = 28;
const THUMB_W = 38;
const THUMB_H = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBg,
  },

  grabberWrap: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 5,
  },
  grabber: {
    width: 58,
    height: 4,
    borderRadius: 100,
    backgroundColor: '#CCCCCC',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnDisabled: {
    opacity: 0.4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral1300,
    lineHeight: 28,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 60,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral600,
    lineHeight: 18,
    marginBottom: 16,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 24,
  },

  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral1300,
    lineHeight: 24,
    flex: 1,
    padding: 0,
  },

  divider: {
    height: 0.5,
    backgroundColor: colors.neutral100,
    marginVertical: 19,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  toggleSub: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.brand700,
    lineHeight: 18,
    marginTop: 2,
  },

  toggle: {
    width: TOGGLE_W,
    height: TOGGLE_H,
    borderRadius: 100,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: 100,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  imagePreviewWrap: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarWrap: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calMonthLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.neutral1300,
  },
  calNav: {
    flexDirection: 'row',
    gap: 16,
  },
  calNavBtn: {
    padding: 4,
  },
  calWeekRow: {
    flexDirection: 'row',
  },
  calWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: colors.neutral600,
    paddingBottom: 8,
  },
  calDayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  calDayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDaySelected: {
    backgroundColor: colors.neutral1300,
  },
  calDayText: {
    fontSize: 16,
    color: colors.neutral1300,
  },
  calDayToday: {
    color: colors.brand700,
    fontWeight: '700',
  },
  calDayTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },

  timePickerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    paddingHorizontal: 40,
    position: 'relative',
  },
  timePickerHighlight: {
    position: 'absolute',
    left: 40,
    right: 40,
    height: 40,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    top: 80,
  },
  timeCol: {
    flex: 1,
    height: 200,
  },
  timeColContent: {
    paddingVertical: 80,
  },
  timeItem: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeItemText: {
    fontSize: 22,
    color: colors.neutral300,
  },
  timeItemTextSelected: {
    color: colors.neutral1300,
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.neutral1300,
    marginHorizontal: 4,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 8,
    paddingBottom: 34,
  },
  pickerHandle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D1D6',
    alignSelf: 'center',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral600,
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  pickerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerText: {
    fontSize: 17,
    color: colors.neutral1300,
  },
  pickerCancel: {
    marginTop: 8,
    marginHorizontal: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pickerCancelText: {
    fontSize: 17,
    color: colors.brand700,
    fontWeight: '600',
  },
});
