import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { RED, RED_PRESSED, SECONDARY, SECONDARY_PRESSED, TEXT_PRIMARY } from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
}

const VARIANT_COLORS: Record<ButtonVariant, { background: string; pressed: string }> = {
  primary: { background: RED, pressed: RED_PRESSED },
  danger: { background: RED, pressed: RED_PRESSED },
  secondary: { background: SECONDARY, pressed: SECONDARY_PRESSED },
};

export function Button({ label, onPress, variant = 'primary', style, selected }: ButtonProps) {
  const colors = VARIANT_COLORS[variant];
  const isPrimary = variant === 'primary' || variant === 'danger';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={selected === undefined ? undefined : { selected }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.background },
        pressed && { backgroundColor: colors.pressed },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={isPrimary ? styles.primaryLabel : styles.secondaryLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    paddingHorizontal: 24,
  },
  primaryLabel: {
    color: TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  secondaryLabel: {
    color: TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: '600',
  },
});
