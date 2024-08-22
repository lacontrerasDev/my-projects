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
// import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Timer from "./Timer/Timer";
import useAppCtx from "../state";
// import { TimerAction } from "../reducer/timerReducer";
import useTextFile from "../hooks/useTextFile";
// import { GameAction } from "../reducer/gameReducer";
import GameStats from "./GameStats";
import useGameLogic from "../hooks/useGameLogic";

const DownMode = () => {
  const [state] = useAppCtx();
  const { game, timer } = state;
  useTextFile("/song.txt");
  // const textFieldRef = useRef<HTMLInputElement>(null);
  // const textRef = useRef<HTMLDivElement>(null);
  // const statsRef = useRef<HTMLInputElement>(null);
  // const [startTimer, setStartTimer] = useState(false);
  // const [openDialog, setOpenDialog] = useState(false);
  // const [isBackSpace, setIsBackspace] = useState(false);

  // const [i, setI] = useState(0);

  // const finishGame = useCallback(() => {
  //   dispatch({
  //     type: GameAction.FINISH_GAME,
  //     payload: { id: Date.now().toString(), username: auth.user!.username },
  //   });
  // }, [dispatch, auth.user]);

  // useEffect(() => {
  //   if (startTimer && !timer.isRunning) {
  //     // if (game.finished) {
  //     // dispatch({ type: GameAction.FINISH_GAME });
  //     finishGame();
  //     setStartTimer(false);
  //     setOpenDialog(true);
  //     if (textFieldRef.current) {
  //       textFieldRef.current.blur();
  //     }
  //   }
  // }, [timer]);

  // useEffect(() => {
  //   if (statsRef.current) {
  //     statsRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [statsRef.current]);

  // const handleClick = () => {
  //   textFieldRef.current && textFieldRef.current.focus();
  //   dispatch({ type: GameAction.START_GAME, payload: timer.currentTime });
  //   setStartTimer(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  //   // dispatch({ type: TimerAction.RESET_TIMER });
  // };

  // const handleUpdateTime = () => {
  //   dispatch({ type: TimerAction.INCREMENT_TIMER, payload: -1 });
  // };

  // const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   const viewportWidth = Math.floor(Math.floor(window.innerWidth * 0.7) / 16);
  //   // setI(i + 1);

  //   if (isBackSpace && game.input.length > 0) {
  //     dispatch({ type: GameAction.BACK_SPACE, payload: value });
  //     setI(Math.max(i - 1, 0));
  //     // setErrors(errors + 1);
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
  //     // textRef.current.scroll({
  //     //   left: textRef.current.scrollLeft + 16,
  //     //   behavior: "instant",
  //     // });
  //     // dispatch({ type: GameAction.ADD_NEW_INPUT, payload: value });
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
  } = useGameLogic("countDown");

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
      {/* <Typography variant="h3">Speed Typing Test</Typography> */}
      <Typography>Count Down Mode</Typography>

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
        disabled={
          timer.currentTime === 0 || startTimer || game.input.length > 0
        }
      >
        Start
      </Button>
      <Timer
        mode="countDown"
        isRunning={timer.isRunning}
        start={startTimer}
        currentTime={timer.currentTime}
        time={10}
        updateTime={handleUpdateTime}
        isPulse={false}
      />
      <Button color="error" onClick={handleReset}>
        Reset
      </Button>
      {game.finished && game.stats[game.stats.length - 1] && (
        <GameStats
          ref={statsRef}
          stats={game.stats[game.stats.length - 1]}
          isBackSpace={game.isBackSpace}
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

export default DownMode;
//TODO: refactor authentication into its own component DONE!
