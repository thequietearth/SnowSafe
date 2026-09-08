import { Stack } from 'expo-router';

import { NAVY, TEXT_PRIMARY } from '@/constants/colors';

export default function TriageLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: NAVY },
        headerTintColor: TEXT_PRIMARY,
        headerTitle: 'Triage',
        headerBackTitle: 'Home',
      }}
    />
  );
}
