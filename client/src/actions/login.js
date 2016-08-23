import { LOGGED_IN, LOGGED_OUT } from './actionTypes';

export default function login(user){
  return{
    type: LOGGED_IN,
    uid: user.id,
    username: user.username
  }
}

export default function logout(){
  return{
    type: LOGGED_OUT
  }
}
