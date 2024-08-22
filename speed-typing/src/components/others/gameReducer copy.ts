export type StatsType = {
  errors: number;
  totalWords?: number;
  accurateWords?: number;
  wpm: number;
  accuracy: number;
  speed?: number;
};

export type GameState = {
  startTime: number | null;
  finishTime: number | null;
  textArray: string[];
  input: string[];
  currentIdx: number;
  finished: boolean;
  stats: StatsType[];
};

export enum GameAction {
  SET_GAME = "SET_GAME",
  ADD_NEW_INPUT = "ADD_NEW_INPUT",
  START_GAME = "START_GAME",
  FINISH_GAME = "FINISH_GAME",
  RESET_GAME = "RESET_GAME",
}

export type GameActionType =
  | { type: GameAction.SET_GAME; payload: string }
  | { type: GameAction.ADD_NEW_INPUT; payload: string }
  | { type: GameAction.START_GAME; payload?: null }
  | { type: GameAction.FINISH_GAME; payload?: null }
  | { type: GameAction.RESET_GAME; payload: null };

const gameReducer = (state: GameState, action: GameActionType) => {
  const { type, payload } = action;

  switch (type) {
    case GameAction.START_GAME: {
      return {
        ...state,
        startTime: Date.now(),
      };
    }

    case GameAction.SET_GAME: {
      return {
        ...state,
        textArray: [..." ".repeat(10).split(""), ...payload.split("")],
        finished: false,
        input: [..." ".repeat(10).split("")],
        currentIdx: 10,
      };
    }

    case GameAction.ADD_NEW_INPUT: {
      return {
        ...state,
        input: [..." ".repeat(10).split(""), ...payload],
        currentIdx: state.currentIdx + 1,
      };
    }

    case GameAction.FINISH_GAME: {
      const typed = state.input.join("").trim();
      const typedWords = typed.split(" ");
      const text = state.textArray.slice(10, typed.length + 10).join("");
      let words;

      if (state.textArray[typed.length + 10] !== "") {
        const completeWordsIdx = state.textArray.indexOf(
          " ",
          typed.length + 10
        );
        const completeWords = state.textArray
          .slice(10, completeWordsIdx)
          .join("");
        words = completeWords.split(" ");
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
          ? Number((correctCharacters / text.length) * 100).toFixed(2)
          : 0;

      const finishTime = Date.now();

      const time = (finishTime - +state.startTime!) / 60000;
      const wpm = typed.length / 5 / time;
      console.log(accurateWords);
      const stats: StatsType = {
        accuracy: +accuracy,
        errors: text.length - correctCharacters,
        wpm: +Number(wpm).toFixed(2),
        accurateWords: +Number((accurateWords / words.length) * 100).toFixed(2),
      };
      console.log(typed, text);
      console.log((finishTime - +state.startTime!) / 1000);
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
        currentIdx: 10,
        finished: false,
      };
    }

    default:
      return state;
  }
};

export default gameReducer;
