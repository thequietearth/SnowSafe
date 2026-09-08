import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';

export default function TriageScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Triage Questionnaire</Text>
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
