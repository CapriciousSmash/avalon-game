import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';

// Reducer imports
import auth from './auth';
import currentUser from './user';
import info from './info';
import gameState from './state';
import room from './room';

const rootReducer = combineReducers({
  auth,
  currentUser,
  info,
  gameState,
  room
});

export default rootReducer;