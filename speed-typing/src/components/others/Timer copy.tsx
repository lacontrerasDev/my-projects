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
import { useEffect, useRef, useState } from "react";
import useAppCtx from "../../state";
import { TimerAction } from "../../reducer/timerReducer";
import { GameAction } from "../../reducer/gameReducer";
import * as styles from "./styles.module.css";

type TimerProps = {
  time?: number;
  currentTime: number;
  updateTime: () => void;
  start: boolean;
  isRunning?: boolean;
};

const Timer = ({
  currentTime,
  // time,
  updateTime,
  start,
}: // isRunning,
TimerProps) => {
  const intervalRef = useRef<number | null>(null);
  const customNumberRef = useRef<HTMLInputElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [option, setOption] = useState("");
  const [, dispatch] = useAppCtx(); //TODO: check if I can take this outside the component
  // const containerRef = useRef(null);
  const [prevTime, setPrevTime] = useState<string[]>(
    currentTime.toString().padStart(4, "0").split("")
  );
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
      intervalRef.current = setInterval(() => {
        if (currentTime <= 0) {
          clearInterval(intervalRef.current!);
          dispatch({ type: GameAction.FINISH_GAME, payload: null });
        } else {
          updateTime();
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [start, currentTime]);

  useEffect(() => {
    setPrevTime(currentTime.toString().padStart(4, "0").split(""));
  }, [currentTime]);

  const formattedTime = currentTime.toString().padStart(4, "0").split("");

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-around"
    >
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
              dispatch({ type: TimerAction.RESET_TIMER, payload: null });
              console.log(selectRef.current);
            }}
          >
            Cancel
          </Button>
        </FormControl>
      )}
      {
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="18px"
          overflow="hidden"
          flexDirection="row"
          width="400px"
        >
          <Box
            height="18px"
            // className={start && currentTime > 0 ? styles.timer : ""}
            className={start && currentTime > 0 ? styles.timer : ""}
          >
            {/* <Typography>{currentTime}</Typography> */}
            {formattedTime.map((digit, idx) => {
              if (idx < 3 && idx >= 0) {
                const newTime = [...prevTime];
                const prevVal = prevTime[idx];
                if (prevVal !== digit) {
                  newTime[idx] = digit;
                  setPrevTime(newTime); //TODO: not  here avoid
                }
                // console.log(prevVal, digit);
                return (
                  // <Paper key={idx}>
                  <Typography
                    key={idx}
                    component={"span"}
                    className={
                      digit != prevVal
                        ? `${styles.digit} ${styles[`digit${idx}`]}`
                        : styles.digit
                    }
                    // className={`${styles.digit} ${+digit !== +prevVal ? styles[`digit${idx}`] : ""}`}
                    // className={start && currentTime > 0 ? styles.timer : ""}
                  >
                    {`${digit}${idx === 1 ? ":" : ""}`}
                  </Typography>
                  // </Paper>
                );
              } else if (idx === 3) {
                return (
                  <Typography
                    key={idx}
                    component={"span"}
                    className={`${styles.digit} ${styles[`digit${idx}`]}`}
                    // className={start && currentTime > 0 ? styles.timer : ""}
                  >
                    {`${digit}`}
                  </Typography>
                );
              }
            })}
          </Box>
        </Box>
      }
    </Box>
  );
};

export default Timer;
