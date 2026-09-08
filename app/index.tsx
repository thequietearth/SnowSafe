import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TEXT_DIM, TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>SnowSafe</Text>
        <Text style={styles.tagline}>Post-Crash Head Impact Assistant</Text>
      </View>

      <View style={styles.buttons}>
        <Button label="START TRIAGE" variant="primary" onPress={() => router.push('/triage')} />
        <Button label="View Recovery Log" variant="secondary" onPress={() => router.push('/log')} />
        <Pressable onPress={() => router.push('/contacts')} hitSlop={12}>
          <Text style={styles.contactsLink}>Emergency Contacts &amp; Resort Info</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          This app is a decision support tool, not a medical diagnosis. Always
          consult a medical professional.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: TEXT_MUTED,
    marginTop: 8,
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  contactsLink: {
    color: TEXT_MUTED,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: TEXT_DIM,
    textAlign: 'center',
    lineHeight: 18,
  },
});
