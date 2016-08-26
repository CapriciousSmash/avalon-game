import { LOGGED_IN, LOGGED_OUT } from '../actions/actionTypes';

const initialState = {
  uid: null,
  settings: {
    username: null,
    score: null,
    games: null
  }
}

export default function currentUser(state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        uid: action.uid,
        settings: {
          username: action.settings.username,
          score: action.settings.score,
          games: action.settings.games
        }
      }
    default:
      return state;
  }
}