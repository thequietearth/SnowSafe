import { Stack } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { NAVY, TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';
import { CONTACTS } from '@/lib/contacts';

function callNumber(phoneNumber: string) {
  Linking.openURL(`tel:${phoneNumber}`);
}

export default function ContactsScreen() {
  return (
    <ScreenContainer>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: NAVY },
          headerTintColor: TEXT_PRIMARY,
          headerTitle: 'Emergency Contacts',
          headerBackTitle: 'Home',
        }}
      />
      <View style={styles.list}>
        {CONTACTS.map((contact) => (
          <View key={contact.label} style={styles.card}>
            <Text style={styles.cardLabel}>{contact.label}</Text>
            <Text style={styles.cardDetail}>{contact.detail}</Text>
            <Button
              label={`Call ${contact.phoneNumber}`}
              variant="danger"
              onPress={() => callNumber(contact.phoneNumber)}
              style={styles.callButton}
            />
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  card: {
    gap: 12,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
  },
  cardDetail: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  callButton: {
    marginTop: 4,
  },
});
