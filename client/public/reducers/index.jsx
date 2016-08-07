import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';

// Reducer imports
import AuthReducer from './auth';

const rootReducer = combineReducers({
  auth: AuthReducer
});

export default rootReducer;