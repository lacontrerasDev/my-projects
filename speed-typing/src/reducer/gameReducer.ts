import { addData } from "../services/db/indexedDb";
// import { v4 as uuidv4 } from "uuid";
export type StatsType = {
  date: number;
  id: string;
  username: string;
  errors: number;
  accurateWords?: number;
  wpm: number;
  accuracy: number;
  time: number;
};

export type GameState = {
  errors: number;
  totalTime: number | null;
  startTime: number | null;
  finishTime: number | null;
  textArray: string[];
  input: string[];
  correctChars: boolean[];
  currentIdx: number;
  finished: boolean;
  stats: StatsType[];
  isBackSpace: boolean;
};

export type FinishPayload = {
  id: string;
  username: string;
  errors?: number | null;
  time?: number | null;
};

export enum GameAction {
  SET_GAME = "SET_GAME",
  ADD_NEW_INPUT = "ADD_NEW_INPUT",
  START_GAME = "START_GAME",
  FINISH_GAME = "FINISH_GAME",
  RESET_GAME = "RESET_GAME",
  BACK_SPACE = "BACK_SPACE",
  TOGGLE_BACKSPACE = "TOGGLE_BACKSPACE",
  SET_BACKSPACE = "SET_BACKSPACE",
}

export type GameActionType =
  | { type: GameAction.SET_GAME; payload: string }
  | { type: GameAction.ADD_NEW_INPUT; payload: string }
  | { type: GameAction.START_GAME; payload?: number }
  | { type: GameAction.FINISH_GAME; payload: FinishPayload }
  | { type: GameAction.RESET_GAME; payload: null }
  | { type: GameAction.BACK_SPACE; payload?: null }
  | { type: GameAction.TOGGLE_BACKSPACE; payload?: null }
  | { type: GameAction.SET_BACKSPACE; payload: boolean };

const gameReducer = (state: GameState, action: GameActionType) => {
  const { type, payload } = action;

  switch (type) {
    case GameAction.START_GAME: {
      return {
        ...state,
        startTime: Date.now(),
        totalTime: payload || null,
      };
    }

    case GameAction.SET_GAME: {
      return {
        ...state,
        errors: 0,
        textArray: [...payload.split("")],
        finished: false,
        input: [],
        correctChars: [],
        currentIdx: 0,
      };
    }

    case GameAction.ADD_NEW_INPUT: {
      const isCorrect =
        state.textArray[state.currentIdx] === payload[state.currentIdx];
      return {
        ...state,
        input: [...payload],
        correctChars: [...state.correctChars, isCorrect],
        currentIdx: Math.min(state.currentIdx + 1, state.textArray.length - 1),
      };
    }

    case GameAction.BACK_SPACE: {
      const newInput = state.input.slice(0, -1);
      const currentCharacter = state.input[state.input.length - 1];
      const expectedCharacter = state.textArray[state.input.length - 1];
      const isError = currentCharacter !== expectedCharacter;

      return {
        ...state,
        input: newInput,
        currentIdx: Math.max(state.currentIdx - 1, 0),
        errors: isError ? state.errors + 1 : state.errors,
      };
    }

    case GameAction.FINISH_GAME: {
      const finishTime = Date.now();
      const typed = state.input.join("").trim();
      const typedWords = typed.split(" ");
      const modText = [...state.textArray]
        .join("")
        .replace(/(\r\n|\n|\r)/g, " ")
        .split("");

      const text = modText.slice(0, typed.length).join("");

      let words;
      if (state.textArray[typed.length] !== " ") {
        const completeWordsIdx = modText.indexOf(" ", typed.length);
        if (completeWordsIdx > 0) {
          const completeWords = modText.slice(0, completeWordsIdx).join("");
          words = completeWords.split(" ");
        } else words = text.split(" ");
      } else {
        words = text.split(" ");
      }

      let accurateWords = 0;
      let correctCharacters = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === text[i]) {
          correctCharacters++;
        }
      }

      for (let i = 0; i < words.length; i++) {
        if (words[i] === typedWords[i]) {
          accurateWords++;
        }
      }

      const accuracy =
        typed.length > 0
          ? Number(
              ((correctCharacters - state.errors) / text.length) * 100
            ).toFixed(2)
          : 0;

      console.log(payload.time);
      const time = payload.time
        ? payload.time / 60
        : (finishTime - +state.startTime!) / 60000;
      const wpm = typed.length / 5 / time;

      const stats: StatsType = {
        date: finishTime,
        username: payload.username,
        time: state.totalTime ? state.totalTime : payload.time!,
        id: payload.id!,
        accuracy: +accuracy,
        errors: Math.max(state.errors, text.length - correctCharacters),
        wpm: +Number(wpm).toFixed(2),
        accurateWords: +Number((accurateWords / words.length) * 100).toFixed(2),
      };

      addData("stats", stats);
      return {
        ...state,
        finished: true,
        stats: [...state.stats, stats],
        finishTime,
      };
    }

    case GameAction.RESET_GAME: {
      return {
        ...state,
        input: [],
        currentIdx: 0,
        finished: false,
      };
    }

    case GameAction.TOGGLE_BACKSPACE: {
      return {
        ...state,
        isBackSpace: !state.isBackSpace,
      };
    }

    case GameAction.SET_BACKSPACE: {
      return {
        ...state,
        isBackSpace: payload,
      };
    }

    default:
      return state;
  }
};

export default gameReducer;
