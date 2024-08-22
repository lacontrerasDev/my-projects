import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import { TimerState } from "../reducer/timerReducer";
import rootReducer, { RootActionType } from "../reducer/rootReducer";
import { GameState } from "../reducer/gameReducer";
import { FormState } from "../reducer/formReducer";
import { AuthState } from "../reducer/authReducer";

type StateType = {
  timer: TimerState;
  game: GameState;
  form: FormState;
  auth: AuthState;
};

type AppCtxType = [StateType, Dispatch<RootActionType>];

const appCtx = createContext<AppCtxType | null>(null);

const initialState: StateType = {
  timer: { currentTime: 2, isRunning: false },
  game: {
    errors: 0,
    totalTime: null,
    finished: false,
    input: [],
    textArray: [],
    correctChars: [],
    currentIdx: 0,
    stats: [],
    finishTime: null,
    startTime: null,
    isBackSpace: false,
  },
  form: {
    data: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
    errors: {
      email: null,
      password: null,
      username: null,
      confirmPassword: null,
    },
  },
  auth: {
    error: null,
    isAuthenticated: false,
    user: null,
  },
};

const useAppCtx = (): AppCtxType => {
  return useContext(appCtx)!;
};

export const Provider = ({ children }: PropsWithChildren) => {
  const [state, dispatchState] = useReducer(rootReducer, initialState);

  const ctxValue: AppCtxType | null = [state, dispatchState];

  return <appCtx.Provider value={ctxValue}>{children}</appCtx.Provider>;
};

export default useAppCtx;
