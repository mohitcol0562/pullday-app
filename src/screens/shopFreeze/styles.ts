import { StyleSheet } from 'react-native';

import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  freezeBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  freezeEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  owned: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 19,
  },
  priceButton: {
    marginTop: 28,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    minWidth: 220,
    alignItems: 'center',
  },
  priceButtonDisabled: {
    opacity: 0.4,
  },
  priceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
  cancelButton: {
    marginTop: 14,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  feedback: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  feedbackGood: {
    backgroundColor: '#EAF3DE',
  },
  feedbackBad: {
    backgroundColor: '#FCEBEB',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 14,
    paddingVertical: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});
