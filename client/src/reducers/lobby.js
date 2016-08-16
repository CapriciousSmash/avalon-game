import { LOBBY_ROOM } from '../actions/actionTypes';

const initialState = {
  active: LOBBY_ROOM
}

export default function info(state = initialState, action) {
  switch (action.type) {
    case LOBBY:
      return {
        ...state,
        lobby: action.number
      };
    default: 
      return state;
  }
}