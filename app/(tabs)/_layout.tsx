import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import db from '../db';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.colors.success,
          height: 100
        },
        headerTitleContainerStyle: {
          marginTop: 10,
        },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: 'bold',
          color: '#ffffff',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000',
        },
        tabBarActiveBackgroundColor: Colors.colors.success,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true)
      }}>

      <Tabs.Screen
        name="Clientes"
        options={{
          title: 'Pessoas',
          headerTitleAlign:'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="vcard-o" color={color} />,
          
        }}
      />

      <Tabs.Screen
        name="Produtos"
        options={{
          title: 'Produtos',
          headerTitleAlign:'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-basket" color={color} />,
        }}
      />

      <Tabs.Screen
        name="Contas"
        options={{
          title: 'Contas',
          headerTitleAlign:'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} />,
        }}
      />

      <Tabs.Screen
        name="Agenda"
        options={{
          title: 'Agenda',
          headerTitleAlign:'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />

      <Tabs.Screen
        name="Destaque"
        options={{
          title: 'Outros',
          headerTitleAlign:'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />

    </Tabs>
  );
}
