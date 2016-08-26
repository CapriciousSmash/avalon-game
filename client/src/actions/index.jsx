import { LOGGED_IN, LOGGED_OUT } from './actionTypes';
import { CHANGE_INFO } from './actionTypes';
import { LOBBY, ROOM } from './actionTypes';

// Action Creators for Game Info page: 
export function newInfoSection(pageName = 'GETTING STARTED') {
  return {
    type: CHANGE_INFO,
    activeSection: pageName
  };
}

// Action Creator for GameWrapper
export function setGameRoom(number) {
  return {
    type: ROOM,
    roomNumber: number
  };
}

// Action Creator for GameWrapper
export function login(user){
  return{
    type: LOGGED_IN,
    uid: user.id,
    username: user.username,
    score: user.points,
    games: user.games
  };
}

export function logout(){
  return{
    type: LOGGED_OUT
  };
}

export function vrSetting(type, setting) {
  return {
    type: type,
    vrSetting: setting
  };
}