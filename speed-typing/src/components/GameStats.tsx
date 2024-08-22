import { Box, Typography } from "@mui/material";
import { StatsType } from "../reducer/gameReducer";
import { forwardRef } from "react";

export type GameStatsType = {
  stats: StatsType;
  isBackSpace: boolean;
  //   {
  //     accuracy: number;
  //     wpm: number;
  //     errors: number;
  //     accurateWords: number;
  //   };
};

const GameStats = forwardRef<HTMLDivElement, GameStatsType>((props, ref) => {
  const { stats, isBackSpace } = props;
  return (
    <Box
      ref={ref}
      width={"225px"}
      // minWidth={"225px"}
      border="1px solid #ccc"
      borderRadius="8px"
      padding="16px"
      bgcolor="#f9f9f9"
      boxShadow="0 2px 4px rgba(0,0,0,0.1"
      margin="0 auto"
      justifyContent="left"
      display="flex"
    >
      <Typography color="red" variant="h4" marginBottom="4px">
        Game stats:
      </Typography>
      <Typography variant="h6" marginBottom="4px">
        Accuracy %: {stats.accuracy}
      </Typography>
      <Typography variant="h6" marginBottom="4px">
        Words/minute: {stats.wpm}
      </Typography>
      <Typography variant="h6" marginBottom="4px">
        Errors: {stats.errors}
      </Typography>
      {!isBackSpace && (
        <Typography variant="h6" marginBottom="4px">
          Accurate Words %: {stats.accurateWords}
        </Typography>
      )}
    </Box>
  );
});

export default GameStats;
