import thunk from 'redux-thunk';
import createRootReducer from './rootReducer';
import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';

import type { Store } from 'redux';
import type { History } from 'history';
import type { RootState } from './index';

const configureStore = (
  history: History,
  initialState?: any
): Store<RootState> => {
  const composeEnhancer: typeof compose =
    (window as any)?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancer(
      applyMiddleware(thunk, routerMiddleware(history))
    )
  );

  return store;
};

export default configureStore;