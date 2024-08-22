import { useEffect, useState } from "react";
import useAppCtx from "../state";
import { GameAction } from "../reducer/gameReducer";
import { faker } from "@faker-js/faker";

const useParagraph = (numberOfWords: number) => {
  const [, setText] = useState("");
  const [, dispatch] = useAppCtx();
  const getParagraph = (words: number) => faker.word.words(words);
  useEffect(() => {
    // fetch(filePath)
    const text = getParagraph(numberOfWords);
    setText(text);
    dispatch({ type: GameAction.SET_GAME, payload: text });
    // .then((res) => res.text())
    // .then((data) => {
    //   setText(data);
    //   dispatch({ type: GameAction.SET_GAME, payload: data });
    // })
    // .catch((error) => {
    //   console.error("Error fetching the text file:", error);
    // });
  }, []);

  return getParagraph;
};

export default useParagraph;
