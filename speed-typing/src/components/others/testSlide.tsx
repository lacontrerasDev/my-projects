import { Slide } from "@mui/material";
import React from "react";

const AnimatedTimer = () => {
  const [time, setTime] = React.useState(10);
  const [slideIn, setSlideIn] = React.useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(time - 1);
      if (time === 0) {
        setSlideIn(false);
        setTimeout(() => {
          setSlideIn(true);
          setTime(10);
        }, 1500); // wait 1.5 seconds before repeating
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <Slide
      direction="up"
      in={slideIn}
      timeout={{ enter: 100, appear: 10, exit: 100 }}
    >
      <div>
        <h1>{time}</h1>
      </div>
    </Slide>
  );
};

export default AnimatedTimer;
