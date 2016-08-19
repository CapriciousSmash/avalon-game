import { ROOM, LOBBY } from '../actions/actionTypes';

const initialState = {
  active: LOBBY
};

export default function room(state = initialState, action) {
  switch (action.type) {
    case ROOM:
      return {
        ...state,
        roomNumber: action.roomNumber 
      };
    default: 
      return state;
  }
}