import {
  UserLocal,
  LOGIN,
  LOGOUT,
  UserActionTypes
} from './types';

export const initialState: UserLocal = {
  user: null,
  token: null
};

export function userReducer(
  state = initialState,
  action: UserActionTypes
): UserLocal {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        ...action.payload
      };
    }
    case LOGOUT:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
}