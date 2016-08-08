import { createStore, compose, applyMiddleware } from 'redux';
// Middleware: 
import ReduxPromise from 'redux-promise';

import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const store = createStore(
  	rootReducer,
  	initialState,
  	// Use compose() when using multiple function transformations to
  	// enhance a store -- in this case using applyMiddleware along with
  	// code to enable Redux DevTools
  	compose(
  	  applyMiddleware(ReduxPromise),
  	  // Allows use of Redux in Chrome dev tools if it has been installed
  	  window.devToolsExtension ? window.devToolsExtension() : f => f
  	)
  );

  if (module.hot) {
	// Enable Webpack hot module replacement for reducers
	module.hot.accept('../reducers', () => {
	  const nextRootReducer = require('../reducers').default;
	  store.replaceReducer(nextRootReducer);
	});
  }

  return store;
}