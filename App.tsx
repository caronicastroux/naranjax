import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { EventStoreProvider } from './src/store/EventStore';
import { AppNavigator } from './src/navigation';
import { ToastView } from './src/components/ToastView';

export default function App() {
  return (
    <EventStoreProvider>
      <StatusBar style="dark" />
      <AppNavigator />
      <ToastView />
    </EventStoreProvider>
  );
}
