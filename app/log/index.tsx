import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { NAVY, TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';
import { getAllSessions, hasUnreadableSessions } from '@/lib/storage';
import { TIER_INFO } from '@/lib/tierInfo';
import type { TriageSession } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export default function RecoveryLogScreen() {
  const [sessions, setSessions] = useState<TriageSession[] | null | undefined>(undefined);
  const [hasUnreadable, setHasUnreadable] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const found = await getAllSessions();
          setHasUnreadable(await hasUnreadableSessions());
          setSessions(found);
        } catch {
          setSessions(null);
        }
      })();
    }, [])
  );

  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: NAVY },
          headerTintColor: TEXT_PRIMARY,
          headerTitle: 'Recovery Log',
          headerBackTitle: 'Home',
        }}
      />

      {hasUnreadable && (
        <Text style={styles.unreadableNotice}>
          Some earlier entries couldn’t be read and aren’t shown.
        </Text>
      )}

      {sessions === null && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>We couldn’t load your Recovery Log.</Text>
        </View>
      )}

      {sessions && sessions.length === 0 && !hasUnreadable && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No triage sessions yet.</Text>
        </View>
      )}

      {sessions && sessions.length > 0 && (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const tierInfo = TIER_INFO[item.outcomeTier];
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${formatDate(item.createdAt)}, ${tierInfo.shortLabel}`}
                style={styles.row}
                onPress={() => router.push(`/log/${item.id}`)}
              >
                <Text style={styles.rowDate}>{formatDate(item.createdAt)}</Text>
                <Text style={[styles.rowTier, { color: tierInfo.color }]}>
                  {tierInfo.shortLabel}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  unreadableNotice: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
    paddingTop: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: TEXT_MUTED,
  },
  list: {
    paddingVertical: 12,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  rowDate: {
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  rowTier: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
