import { StyleSheet, Text, View } from 'react-native';

import { TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';
import { TIER_INFO } from '@/lib/tierInfo';
import { TRIAGE_QUESTIONS } from '@/lib/triageQuestions';
import type { TriageSession } from '@/lib/types';

interface TriageSessionSummaryProps {
  session: TriageSession;
}

export function TriageSessionSummary({ session }: TriageSessionSummaryProps) {
  const tierInfo = TIER_INFO[session.outcomeTier];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.banner,
          { backgroundColor: tierInfo.mutedColor, borderColor: tierInfo.color },
        ]}
      >
        <Text style={[styles.bannerLabel, { color: tierInfo.color }]}>{tierInfo.label}</Text>
        <Text style={styles.bannerDescription}>{tierInfo.description}</Text>
      </View>

      {session.outcomeReasons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why</Text>
          {session.outcomeReasons.map((reason) => (
            <Text key={reason} style={styles.reasonText}>
              • {reason}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Answers</Text>
        {session.answers.map((answer) => {
          const question = TRIAGE_QUESTIONS.find((q) => q.id === answer.questionId);
          const option = question?.options.find((o) => o.value === answer.optionValue);
          if (!question || !option) return null;
          return (
            <View key={answer.questionId} style={styles.answerRow}>
              <Text style={styles.answerQuestion}>{question.prompt}</Text>
              <Text style={styles.answerValue}>{option.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  banner: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    gap: 8,
  },
  bannerLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerDescription: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reasonText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },
  answerRow: {
    gap: 2,
  },
  answerQuestion: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  answerValue: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    fontWeight: '600',
  },
});
