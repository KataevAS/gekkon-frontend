import * as R from 'ramda';
import { acts } from './actions';


const routePhotosReducer = (
  state = {},
  action,
) => {
  switch (action.type) {
  case acts.LOAD_PHOTOS_SUCCESS:
    return {
      ...state,
      ...R.reduce((l, u) => ({ ...l, [u.id]: u }), {})(action.route_photos),
    };
  case acts.REMOVE_PHOTO_SUCCESS:
    return R.dissoc(action.photoId, state);
  case acts.REMOVE_PHOTOS_SUCCESS:
    return R.omit(action.photoIds, state);
  default:
    return state;
  }
};

export default routePhotosReducer;
