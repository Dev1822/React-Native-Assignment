import { Drawer } from 'expo-router/drawer';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.surface,
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.textMuted,
        drawerStyle: {
          backgroundColor: Colors.background,
          paddingTop: 20,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="camera"
        options={{
          drawerLabel: 'Camera',
          title: 'Camera Module',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="location"
        options={{
          drawerLabel: 'Location',
          title: 'Location Module',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="contacts"
        options={{
          drawerLabel: 'Contacts',
          title: 'Contacts Module',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="clipboard"
        options={{
          drawerLabel: 'Clipboard',
          title: 'Clipboard Module',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
