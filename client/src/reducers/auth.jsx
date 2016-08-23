import { LOGGED_IN, LOGGED_OUT } from '../actions/actionTypes';

const initialState = {
  authenticated: false,
  uid: null,
  username: null
};

export default function auth (state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        authenticated: true
        uid: action.uid,
        username: action.username
      };
    case LOGGED_OUT:
      return {
        ...state,
        authenticated: false,
        uid: null,
        username: null
      };
    default:
      return state;
  }
}
