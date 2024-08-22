import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import TextDisplay from "./TextDisplay";
// import { ChangeEvent, useEffect, useRef, useState } from "react";
import Timer from "./Timer/Timer";
import useAppCtx from "../state";
// import { TimerAction } from "../reducer/timerReducer";
// import { GameAction } from "../reducer/gameReducer";
import GameStats from "./GameStats";
import useParagraph from "../hooks/useParagraph";
import useGameLogic from "../hooks/useGameLogic";
// import { useNavigate } from "react-router-dom";
// import { AuthActions, UserType } from "../reducer/authReducer";
// import { getData } from "../services/db/indexedDb";
// import { v4 as uuidv4 } from "uuid";

// type UserTypeArr = UserType[];
const UpMode = () => {
  const [state] = useAppCtx();
  const { game, timer } = state;
  //   useTextFile("/song.txt");
  useParagraph(4);
  // const textFieldRef = useRef<HTMLInputElement>(null);
  // const textRef = useRef<HTMLDivElement>(null);
  // const statsRef = useRef<HTMLDivElement>(null);
  // const [startTimer, setStartTimer] = useState(false);
  // const [openDialog, setOpenDialog] = useState(false);
  // const [isBackSpace, setIsBackspace] = useState(false);
  // const [errors, setErrors] = useState(0);
  // const [i, setI] = useState(0);

  // useEffect(() => {
  //   dispatch({ type: TimerAction.SET_TIMER, payload: 0 });
  //   dispatch({ type: GameAction.SET_BACKSPACE, payload: true });
  // }, []);

  // useEffect(() => {
  //   if (statsRef.current) {
  //     statsRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [statsRef.current]);

  // const finishGame = () => {
  //   dispatch({
  //     type: GameAction.FINISH_GAME,
  //     payload: {
  //       id: Date.now().toString(),
  //       username: auth.user!.username,
  //       errors: errors,
  //       time: timer.currentTime,
  //     },
  //   });
  // };

  // const handleClick = () => {
  //   textFieldRef.current && textFieldRef.current.focus();
  //   dispatch({ type: GameAction.START_GAME });
  //   setStartTimer(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  // const handleUpdateTime = () => {
  //   dispatch({ type: TimerAction.INCREMENT_TIMER, payload: 1 });
  // };

  // const handleReset = () => {
  //   dispatch({ type: GameAction.SET_GAME, payload: getParagraph(20) });
  //   dispatch({ type: TimerAction.SET_TIMER, payload: 0 });
  //   setStartTimer(false);

  //   setI(0);
  //   if (textRef.current && textFieldRef.current) {
  //     textFieldRef.current.value = "";
  //     textRef.current.scroll({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  // const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   const viewportWidth = Math.floor(Math.floor(window.innerWidth * 0.7) / 16);
  //   if (isBackSpace && game.input.length > 0) {
  //     dispatch({ type: GameAction.BACK_SPACE, payload: value });
  //     setI(Math.max(i - 1, 0));
  //     setErrors(errors + 1);
  //   } else {
  //     setI(i + 1);
  //     dispatch({ type: GameAction.ADD_NEW_INPUT, payload: value });
  //   }

  //   if (textRef.current) {
  //     if (i >= (viewportWidth - 3) * 1) {
  //       setI(0);

  //       textRef.current.scroll({
  //         top: textRef.current.scrollTop + 24,
  //         behavior: "smooth",
  //       });
  //     }
  //   }
  //   if (
  //     (!game.isBackSpace && game.textArray.length === value.length) ||
  //     (game.textArray.length === value.length &&
  //       game.textArray.join("") === value)
  //   ) {
  //     finishGame();
  //     setStartTimer(false);
  //     setOpenDialog(true);
  //     if (textFieldRef.current) {
  //       textFieldRef.current.blur();
  //     }
  //   }
  //   setIsBackspace(false);
  // };
  const {
    handleClick,
    handleCloseDialog,
    handleReset,
    handleTextInputChange,
    handleUpdateTime,
    setIsBackspace,
    openDialog,
    startTimer,
    statsRef,
    textFieldRef,
    textRef,
  } = useGameLogic("countUp");

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="50%"
      width="70%"
      alignItems="center"
      gap="24px"
      mx="auto"
    >
      <Typography>Count Up Mode</Typography>
      <TextDisplay
        currentIdx={game.currentIdx}
        text={game.textArray}
        ref={textRef}
        input={game.input}
      />
      <TextField
        color="primary"
        onKeyDown={(e) => {
          if (e.nativeEvent.key === "Backspace") {
            if (game.isBackSpace) {
              setIsBackspace(true);
            } else e.preventDefault();
          }
          if (!startTimer) e.preventDefault();
          if (game.input.length >= game.textArray.length) {
            if (e.nativeEvent.key !== "Backspace") e.preventDefault();
          }
        }}
        multiline
        maxRows={5}
        fullWidth
        inputRef={textFieldRef}
        onChange={handleTextInputChange}
      />
      <Button
        variant="outlined"
        onClick={handleClick}
        disabled={timer.currentTime !== 0 || startTimer}
      >
        Start
      </Button>
      <Timer
        mode="countUp"
        isRunning={timer.isRunning}
        start={startTimer}
        currentTime={timer.currentTime}
        time={10}
        updateTime={handleUpdateTime}
        stop={game.finished}
        isPulse={true}
      />
      <Button color="error" onClick={handleReset}>
        Reset
      </Button>
      {game.finished && game.stats[game.stats.length - 1] && (
        <GameStats
          stats={game.stats[game.stats.length - 1]}
          isBackSpace={game.isBackSpace}
          ref={statsRef}
        />
      )}
      <Dialog
        // open={state.timer.currentTime <= 0 && openDialog}
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Time is up!</DialogTitle>
        <DialogContent>
          <Typography variant="h5">Game over</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpMode;
