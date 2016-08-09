import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';

// Reducer imports
import auth from './auth';
import currentUser from './user';

const rootReducer = combineReducers({
  auth,
  currentUser
});

export default rootReducer;