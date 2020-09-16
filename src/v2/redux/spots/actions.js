import Api from '../../utils/Api';
import toastHttpError from '@/v2/utils/toastHttpError';
import numToStr from '@/v1/Constants/NumToStr';
import * as R from 'ramda';
import { currentUser } from '../user_session/utils';

export const acts = {
  LOAD_SPECIFIC_SPOT_REQUEST: 'LOAD_SPECIFIC_SPOT_REQUEST_V2',
  LOAD_SPOTS_REQUEST: 'LOAD_SPOTS_REQUEST_V2',
  LOAD_SPOTS_FAILED: 'LOAD_USER_FAILED_V2',
  LOAD_SPOTS_SUCCESS: 'LOAD_SPOTS_SUCCESS_V2',
  LOAD_SPOTS: 'LOAD_SPOTS_V2',
};

export const loadSpot = spotId => (
  (dispatch, getState) => {
    dispatch({
      type: acts.LOAD_SPECIFIC_SPOT_REQUEST,
      spotId,
    });

    Api.get(
      `/v1/spots/${spotId}`,
      {
        success(payload, metadata) {
          const spot = payload;
          let infoData = [
            {
              count: metadata.num_of_sectors,
              label: numToStr(metadata.num_of_sectors, ['Зал', 'Зала', 'Залов']),
            },
            {
              count: metadata.num_of_routes,
              label: numToStr(metadata.num_of_routes, ['Трасса', 'Трассы', 'Трасс']),
            },
          ];
          const state = getState();
          if (currentUser(state)) {
            infoData = R.append({
              count: metadata.num_of_unfulfilled,
              label: numToStr(
                metadata.num_of_unfulfilled,
                ['Невыполненная трасса', 'Невыполненные трассы', 'Невыполненных трасс'],
              ),
            }, infoData);
          }
          spot.infoData = infoData;
          dispatch({
            type: acts.LOAD_SPOTS_SUCCESS,
            spot,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_SPOTS_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);

export const loadSpots = () => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_SPOTS_REQUEST,
    });

    Api.get(
      '/v1/spots',
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_SPOTS_SUCCESS,
            spots: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_SPOTS_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);
