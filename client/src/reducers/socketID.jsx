import { ADD_SOCKET_ID } from '../actions/actionTypes';

const initialState = {
  socketID: null
}

export default function socketID (state = initialState, action) {
  switch (action.type) {
    case ADD_SOCKET_ID:
      return {
        ...state,
        socketID: action.socketID
      }
    default:
      return state;
  }
}