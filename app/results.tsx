import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TriageSessionSummary } from '@/components/TriageSessionSummary';
import { NAVY, TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';
import { CONTACTS } from '@/lib/contacts';
import { getSessionById } from '@/lib/storage';
import type { TriageSession } from '@/lib/types';

const EMERGENCY_CONTACT = CONTACTS[0];

export default function ResultsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [session, setSession] = useState<TriageSession | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setSession(null);
      return;
    }
    getSessionById(id).then((found) => setSession(found ?? null));
  }, [id]);

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: NAVY },
          headerTintColor: TEXT_PRIMARY,
          headerTitle: 'Results',
          headerBackTitle: 'Home',
        }}
      />

      {session === undefined && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={TEXT_PRIMARY} />
        </View>
      )}

      {session === null && (
        <View style={styles.center}>
          <Text style={styles.notFound}>We couldn’t find that triage result.</Text>
          <Button label="Back to Home" variant="secondary" onPress={() => router.replace('/')} />
        </View>
      )}

      {session && (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TriageSessionSummary session={session} />
          </ScrollView>
          <View style={styles.actions}>
            {session.outcomeTier === 'EMERGENCY' && (
              <Button
                label={`Call ${EMERGENCY_CONTACT.phoneNumber}`}
                variant="danger"
                onPress={() => Linking.openURL(`tel:${EMERGENCY_CONTACT.phoneNumber}`)}
              />
            )}
            <Button label="Back to Home" variant="secondary" onPress={() => router.replace('/')} />
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  notFound: {
    fontSize: 16,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
  scrollContent: {
    paddingVertical: 20,
  },
  actions: {
    gap: 16,
    paddingBottom: 16,
  },
});
