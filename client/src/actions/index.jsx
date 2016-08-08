export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';

// Actions for Game Info page:
export const CHANGE_INFO = 'CHANGE_INFO';

// Action Creators for Game Info page: 
export function newInfoSection(pageName = 'GETTING STARTED') {
  return {
  	type: CHANGE_INFO,
  	activeSection: pageName
  };
}
