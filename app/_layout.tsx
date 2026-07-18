import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SurveyProvider } from '../context/SurveyContext';
import { Colors } from '../constants/Colors';

export const unstable_settings = {
  anchor: '(drawer)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SurveyProvider>
        <ThemeProvider value={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: Colors.background,
            primary: Colors.primary,
          }
        }}>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="survey-preview" options={{ presentation: 'modal', title: 'Survey Preview' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SurveyProvider>
    </GestureHandlerRootView>
  );
}
