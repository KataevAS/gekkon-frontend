import { CATEGORIES } from './Categories';

export const PERSONAL_DEFAULT = false;
export const OUTDATED_DEFAULT = false;
export const LIKED_DEFAULT = false;

export const RESULT_FILTERS = {
  unsuccessful: true,
  red_point: true,
  flash: true,
};

export const DEFAULT_FILTERS = {
  categoryFrom: CATEGORIES[0],
  categoryTo: CATEGORIES[CATEGORIES.length - 1],
  period: 0,
  date: undefined,
  ...RESULT_FILTERS,
  personal: PERSONAL_DEFAULT,
  outdated: OUTDATED_DEFAULT,
  liked: LIKED_DEFAULT,
};

export const PERIOD_FILTERS = [
  { id: 0, text: 'Все время', clickable: true },
  { id: 1, text: 'День', clickable: true },
  { id: 2, text: 'Неделя', clickable: true },
  { id: 3, text: 'Месяц', clickable: true },
  { id: 4, text: 'Год', clickable: true },
];
