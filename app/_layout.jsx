// file: /app/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TimerProvider } from '../context/AppContext';

export default function TabLayout() {

  return (
    <TimerProvider>
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="createTimer"
        options={{
          title: 'Create Timer',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="clearState"
        options={{
          title: 'clear State',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.fill" color={color} />,
        }}
      />
    </Tabs>
    </TimerProvider>
  );
}
