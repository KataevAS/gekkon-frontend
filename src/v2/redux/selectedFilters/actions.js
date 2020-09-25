import { validateFilters } from '@/v2/utils/filters';

export const acts = {
  SET_DEFAULT_SELECTED_FILTERS_V2: 'SET_DEFAULT_SELECTED_FILTERS_V2',
  SET_ALL_SELECTED_FILTERS_V2: 'SET_ALL_SELECTED_FILTERS_V2',
};

export const setDefaultSelectedFilters = (spotId, sectorIds) => ({
  type: acts.SET_DEFAULT_SELECTED_FILTERS_V2,
  spotId,
  sectorIds,
});

export const setAllSelectedFilters = (spotId, sectorId, filters) => ({
  type: acts.SET_ALL_SELECTED_FILTERS_V2,
  spotId,
  sectorId,
  filters: validateFilters(filters),
});
