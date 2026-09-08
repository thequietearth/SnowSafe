import * as Crypto from 'expo-crypto';
import { router, Stack } from 'expo-router';
import { useEffect, useReducer, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { RED, TEXT_MUTED, TEXT_PRIMARY } from '@/constants/colors';
import { computeOutcome } from '@/lib/triageLogic';
import { TRIAGE_QUESTIONS } from '@/lib/triageQuestions';
import { saveSession } from '@/lib/storage';
import type { TriageAnswer, TriageSession } from '@/lib/types';

const TOTAL = TRIAGE_QUESTIONS.length;

interface WizardState {
  index: number;
  answers: TriageAnswer[];
}

type WizardAction =
  | { type: 'ANSWER'; questionId: string; optionValue: string }
  | { type: 'BACK' };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'ANSWER': {
      const answers = state.answers.filter((a) => a.questionId !== action.questionId);
      answers.push({ questionId: action.questionId, optionValue: action.optionValue });
      return { index: state.index + 1, answers };
    }
    case 'BACK':
      return { ...state, index: Math.max(0, state.index - 1) };
    default:
      return state;
  }
}

export default function TriageScreen() {
  const [state, dispatch] = useReducer(wizardReducer, { index: 0, answers: [] });
  const [saving, setSaving] = useState(false);
  const isComplete = state.index >= TOTAL;

  useEffect(() => {
    if (!isComplete || saving) return;
    setSaving(true);

    (async () => {
      const outcome = computeOutcome(state.answers);
      const session: TriageSession = {
        id: Crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        answers: state.answers,
        outcomeTier: outcome.tier,
        outcomeReasons: outcome.reasons,
      };
      await saveSession(session);
      router.replace(`/results?id=${session.id}`);
    })();
  }, [isComplete, saving, state.answers]);

  if (isComplete) {
    return (
      <ScreenContainer style={styles.center}>
        <Stack.Screen options={{ headerTitle: 'Finishing up' }} />
        <ActivityIndicator size="large" color={TEXT_PRIMARY} />
      </ScreenContainer>
    );
  }

  const question = TRIAGE_QUESTIONS[state.index];
  const selectedValue = state.answers.find((a) => a.questionId === question.id)?.optionValue;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerTitle: `Question ${state.index + 1} of ${TOTAL}` }} />

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(state.index / TOTAL) * 100}%` }]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.prompt}>{question.prompt}</Text>
        {question.helpText ? <Text style={styles.helpText}>{question.helpText}</Text> : null}

        <View style={styles.options}>
          {question.options.map((option) => (
            <Button
              key={option.value}
              label={option.label}
              variant={selectedValue === option.value ? 'primary' : 'secondary'}
              selected={selectedValue === option.value}
              onPress={() =>
                dispatch({ type: 'ANSWER', questionId: question.id, optionValue: option.value })
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {state.index > 0 && (
          <Pressable onPress={() => dispatch({ type: 'BACK' })} hitSlop={12}>
            <Text style={styles.backLink}>Back</Text>
          </Pressable>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E3A5F',
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: RED,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  prompt: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    lineHeight: 32,
  },
  helpText: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  options: {
    gap: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    minHeight: 60,
    justifyContent: 'center',
  },
  backLink: {
    color: TEXT_MUTED,
    fontSize: 16,
    fontWeight: '600',
  },
});
