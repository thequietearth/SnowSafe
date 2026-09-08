import type { PropsWithChildren } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NAVY } from '@/constants/colors';

interface ScreenContainerProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function ScreenContainer({ children, style }: ScreenContainerProps) {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
    paddingHorizontal: 24,
  },
});
