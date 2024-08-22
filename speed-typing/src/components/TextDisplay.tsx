import { Grid, Paper, Typography } from "@mui/material";
import { forwardRef, useEffect, useMemo } from "react";

type TextDisplayProps = {
  text: string[];
  input: string[];
  currentIdx: number;
};

// const textSplit = (text: string) => {
//   return text.split("");
// };

// const remToPixels = (rem: number) => {
//   return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
// };
const TextDisplay = forwardRef<HTMLDivElement, TextDisplayProps>(
  (props, ref) => {
    const { text, input, currentIdx } = props;
    // const whiteSpaces = " ".repeat(10).split("");
    // const textArr = useMemo(() => textSplit(text), [text]);

    useEffect(() => {}, [text, input, currentIdx]);
    const textSpanned = useMemo(() => {
      return text.map((word, idx) => {
        if (word.match(/\n/)) {
          word = " ";
        }
        return (
          <span key={idx}>
            <Typography
              width="1rem"
              align="center"
              color={input[idx] === word ? "green" : "red"}
              sx={{
                backgroundColor:
                  idx === currentIdx
                    ? "lightblue"
                    : word === " " && input[idx] && input[idx] !== word
                      ? "red"
                      : "transparent",
              }}
            >
              {word !== " " ? word : "\u00A0"}
            </Typography>
          </span>
        );
      });
    }, [text, input, currentIdx]);

    return (
      <Paper>
        <Grid
          ref={ref}
          width="100%"
          height="180px"
          overflow="hidden"
          display="flex"
          // alignItems="flex-start"
          flexWrap="wrap"
        >
          {textSpanned}
        </Grid>
      </Paper>
    );
  }
);

export default TextDisplay;
