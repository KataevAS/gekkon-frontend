import * as R from 'ramda';
import Api from '../../utils/Api';
import toastHttpError from '@/v2/utils/toastHttpError';

export const acts = {
  LOAD_PHOTOS_REQUEST: 'LOAD_PHOTOS_REQUEST_V2',
  LOAD_PHOTOS_FAILED: 'LOAD_USER_FAILED_V2',
  LOAD_PHOTOS_SUCCESS: 'LOAD_PHOTOS_SUCCESS_V2',
  REMOVE_PHOTO_SUCCESS: 'REMOVE_PHOTO_SUCCESS_V2',
  REMOVE_PHOTOS_SUCCESS: 'REMOVE_PHOTOS_SUCCESS_V2',
};

export const loadRoutePhotos = sectorId => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_PHOTOS_REQUEST,
    });

    Api.get(
      `/v1/sectors/${sectorId}/route_photos`,
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_PHOTOS_SUCCESS,
            route_photos: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_PHOTOS_FAILED,
          });
          toastHttpError(error);
        },
      },
    );
  }
);

export const removeRoutePhoto = (id, afterSuccess) => (
  (dispatch) => {
    dispatch({ type: acts.LOAD_PHOTOS_REQUEST });

    Api.post(
      `/v1/route_photos/${id}`,
      null,
      {
        method: 'delete',
        success(payload) {
          dispatch({
            type: acts.REMOVE_PHOTO_SUCCESS,
            photoId: payload.id,
          });
          afterSuccess && afterSuccess(payload);
        },
        failed(error) {
          dispatch({ type: acts.LOAD_PHOTOS_FAILED });

          toastHttpError(error);
        },
      },
    );
  }
);

export const removeRoutePhotos = (ids, afterSuccess, afterAll) => (
  (dispatch) => {
    dispatch({ type: acts.LOAD_PHOTOS_REQUEST });

    Api.post(
      '/v1/route_photos',
      { route_photo: R.map(id => ({ id }), ids) },
      {
        method: 'delete',
        success(payload) {
          dispatch({
            type: acts.REMOVE_PHOTOS_SUCCESS,
            photoIds: ids,
          });
          afterSuccess && afterSuccess(payload);
          afterAll && afterAll();
        },
        failed(error) {
          dispatch({ type: acts.LOAD_PHOTOS_FAILED });

          toastHttpError(error);
          afterAll && afterAll();
        },
      },
    );
  }
);
