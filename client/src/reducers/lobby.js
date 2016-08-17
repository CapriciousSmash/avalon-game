import { LOBBY } from '../actions/actionTypes';

const initialState = {
  active: 'LOBBY_ROOM'
};

export default function lobbyRoom(state = initialState, action) {
  switch (action.type) {
    case 'LOBBY':
      return {
        ...state,
        lobbyNumber: action.lobbyNumber 
      };
    default: 
      return {
        ...state,
        lobbyNumber: undefined
      }
  }
}