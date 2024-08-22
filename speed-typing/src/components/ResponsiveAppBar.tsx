import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Link, Outlet, useNavigate } from "react-router-dom";
// import { UserContext } from "./App";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
// import AlertDialog from "./AlertDialog";
// import { useSelector } from "react-redux";
// import { RootState } from "../reducers";

import useAppCtx from "../state";
import { AuthActions } from "../reducer/authReducer";
import { clearStore } from "../services/db/indexedDb";
import { GameAction } from "../reducer/gameReducer";
import { TimerAction } from "../reducer/timerReducer";

const pages = ["Login", "Sign Up"];
// const settings = ["Dashboard", "Logout"];

function ResponsiveAppBar() {
  const [state, dispatch] = useAppCtx();
  const { auth } = state;
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [path, setPath] = useState(window.location.pathname.split("/")[1]);
  //   const [openMenu, setOpenMenu] = useState(false);

  //   const handleClick = () => {
  //     setOpenDialog(true);
  //   };

  useEffect(() => {
    setPath(window.location.pathname.split("/")[1]);
  }, [window.location.pathname]);
  const logoutFn = () => {
    dispatch({ type: AuthActions.LOGOUT, payload: null });
    dispatch({ type: GameAction.RESET_GAME });
    dispatch({ type: TimerAction.RESET_TIMER });
    clearStore("currentUser");

    handleClose();
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setOpenDialog(true);
    setAnchorElNav(null);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
    // setOpenMenu(true);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Speed Typing Test
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={!!anchorElNav}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {!auth.user ? (
                  pages.map((page) => (
                    <MenuItem
                      component={Link}
                      to={page.split(" ").join("")}
                      key={page}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))
                ) : (
                  //?Menu for the hamburger menu

                  <Box>
                    <MenuItem
                      component={Link}
                      to={"game"}
                      key={"game"}
                      // onClick={handleLogoutClick}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">Game</Typography>
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={"stats"}
                      key={"stats"}
                      // onClick={handleLogoutClick}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">Stats</Typography>
                    </MenuItem>
                    <MenuItem
                      // component={Button}
                      // to={"logout"}
                      key={"logout"}
                      onClick={handleLogoutClick}
                    >
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Box>
                )}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to={"/"}
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Speed Typing Test
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {!auth.user
                ? pages.map((page) => (
                    <MenuItem
                      component={Link}
                      to={page.split(" ").join("")}
                      key={page}
                      sx={{
                        my: 2,
                        color: "white",
                        display: "block",
                        textDecoration: "none",
                      }}
                    >
                      {page}
                    </MenuItem>
                  ))
                : null}
            </Box>
            {/* //? Menu for the expanded bar */}
            {auth.isAuthenticated && (
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <MenuItem component={Link} to={"game"} key={"game"}>
                  <Typography
                    textAlign="center"
                    // color={path === "game" ? "secondary" : "inherit"}
                    fontWeight={path === "game" ? "bold" : "lighter"}
                  >
                    Game
                  </Typography>
                </MenuItem>
                <MenuItem
                  component={Link}
                  to={"stats"}
                  key={"stats"}
                  // onClick={handleLogoutClick}
                >
                  <Typography
                    textAlign="center"
                    fontWeight={path === "stats" ? "bold" : "lighter"}
                  >
                    Stats
                  </Typography>
                </MenuItem>
                <MenuItem
                  // component={Button}
                  // to={"logout"}
                  key={"logout"}
                  onClick={handleLogoutClick}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Box>
            )}
            <Box sx={{ flexGrow: 0 }}>
              {/* <Tooltip title="Open"> */}
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {auth.user ? (
                  <Avatar
                    alt={auth.user.username}
                    src={auth.user.avatar}
                    sx={{ border: "1px solid white" }}
                  />
                ) : (
                  <Avatar
                    alt={undefined}
                    src={undefined}
                    sx={{ border: "1px solid white" }}
                  />
                )}
              </IconButton>

              {/* </Tooltip> */}
            </Box>
          </Toolbar>
          <Dialog
            // open={state.timer.currentTime <= 0 && openDialog}
            open={openDialog}
            onClose={handleClose}
          >
            <DialogTitle>Logout</DialogTitle>
            <DialogContent>
              <Typography>Do you want to logout?</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={logoutFn}>
                Yes
              </Button>
              <Button onClick={handleClose}>No</Button>
            </DialogActions>
          </Dialog>
          {/* {openDialog && <LogOut open={openDialog} onClose={handleClose} />} */}
        </Container>
      </AppBar>
      <Box marginTop="56px">
        <Outlet />
      </Box>
    </div>
  );
}
export default ResponsiveAppBar;
