import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TriageSessionSummary } from '@/components/TriageSessionSummary';
import { NAVY, SECONDARY, TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';
import { deleteSession, getSessionById, updateSessionNotes } from '@/lib/storage';
import type { TriageSession } from '@/lib/types';

export default function LogEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<TriageSession | null | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSessionById(id).then((found) => {
      setSession(found ?? null);
      setNotes(found?.notes ?? '');
    });
  }, [id]);

  async function handleSaveNotes() {
    setSaving(true);
    await updateSessionNotes(id, notes);
    setSaving(false);
  }

  function handleDelete() {
    Alert.alert('Delete this entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          await deleteSession(id);
          router.replace('/log');
        },
      },
    ]);
  }

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: NAVY },
          headerTintColor: TEXT_PRIMARY,
          headerTitle: 'Triage Entry',
          headerBackTitle: 'Log',
        }}
      />

      {session === undefined && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={TEXT_PRIMARY} />
        </View>
      )}

      {session === null && (
        <View style={styles.center}>
          <Text style={styles.notFound}>We couldn’t find that entry.</Text>
          <Button label="Back to Log" variant="secondary" onPress={() => router.replace('/log')} />
        </View>
      )}

      {session && (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TriageSessionSummary session={session} />

            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about recovery, symptoms, or follow-up..."
                placeholderTextColor={TEXT_MUTED}
                multiline
              />
              <Button label={saving ? 'Saving...' : 'Save Notes'} variant="secondary" onPress={handleSaveNotes} />
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Button
              label={deleting ? 'Deleting...' : 'Delete Entry'}
              variant="danger"
              onPress={handleDelete}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    gap: 24,
  },
  notesSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notesInput: {
    minHeight: 100,
    borderRadius: 12,
    backgroundColor: SECONDARY,
    color: TEXT_PRIMARY,
    padding: 16,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  actions: {
    paddingVertical: 16,
  },
});
