import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,

  // Paper,
  Select,
  SelectChangeEvent,
  // Slide,
  TextField,
  Typography,
  // Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import useAppCtx from "../../state";
import { TimerAction } from "../../reducer/timerReducer";
// import { GameAction } from "../../reducer/gameReducer";
// import * as styles from "./styles.module.css";
import Digit from "./Digit";

type TimerProps = {
  time?: number;
  currentTime: number;
  updateTime: () => void;
  start: boolean;
  isRunning?: boolean;
  mode: "countUp" | "countDown";
  stop?: boolean;
  isPulse: boolean;
};

const Timer = ({
  currentTime,
  // time,
  updateTime,
  start,
  mode,
  stop,
  isPulse,
}: // isRunning,
TimerProps) => {
  const intervalRef = useRef<number | null>(null);
  const customNumberRef = useRef<HTMLInputElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [option, setOption] = useState("");
  const [, dispatch] = useAppCtx();
  // const containerRef = useRef(null);

  useEffect(() => {
    if (option === "custom") {
      console.log(customNumberRef.current);
      customNumberRef.current && customNumberRef.current.focus();
    }
  }, [option]);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setOption(value);
    // console.log(customNumberRef.current);
    if (value !== "custom") {
      dispatch({ type: TimerAction.SET_TIMER, payload: +value });
    } else {
      console.log("custom");
      //   customNumberRef.current!.focus();
    }
  };

  useEffect(() => {
    if (start) {
      // setTest(!test);
      const condition = mode === "countDown" ? currentTime <= 0 : stop;
      intervalRef.current = setInterval(() => {
        if (condition) {
          clearInterval(intervalRef.current!);
          // dispatch({ type: GameAction.FINISH_GAME, payload: null });
        } else {
          updateTime();
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [start, currentTime]);

  const minutes = useMemo(() => Math.floor(currentTime / 60), [currentTime]);
  const seconds = useMemo(() => currentTime % 60, [currentTime]);

  const formattedTime = [
    ...minutes.toString().padStart(2, "0").split(""),
    ...seconds.toString().padStart(2, "0").split(""),
  ];
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-around"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        flexDirection="row"
        width="400px"
      >
        <Digit value={formattedTime[0]} isPulse={isPulse} />
        <Digit value={formattedTime[1]} isPulse={isPulse} />
        <Typography variant="h2">:</Typography>
        <Digit value={formattedTime[2]} isPulse={isPulse} />
        <Digit value={formattedTime[3]} isPulse={isPulse} />
        {/* </Box> */}
      </Box>
      {mode !== "countUp" && (
        <Box>
          {option !== "custom" ? (
            <FormControl sx={{ width: "200px" }} disabled={start}>
              <InputLabel id="amount-of-time">Time</InputLabel>
              <Select
                inputRef={selectRef}
                id="amount-of-time"
                value={option}
                label="Time"
                onChange={handleChange}
              >
                <MenuItem value={"Time"}>Time</MenuItem>
                <MenuItem value={30}>30 Seconds</MenuItem>
                <MenuItem value={60}>1 Minute</MenuItem>
                <MenuItem value={"custom"}>Custom</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <FormControl
              sx={{
                width: "200px",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
            >
              <TextField
                disabled={start}
                name=""
                id="amount-of-time"
                type="number"
                inputRef={customNumberRef}
                label="Time in seconds (max 200s)"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
                inputProps={{ max: 200 }}
              ></TextField>
              <Button
                disabled={start}
                variant="contained"
                size="small"
                sx={{ width: "50px", marginTop: "8px" }}
                onClick={() =>
                  dispatch({
                    type: TimerAction.SET_TIMER,
                    payload: +customNumberRef.current!.value,
                  })
                }
              >
                Set
              </Button>
              <Button
                disabled={start}
                variant="contained"
                color="secondary"
                size="small"
                sx={{ width: "50px", marginTop: "8px" }}
                onClick={() => {
                  setOption("Time");
                  // dispatch({ type: TimerAction.RESET_TIMER, payload: null });
                  // console.log(selectRef.current);
                }}
              >
                Close
              </Button>
            </FormControl>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Timer;
