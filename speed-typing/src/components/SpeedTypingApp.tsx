import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

// import { v4 as uuidv4 } from "uuid";
import DownMode from "./DownMode";
import UpMode from "./UpMode";
import { useState } from "react";
import useAppCtx from "../state";
import { TimerAction } from "../reducer/timerReducer";
import { GameAction } from "../reducer/gameReducer";

// type UserTypeArr = UserType[];
const SpeedTypingApp = () => {
  const [mode, setMode] = useState<"countDown" | "countUp" | "">("");
  const [state, dispatch] = useAppCtx();
  const modes = {
    countUp: <UpMode />,
    countDown: <DownMode />,
  };

  const handleChange = (e: SelectChangeEvent) => {
    const value = e.target.value;
    if (value === "countDown") {
      dispatch({ type: TimerAction.SET_TIMER, payload: 2 });
      setMode(value as "countDown" | "countUp");
    } else if (value === "countUp") {
      dispatch({ type: TimerAction.SET_TIMER, payload: 0 });
      setMode(value as "countDown" | "countUp");
    }
  };

  const handleCheckBoxChange = () => {
    dispatch({ type: GameAction.TOGGLE_BACKSPACE });
  };
  return (
    <Box maxWidth="100%">
      {!mode ? <Typography variant="h4">Select the game mode</Typography> : ""}

      <Box display="flex" alignItems="center" justifyContent="center" gap="10%">
        <Box width="30%" m="24px">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Mode</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mode}
              label="Mode"
              onChange={handleChange}
            >
              <MenuItem value={"countDown"}>Count down</MenuItem>
              <MenuItem value={"countUp"}>Count up</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                disabled={state.timer.isRunning}
                checked={state.game.isBackSpace}
                onChange={handleCheckBoxChange}
              />
            }
            label="Backspace"
          />
        </FormGroup>
      </Box>
      {modes[mode as "countDown" | "countUp"]}
    </Box>
  );
};

export default SpeedTypingApp;
//TODO: refactor authentication into its own component DONE!
