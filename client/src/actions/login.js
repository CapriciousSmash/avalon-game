import { LOGGED_IN, LOGGED_OUT } from '../actions';

export default function login(user){
  return{
    type: LOGGED_IN,
    uid: user,
    settings: {
      username: 'cat'
    }
  }
}
