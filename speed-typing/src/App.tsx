import {
  createBrowserRouter,
  // Route,
  RouterProvider,
  // Routes,s
} from "react-router-dom";
import "./App.css";
import SpeedTypingApp from "./components/SpeedTypingApp";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { initDb } from "./services/db/indexedDb";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Stats from "./components/Stats";
import authentication from "./components/Authentication";

const router = createBrowserRouter([
  {
    Component: ResponsiveAppBar,
    children: [
      {
        path: "/game",
        Component: authentication({ Component: SpeedTypingApp }),
      },
      { path: "/signup", Component: Signup },
      { path: "/login", Component: Login },
      { path: "/stats", Component: authentication({ Component: Stats }) },
    ],
  },
  { path: "*", Component: Login },
]);

function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    initDb("speedApp", ["users", "stats", "currentUser"])
      .then(() => {
        console.log("Connected to DB");
        setIsDbInitialized(true);
      })
      .catch((error) => console.error(error));
  }, []);

  if (!isDbInitialized) {
    return <Typography>Loading...</Typography>;
  }
  return (
    // <Routes>
    //   <Route path="/game" element={<SpeedTypingApp />} />
    //   <Route path="/signup" element={<Signup />} />
    //   <Route path="/login" element={<Login />} />
    // </Routes>
    <RouterProvider router={router} />
  );
  // return <SpeedTypingApp />;
}

export default App;
