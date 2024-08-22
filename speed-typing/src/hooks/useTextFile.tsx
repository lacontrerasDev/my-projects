import { useEffect, useState } from "react";
import useAppCtx from "../state";
import { GameAction } from "../reducer/gameReducer";

const useTextFile = (filePath: string) => {
  const [text, setText] = useState("");
  const [, dispatch] = useAppCtx();
  useEffect(() => {
    fetch(filePath)
      .then((res) => res.text())
      .then((data) => {
        setText(data);
        dispatch({ type: GameAction.SET_GAME, payload: data });
      })
      .catch((error) => {
        console.error("Error fetching the text file:", error);
      });
  }, [filePath]);

  return text;
};

export default useTextFile;
