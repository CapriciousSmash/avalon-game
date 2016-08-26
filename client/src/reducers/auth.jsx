import { LOGGED_IN, LOGGED_OUT } from '../actions/actionTypes';

const initialState = {
  authenticated: false,
};

export default function auth (state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        authenticated: true
      };
    case LOGGED_OUT:
      return {
        ...state,
        authenticated: false,
        uid: null,
        settings: {
          username: null,
          score: null,
          games: null
        }
      };
    default:
      return state;
  }
}
