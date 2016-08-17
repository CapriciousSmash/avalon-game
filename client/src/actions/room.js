import { LOBBY } from './actionTypes';

export function setLobbyRoom(number) {
  return {
    type: LOBBY,
    lobbyNumber: number
  }
}

