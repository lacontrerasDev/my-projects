export type TimerState = {
  currentTime: number;
  isRunning: boolean;
};

export enum TimerAction {
  INCREMENT_TIMER = "INCREMENT_TIMER",
  RESET_TIMER = "RESET_TIMER",
  SET_TIMER = "SET_TIMER",
}

export type TimerActionType =
  | { type: TimerAction.INCREMENT_TIMER; payload: number }
  | { type: TimerAction.RESET_TIMER; payload: null }
  | { type: TimerAction.SET_TIMER; payload: number };

const timerReducer = (state: TimerState, action: TimerActionType) => {
  const { type, payload } = action;

  switch (type) {
    case TimerAction.INCREMENT_TIMER: {
      return {
        ...state,
        isRunning: state.currentTime + payload !== 0,
        currentTime: state.currentTime + payload,
      };
    }

    case TimerAction.RESET_TIMER: {
      return {
        ...state,
        isRunning: false,
        currentTime: 2,
      };
    }

    case TimerAction.SET_TIMER: {
      return {
        ...state,
        isRunning: false,
        currentTime: payload,
      };
    }

    default:
      return state;
  }
};

export default timerReducer;
