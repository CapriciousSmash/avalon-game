import { IS_VR, IS_3D } from '../actions/actionTypes';

export default function vrSetting(state = {}, action) {
  switch (action.type) {
    case IS_VR:
      return {
        ...state,
        vrSetting: action.vrSetting 
      };
    case IS_3D:
      return {
        ...state,
        vrSetting: action.vrSetting 
      };
    default: 
      return state;
  }
}