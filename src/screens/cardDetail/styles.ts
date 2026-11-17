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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  imageWrapper: {
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    aspectRatio: 0.72,
  },
  image: {
    flex: 1,
  },
  imageLoaderOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 18,
  },
  meta: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  story: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
  },
});
