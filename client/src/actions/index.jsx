import { CHANGE_INFO } from './actionTypes';

// Action Creators for Game Info page: 
export function newInfoSection(pageName = 'GETTING STARTED') {
  return {
  	type: CHANGE_INFO,
  	activeSection: pageName
  };
}
