import { LOGGED_IN, LOGGED_OUT } from '../actions';

export default function currentUser(state = {}, action) {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        uid: action.uid,
        settings: action.settings
      }
    default:
      return state;
  }
}