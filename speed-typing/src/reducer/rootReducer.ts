import authReducer, {
  AuthActions,
  AuthActionType,
  AuthState,
  UserType,
} from "./authReducer.ts";
import formReducer, {
  ErrorMessage,
  FormActions,
  FormActionType,
  FormState,
} from "./formReducer.ts";
import gameReducer, {
  FinishPayload,
  GameAction,
  GameActionType,
  GameState,
} from "./gameReducer.ts";
import timerReducer, {
  TimerAction,
  TimerActionType,
  TimerState,
} from "./timerReducer.ts";

type ActionType =
  | keyof typeof TimerAction
  | keyof typeof GameAction
  | keyof typeof FormActions
  | keyof typeof AuthActions;

export type RootActionType = {
  payload?:
    | boolean
    | number
    | null
    | string
    | string[]
    | UserType
    | FinishPayload
    | ErrorMessage;
  type: ActionType;
};

const rootReducer = (
  state: {
    timer: TimerState;
    game: GameState;
    form: FormState;
    auth: AuthState;
  },
  action: RootActionType
) => ({
  timer: timerReducer(state.timer, action as TimerActionType),
  game: gameReducer(state.game, action as GameActionType),
  form: formReducer(state.form, action as FormActionType),
  auth: authReducer(state.auth, action as AuthActionType),
});

export default rootReducer;
