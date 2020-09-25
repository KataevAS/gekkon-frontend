import * as R from 'ramda';
import { DEFAULT_FILTERS, RESULT_FILTERS } from '@/v1/Constants/filters';

const filtersLookUp = {
  personal: 'Авторские трассы',
  outdated: 'Скрученные',
  liked: 'Понравившиеся мне',
  flash: 'Флешанул',
  red_point: 'Пролез',
  unsuccessful: 'Не пройдена',
};

const prepareFilters = filters => ({
  ...filters,
  filters: R.map(
    (e) => {
      const filter = filters[e] || R.find(R.propEq('id', e))(DEFAULT_FILTERS);
      return {
        clickable: true,
        id: e,
        selected: filter,
        text: `${filtersLookUp[e]} ${filter ? ' ✓' : ''}`,
        value: e,
      };
    },
    R.concat(R.keys(RESULT_FILTERS), ['personal', 'outdated', 'liked']),
  ),
});

export default prepareFilters;
