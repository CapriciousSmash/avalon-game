import { CHANGE_INFO } from './actionTypes';
import { LOBBY } from './actionTypes';

// Action Creators for Game Info page: 
export function newInfoSection(pageName = 'GETTING STARTED') {
  return {
  	type: CHANGE_INFO,
  	activeSection: pageName
  };
}

// Action Creator for Lobby Room 
export function setLobbyRoom(number) {
  console.log(number);
  return {
    type: LOBBY,
    lobbyNumber: number
  }
}
