import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0d1117' },
          headerTintColor: '#e6edf3',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0d1117' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'JSX Viewer' }} />
        <Stack.Screen name="preview" options={{ title: 'Preview' }} />
      </Stack>
    </>
  );
}
