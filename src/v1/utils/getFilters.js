import * as R from 'ramda';
import { DEFAULT_FILTERS } from '../Constants/filters';
import prepareFilters from '@/v1/utils/prepareFilters';

const getFilters = (selectedFilters, spotId, sectorId) => {
  if (selectedFilters && selectedFilters[spotId] && selectedFilters[spotId][sectorId]) {
    return prepareFilters(selectedFilters[spotId][sectorId]);
  }
  return prepareFilters(DEFAULT_FILTERS);
};

export default getFilters;

export const getMergedFilters = (selectedFilters, filters, spotId, sectorId) => {
  let currentFilters = null;
  if (selectedFilters && selectedFilters[spotId] && selectedFilters[spotId][sectorId]) {
    currentFilters = selectedFilters[spotId][sectorId];
  } else {
    currentFilters = DEFAULT_FILTERS;
  }
  const mergeResult = R.mergeDeepLeft(
    filters[sectorId],
    currentFilters,
  );
  return prepareFilters(mergeResult);
};
