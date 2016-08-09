import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';

// Reducer imports
import AuthReducer from './auth';
import info from './info';

const rootReducer = combineReducers({
  auth: AuthReducer,
  info: info
});

export default rootReducer;