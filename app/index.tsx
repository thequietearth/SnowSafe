import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SECONDARY, TEXT_DIM, TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';

const DISCLAIMER_ACKNOWLEDGED_KEY = 'snowsafe.disclaimerAcknowledged';

export default function HomeScreen() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DISCLAIMER_ACKNOWLEDGED_KEY).then((value) => {
      if (!value) setShowDisclaimer(true);
    });
  }, []);

  function acknowledgeDisclaimer() {
    AsyncStorage.setItem(DISCLAIMER_ACKNOWLEDGED_KEY, 'true');
    setShowDisclaimer(false);
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>SnowSafe</Text>
        <Text style={styles.tagline}>Post-Crash Head Impact Assistant</Text>
      </View>

      <View style={styles.buttons}>
        <Button label="START TRIAGE" variant="primary" onPress={() => router.push('/triage')} />
        <Button label="View Recovery Log" variant="secondary" onPress={() => router.push('/log')} />
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Emergency Contacts and Resort Info"
          onPress={() => router.push('/contacts')}
          hitSlop={12}
        >
          <Text style={styles.contactsLink}>Emergency Contacts &amp; Resort Info</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          This app is a decision support tool, not a medical diagnosis. Always
          consult a medical professional.
        </Text>
      </View>

      {showDisclaimer && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Before You Start</Text>
            <Text style={styles.modalBody}>
              SnowSafe is a decision support tool, not a medical diagnosis, and does not
              replace professional medical evaluation. If this is a life-threatening
              emergency, call emergency services immediately.
            </Text>
            <Button label="I Understand" variant="primary" onPress={acknowledgeDisclaimer} />
          </View>
        </View>
      )}
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 24,
    zIndex: 999,
    elevation: 999,
  },
  modalCard: {
    backgroundColor: SECONDARY,
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
  },
  modalBody: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    lineHeight: 22,
  },
});
