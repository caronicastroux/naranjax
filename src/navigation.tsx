import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Event, Task } from './models/types';
import { colors } from './theme/colors';

import { HomeScreen } from './views/Home/HomeScreen';
import { EventListScreen } from './views/Events/EventListScreen';
import { EventDetailScreen } from './views/Events/EventDetailScreen';
import { EventFormScreen } from './views/Events/EventFormScreen';
import { TaskListScreen } from './views/Tasks/TaskListScreen';
import { TaskDetailScreen } from './views/Tasks/TaskDetailScreen';
import { TaskFormScreen } from './views/Tasks/TaskFormScreen';
import { PlaceholderScreen } from './views/Placeholders/PlaceholderScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  EventDetail: { eventId: string };
  EventForm: { mode: 'create' | 'edit'; event?: Event };
  TaskDetail: { taskId: string };
  TaskForm: { mode: 'create' | 'edit'; task?: Task; preselectedEventId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Eventos: 'calendar-outline',
  Tareas: 'list-outline',
  Cuenta: 'person-outline',
};

function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [showChoice, setShowChoice] = useState(false);

  return (
    <>
      <View style={glassStyles.wrapper}>
        {/* Tab buttons pill */}
        <View style={glassStyles.tabsPill}>
          {Platform.OS === 'web' ? (
            <View style={glassStyles.tabsPillBg} />
          ) : (
            <BlurView intensity={40} tint="light" style={glassStyles.tabsPillBlur} />
          )}
          <View style={glassStyles.tabsPillFill} />

          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const iconName = TAB_ICONS[route.name];
            if (!iconName) return null;

            return (
              <TouchableOpacity
                key={route.key}
                style={glassStyles.tab}
                activeOpacity={0.7}
                onPress={() => {
                  if (!isFocused) {
                    navigation.navigate(route.name);
                  }
                }}
              >
                {isFocused && <View style={glassStyles.activeIndicator} />}
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? colors.brand700 : colors.neutral1300}
                />
                <Text
                  style={[
                    glassStyles.tabLabel,
                    { color: isFocused ? colors.brand700 : colors.neutral1300 },
                  ]}
                >
                  {route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* + button pill */}
        <TouchableOpacity
          style={glassStyles.addPill}
          activeOpacity={0.7}
          onPress={() => setShowChoice(true)}
        >
          {Platform.OS === 'web' ? (
            <View style={glassStyles.addPillBg} />
          ) : (
            <BlurView intensity={40} tint="light" style={glassStyles.addPillBlur} />
          )}
          <View style={glassStyles.addPillFill} />
          <Ionicons name="add" size={24} color={colors.neutral1300} />
        </TouchableOpacity>
      </View>

      <Modal visible={showChoice} transparent animationType="fade">
        <Pressable style={glassStyles.overlay} onPress={() => setShowChoice(false)}>
          <View style={glassStyles.sheet}>
            <Text style={glassStyles.sheetTitle}>¿Qué querés crear?</Text>
            <TouchableOpacity
              style={glassStyles.option}
              onPress={() => {
                setShowChoice(false);
                (globalThis as any).__navRef?.navigate('EventForm', { mode: 'create' });
              }}
            >
              <Ionicons name="calendar" size={22} color={colors.brand700} />
              <Text style={glassStyles.optionText}>Nuevo evento</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={glassStyles.option}
              onPress={() => {
                setShowChoice(false);
                (globalThis as any).__navRef?.navigate('TaskForm', { mode: 'create' });
              }}
            >
              <Ionicons name="checkmark-circle" size={22} color={colors.brand700} />
              <Text style={glassStyles.optionText}>Nueva tarea</Text>
            </TouchableOpacity>
            <TouchableOpacity style={glassStyles.cancelBtn} onPress={() => setShowChoice(false)}>
              <Text style={glassStyles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Eventos" component={EventListScreen} />
      <Tab.Screen name="Tareas" component={TaskListScreen} />
      <Tab.Screen name="Cuenta">
        {() => <PlaceholderScreen title="Cuenta" icon="person-outline" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const linking = {
  prefixes: ['https://naranjax.caronicastro.com', 'http://localhost:8082'],
  config: {
    screens: {
      MainTabs: {
        screens: { Home: '', Eventos: 'eventos', Tareas: 'tareas', Cuenta: 'cuenta' },
      },
      EventDetail: 'event/:eventId',
      EventForm: {
        path: 'event-form',
        parse: { mode: (m: string) => m || 'create' },
      },
      TaskDetail: 'task/:taskId',
      TaskForm: 'task-form',
    },
  },
};

export function AppNavigator() {
  const navRef = React.useRef<any>(null);

  React.useEffect(() => {
    (globalThis as any).__navRef = navRef.current;
  });

  return (
    <NavigationContainer ref={navRef} linking={linking as any}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: 'Atrás',
          headerTintColor: colors.brand700,
          headerStyle: { backgroundColor: colors.white },
          contentStyle: { backgroundColor: colors.white },
        }}
      >
        <Stack.Screen name="MainTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventForm"
          component={EventFormScreen}
          options={{
            headerShown: false,
            presentation: 'formSheet',
            sheetGrabberVisible: false,
            contentStyle: { backgroundColor: colors.cardBg },
          }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={{
            headerShown: false,
            presentation: 'formSheet',
            sheetGrabberVisible: false,
            contentStyle: { backgroundColor: colors.cardBg },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const glassStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'web' ? 16 : 34,
  },
  tabsPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 1000,
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 }
    ),
  } as any,
  tabsPillBlur: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  tabsPillBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
  } as any,
  tabsPillFill: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 1000,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 100,
  },
  activeIndicator: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#F5F5F4',
    borderRadius: 100,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'center',
  },
  addPill: {
    width: 58,
    height: 58,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 }
    ),
  } as any,
  addPillBlur: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  addPillBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
  } as any,
  addPillFill: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 1000,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: 14, borderTopRightRadius: 14,
    paddingTop: 20, paddingBottom: 34, paddingHorizontal: 20,
  },
  sheetTitle: { fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 16, color: colors.label },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.separator,
  },
  optionText: { fontSize: 17, color: colors.label },
  cancelBtn: {
    marginTop: 12, backgroundColor: colors.cardBg, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelText: { fontSize: 17, color: colors.brand700, fontWeight: '600' },
});
