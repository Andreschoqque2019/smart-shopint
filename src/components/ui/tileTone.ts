/**
 * Pastel tile tones.
 *
 * Lives apart from the `IconTile` component so that file exports only
 * components (React Fast Refresh requirement). The tone vocabulary and the
 * deterministic index helper are shared, non-visual concerns.
 */
export type TileTone = 'rose' | 'blue' | 'mint' | 'lilac'

const TONES_ORDER: TileTone[] = ['rose', 'blue', 'mint', 'lilac']

/** Picks a tone from a list index, so tiles rotate deterministically. */
export function toneForIndex(index: number): TileTone {
  return TONES_ORDER[index % TONES_ORDER.length]
}
