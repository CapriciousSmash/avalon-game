import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';

// Reducer imports
import auth from './auth';
import currentUser from './user';
import info from './info';

const rootReducer = combineReducers({
  auth,
  currentUser,
  info: info
});

export default rootReducer;