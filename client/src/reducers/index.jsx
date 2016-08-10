import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';

// Reducer imports
import auth from './auth';
import currentUser from './user';
import info from './info';
import gameState from './state';

const rootReducer = combineReducers({
  auth,
  currentUser,
  info,
  gameState
});

export default rootReducer;