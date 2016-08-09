import { CHANGE_INFO } from '../actions';

const initialState = {};

// Reducer for the <Info /> component which displays information for
// the game's rules and how to get started playing
export default function info(state = initialState, action) {
  switch (action.type) {
  	case CHANGE_INFO:
  	  return {
  	  	...state,
  	  	active_info: action.activeSection
  	  };
  	default: 
  	  return state;
  }
}