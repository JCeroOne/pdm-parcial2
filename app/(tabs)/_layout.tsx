import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      {/*<Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'dark'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />*/}
      <Tabs.Screen
        name="partidas"
        options={{
          title: "Partidas",
          tabBarIcon: ({color}) => <TabBarIcon name="gamepad" color={color} />
        }}
      />
      <Tabs.Screen
        name="tablaCampeones"
        options={{
          title: "Campeones",
          tabBarIcon: ({color}) => <TabBarIcon name="group" color={color} />
        }}
      />
      <Tabs.Screen
        name="usuario"
        options={{
          title: "Ajustes",
          tabBarIcon: ({color}) => <TabBarIcon name="gear" color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          headerShown: false
        }}
      />
    </Tabs>
  );
}
