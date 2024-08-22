import { useEffect, useState } from "react";
import * as styles from "./styles.module.css";
import { Box, Paper, Typography } from "@mui/material";
type DigitProps = {
  value: string;
  isPulse: boolean;
};

const Digit = ({ value, isPulse }: DigitProps) => {
  const [prevValue, setPrevValue] = useState(value);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (prevValue !== value) {
      setFlip(true);
      setTimeout(() => {
        setPrevValue(value);
        setFlip(false);
      }, 200);
    }
  }, [value, prevValue]);

  const className = isPulse ? styles.pulse : styles.flip;
  return (
    <Box className={`${styles.digit} ${flip ? className : ""}`}>
      {/* <Box className={`${styles.digit} ${flip ? styles.flip : ""}`}> */}

      <Paper variant="outlined" className={styles.digitInner}>
        <Typography className={styles.digitPrevious} variant="h3">
          {prevValue}
        </Typography>
        <Typography className={styles.digitCurrent}>{value}</Typography>
      </Paper>
      {/* </div> */}
    </Box>
  );
};

export default Digit;
