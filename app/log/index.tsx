import { Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { NAVY, TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';

export default function RecoveryLogScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: NAVY },
          headerTintColor: TEXT_PRIMARY,
          headerTitle: 'Recovery Log',
          headerBackTitle: 'Home',
        }}
      />
      <Text style={styles.title}>Recovery Log</Text>
      <Text style={styles.subtitle}>Coming soon.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
  },
});
