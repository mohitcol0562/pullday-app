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
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  challengeArea: {
    flex: 1,
    overflow: 'hidden',
  },
  feedback: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    zIndex: 1,
  },
  feedbackGood: {
    backgroundColor: '#EAF3DE',
  },
  feedbackBad: {
    backgroundColor: '#FCEBEB',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 16,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotFilled: {
    backgroundColor: COLORS.text,
  },
  progressLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
    marginBottom: 12,
  },
  doneTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  doneHint: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  logout: {
    position: 'absolute',
    top: 0,
    right: 20,
    paddingVertical: 4,
  },
  logoutText: {
    fontSize: 12,
    color: COLORS.danger,
  },
});
