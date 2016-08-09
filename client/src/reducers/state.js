import { CHANGE_GAME_STATE } from '../actions/actionTypes';

export default function gameState(state = false, action){
  switch (action.type){
    case CHANGE_GAME_STATE:
      return !state;
    default:
      return state;
  }

}