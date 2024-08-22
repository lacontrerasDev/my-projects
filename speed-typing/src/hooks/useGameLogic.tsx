import { ChangeEvent, useEffect, useRef, useState } from "react";
import useAppCtx from "../state";
import { TimerAction } from "../reducer/timerReducer";
import { GameAction } from "../reducer/gameReducer";
import useParagraph from "./useParagraph";

const useGameLogic = (mode: "countUp" | "countDown") => {
  const textFieldRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLInputElement>(null);
  const [startTimer, setStartTimer] = useState(false);
  const [errors, setErrors] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [i, setI] = useState(0);
  const getParagraph = useParagraph(4);
  const [isBackSpace, setIsBackspace] = useState(false);

  const [state, dispatch] = useAppCtx();
  const { auth, game, timer } = state;

  useEffect(() => {
    if (mode === "countUp") {
      dispatch({ type: TimerAction.SET_TIMER, payload: 0 });
      dispatch({ type: GameAction.SET_BACKSPACE, payload: true });
    }
  }, [mode]);

  useEffect(() => {
    if (statsRef.current) {
      statsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [statsRef.current]);

  useEffect(() => {
    if (startTimer && !timer.isRunning) {
      // if (game.finished) {
      // dispatch({ type: GameAction.FINISH_GAME });
      finishGame();
      setStartTimer(false);
      setOpenDialog(true);
      if (textFieldRef.current) {
        textFieldRef.current.blur();
      }
    }
  }, [timer]);

  const finishGame = () => {
    dispatch({
      type: GameAction.FINISH_GAME,
      payload: {
        id: Date.now().toString(),
        username: auth.user!.username,
        errors: mode === "countUp" ? errors : null,
        time: mode === "countUp" ? timer.currentTime : null,
      },
    });
  };

  const handleClick = () => {
    textFieldRef.current && textFieldRef.current.focus();
    dispatch({
      type: GameAction.START_GAME,
      payload: mode === "countUp" ? null : timer.currentTime,
    });
    setStartTimer(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateTime = () => {
    dispatch({
      type: TimerAction.INCREMENT_TIMER,
      payload: mode === "countUp" ? 1 : -1,
    });
  };

  const handleReset = () => {
    if (mode === "countUp") {
      dispatch({ type: GameAction.SET_GAME, payload: getParagraph(20) });
      dispatch({ type: TimerAction.SET_TIMER, payload: 0 });
    } else {
      dispatch({ type: GameAction.RESET_GAME });
      dispatch({ type: TimerAction.RESET_TIMER });
    }
    setStartTimer(false);
    setI(0);
    if (textRef.current && textFieldRef.current) {
      textFieldRef.current.value = "";
      textRef.current.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const viewportWidth = Math.floor(Math.floor(window.innerWidth * 0.7) / 16);

    if (isBackSpace && game.input.length > 0) {
      dispatch({ type: GameAction.BACK_SPACE, payload: value });
      setI(Math.max(i - 1, 0));
      setErrors(errors + 1);
    } else {
      setI(i + 1);
      dispatch({ type: GameAction.ADD_NEW_INPUT, payload: value });
    }

    if (textRef.current) {
      if (i >= (viewportWidth - 3) * 1) {
        setI(0);

        textRef.current.scroll({
          top: textRef.current.scrollTop + 24,
          behavior: "smooth",
        });
      }
    }

    if (
      (!game.isBackSpace && game.textArray.length === value.length) ||
      (game.textArray.length === value.length &&
        game.textArray.join("") === value)
    ) {
      finishGame();
      setStartTimer(false);
      setOpenDialog(true);
      if (textFieldRef.current) {
        textFieldRef.current.blur();
      }
    }
    setIsBackspace(false);
  };

  return {
    textFieldRef,
    textRef,
    statsRef,
    startTimer,
    openDialog,
    handleClick,
    handleCloseDialog,
    handleUpdateTime,
    handleTextInputChange,
    handleReset,
    setIsBackspace,
  };
};

export default useGameLogic;
