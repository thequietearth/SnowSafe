import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NAVY = '#0B1629';
const RED = '#DC2626';
const RED_PRESSED = '#B91C1C';
const SECONDARY = '#1E3A5F';
const SECONDARY_PRESSED = '#162D4A';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SnowSafe</Text>
        <Text style={styles.tagline}>Post-Crash Head Impact Assistant</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && { backgroundColor: RED_PRESSED },
          ]}
          onPress={() => {}}
        >
          <Text style={styles.primaryButtonText}>START TRIAGE</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && { backgroundColor: SECONDARY_PRESSED },
          ]}
          onPress={() => {}}
        >
          <Text style={styles.secondaryButtonText}>View Recovery Log</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          This app is a decision support tool, not a medical diagnosis. Always
          consult a medical professional.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
    paddingHorizontal: 24,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: RED,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  secondaryButton: {
    backgroundColor: SECONDARY,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
