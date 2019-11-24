import { UserLocal, LOGIN, LOGOUT, UserActionTypes } from './types';

// TypeScript infers that this function is returning SendMessageAction
export function loginUser(user: UserLocal): UserActionTypes {
  return {
    type: LOGIN,
    payload: user
  };
}

// TypeScript infers that this function is returning DeleteMessageAction
export function logoutUser(): UserActionTypes {
  return {
    type: LOGOUT
  };
}
