import { LOGGED_IN, LOGGED_OUT } from './actionTypes';
import { CHANGE_INFO } from './actionTypes';
import { LOBBY } from './actionTypes';

// Action Creators for Game Info page: 
export function newInfoSection(pageName = 'GETTING STARTED') {
  return {
    type: CHANGE_INFO,
    activeSection: pageName
  };
}

// Action Creator for GameWrapper
export function setLobbyRoom(number) {
  return {
    type: LOBBY,
    lobbyNumber: number
  }
}

// Action Creator for GameWrapper
export function login(user){
  return{
    type: LOGGED_IN,
    uid: user,
    settings: {
      username: 'cat'
    }
  }
}