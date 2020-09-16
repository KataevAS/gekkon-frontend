import * as R from 'ramda';

export const getSpotKind = (spot) => {
  if (!spot) {
    return undefined;
  }
  const isSport = R.contains('sport', spot.kinds);
  const isBoulder = R.contains('boulder', spot.kinds);
  if (isSport) {
    if (isBoulder) {
      return 'Болдер, веревка';
    }
    return 'Веревка';
  }
  return 'Болдер';
};
