import { Grid, Paper, Typography } from "@mui/material";
import { forwardRef, useMemo } from "react";

type TextDisplayProps = {
  text: string[];
  input: string[];
  currentIdx: number;
};
//TODO: avoid sx DONE!
//TODO: memoize text operations DONE!
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
    const textSpanned = useMemo(() => {
      return text.map((word, idx) => {
        // console.log(text);
        if (word.match(/\n/)) {
          // console.log("new line");
          word = " ";
        }
        return (
          <span key={idx}>
            <Typography
              width="1rem"
              color={input[idx] === word ? "green" : "red"}
              sx={{
                backgroundColor:
                  idx === currentIdx ? "lightblue" : "transparent",
              }}
            >
              {word !== " " ? word : "\u00A0"}
            </Typography>
          </span>
        );
      });
    }, [text, input]);
    // console.log(remToPixels(1));
    return (
      <Paper>
        <Grid
          ref={ref}
          width="100%"
          height="40px"
          overflow="hidden"
          display="flex"
          alignItems="flex-start"
        >
          {/* {[...whiteSpaces, ...textArr].map((word, idx) => { */}
          {/* {text.map((word, idx) => {
            console.log(text);
            if (word.match(/\n/)) {
              // console.log("new line");
              word = " ";
            }
            return (
              <span key={idx}>
                <Typography
                  width="1rem"
                  sx={{
                    backgroundColor: input[idx] === word ? "green" : "red",
                  }}
                >
                  {word !== " " ? word : "\u00A0"}
                </Typography>
              </span>
            );
          })} */}
          {textSpanned}
        </Grid>
      </Paper>
    );
  }
);

export default TextDisplay;
