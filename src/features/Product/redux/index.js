import _ from 'lodash';
import { createAction } from 'redux-actions';
import { createTypes, handleActions } from 'berkeleys-redux-utils';
import { createSelector } from 'reselect';

import { createCartMeta } from '../../../utils/redux';
import navigationEpic from './navigation-epic.js';

export const epics = [ navigationEpic ];
export const ns = 'product';
export const types = createTypes(
  [
    'clickOnAddToCart',
    'currentSizeChanged',
    'quantityChanged',
    'sizeChanged',
    'thumbnailClicked',
  ],
  ns,
);

export const clickOnAddToCart = createAction(
  types.clickOnAddToCart,
  _.noop,
  createCartMeta(),
);
export const quantityChanged = createAction(types.quantityChanged);
export const currentSizeChanged = createAction(types.currentSizeChanged);
export const thumbnailClicked = createAction(types.thumbnailClicked);

export const defaultState = {
  currentImage: 'front',
  currentQuantity: 1,
  currentSize: null,
};

const getNS = state => state[ns];

export const currentQuantitySelector = state => getNS(state).currentQuantity;
export const maxQuantitySelector = state => getNS(state).maxQuantity;
export const currentSizeSelector = state => getNS(state).currentSize;
export const currentImageSelector = state => getNS(state).currentImage;

export default handleActions(
  () => ({
    [types.quantityChanged]: (state, { payload }) => ({
      ...state,
      currentQuantity: payload,
    }),
    [types.currentSizeChanged]: (state, { payload }) => ({
      ...state,
      currentSize: payload,
    }),
    [types.thumbnailClicked]: (state, { payload }) => ({
      ...state,
      currentImage: payload || 'front',
    }),
  }),
  defaultState,
  ns,
);
