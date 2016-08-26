import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';

// Reducer imports
import auth from './auth';
import currentUser from './user';
import info from './info';
import gameState from './state';
import room from './room';
import vrSetting from './vrSetting';
import socketID from './socketID';

const rootReducer = combineReducers({
  auth,
  currentUser,
  info,
  gameState,
  room,
  vrSetting,
  socketID
});

export default rootReducer;