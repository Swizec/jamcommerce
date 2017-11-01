import { compose, createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import createReducer from './createReducer.js';
import { epics as addressEpics } from './features/Address/redux';
import { epics as appEpics } from './features/redux';
import { epics as authEpics } from './features/Auth/redux';
import { epics as checkoutEpics } from './features/Checkout/redux';

export default function storeFactory(
  { epicDependencies = {}, enhancer = f => f } = {},
) {
  const rootEpic = combineEpics(
    ...addressEpics,
    ...appEpics,
    ...authEpics,
    ...checkoutEpics,
  );
  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: epicDependencies,
  });
  return createStore(
    createReducer(),
    compose(applyMiddleware(epicMiddleware), enhancer),
  );
}
