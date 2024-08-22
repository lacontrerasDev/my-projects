import { addData } from "../services/db/indexedDb";

export type UserType = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: UserType | null;
  error: string | null;
};

export enum AuthActions {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_SUCCESS_CU = "LOGIN_SUCCESS_CU",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
}

export type AuthActionType =
  | { type: AuthActions.LOGIN_SUCCESS; payload: UserType }
  | { type: AuthActions.LOGIN_SUCCESS_CU; payload: UserType }
  | { type: AuthActions.LOGIN_FAILURE; payload: string }
  | { type: AuthActions.LOGOUT; payload?: null };

const authReducer = (state: AuthState, action: AuthActionType) => {
  const { type, payload } = action;

  switch (type) {
    case AuthActions.LOGIN_SUCCESS: {
      console.log("success login");
      addData("currentUser", payload);
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        error: null,
      };
    }

    case AuthActions.LOGIN_SUCCESS_CU: {
      console.log("success login with cu");
      //   addData("currentUser", payload);
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        error: null,
      };
    }

    case AuthActions.LOGIN_FAILURE: {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: payload,
      };
    }

    case AuthActions.LOGOUT: {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    }

    default:
      return state;
  }
};

export default authReducer;
