import { ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";

import useAppCtx from "../state";
import { FormActions } from "../reducer/formReducer";
import { AuthActions, UserType } from "../reducer/authReducer";
import { getData } from "../services/db/indexedDb";
import { comparePasswords } from "../utils/hashPassword";

const Login = () => {
  //   const { addData, getData } = useIndexedDB("speedApp", "users");
  const [state, dispatch] = useAppCtx();
  const { form } = state;
  const navigate = useNavigate();
  //   const currentUser = useCurrentUser();
  //   const [isSubmitted, setIsSubmitted] = useState(false);

  //   const [submitTrue, setSubmitTrue] = useState(true);

  useEffect(() => {
    dispatch({ type: FormActions.RESET_FORM });
    dispatch({ type: AuthActions.LOGOUT });
  }, []);

  useEffect(() => {
    if (!state.auth.isAuthenticated) {
      getData("currentUser")
        .then((data) => {
          if (data.length > 0) {
            dispatch({
              type: AuthActions.LOGIN_SUCCESS_CU,
              payload: data[0] as UserType,
            });
          } else {
            navigate("/login");
          }
        })
        .catch((e) => {
          console.error(e);
          navigate("/login");
        });
    } else {
      navigate("/game");
    }
  }, [state.auth.isAuthenticated]);

  //   useEffect(() => {
  //     if (state.auth.isAuthenticated) {
  //       navigate("/game");
  //     } else {
  //       if (currentUser) {
  //         dispatch({ type: AuthActions.LOGIN_SUCCESS, payload: currentUser });
  //       }
  //     }
  //   }, [state.auth.isAuthenticated]);

  function handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: FormActions.SET_USERNAME, payload: e.target.value });
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: FormActions.SET_PASSWORD, payload: e.target.value });
  }

  const handleLoginSubmit = async () => {
    try {
      const existingUser = (await getData(
        "users",
        form.data.username
      )) as UserType;
      const compare = await comparePasswords(
        form.data.password,
        existingUser.password
      );

      if (
        existingUser &&
        compare
        // (await comparePasswords(existingUser.password, form.data.password))
        // (await bcrypt.compare(existingUser.password, form.data.password))
      ) {
        dispatch({
          type: AuthActions.LOGIN_SUCCESS,
          payload: existingUser,
        });
        dispatch({ type: FormActions.RESET_FORM });
      } else {
        dispatch({
          type: AuthActions.LOGIN_FAILURE,
          payload: "Incorrect username or password",
        });
      }
    } catch (e) {
      dispatch({
        type: AuthActions.LOGIN_FAILURE,
        payload: "Error on login ",
      });
    }
  };

  //   const handleAvatarChange = (avatar: string) => {
  //     setSelectedAvatar(avatar);
  //   };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // setIsSubmitted(true);
    // setMessage("Form submitted successfully!");
  };

  //   const SignUpForm = () => {
  return (
    <Box maxWidth="400px" mx="auto" p="2px">
      <form className="UserSignup" onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Log in
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          id="username"
          name="username"
          label="Username"
          type="text"
          value={form.data.username}
          required
          inputProps={{ maxLength: 15 }}
          onChange={handleUsernameChange}
        />
        {/* {form.errors.username && (
            <Typography color="error" variant="body2" paragraph>
              {form.errors.username}
            </Typography>
          )} */}

        <TextField
          //   color={form.errors.password ? "error" : "primary"}
          fullWidth
          margin="normal"
          id="password"
          name="password"
          label="Password"
          type="password"
          value={form.data.password}
          required
          onChange={handlePasswordChange}
        />

        {state.auth.error && (
          <Typography color="error" variant="body2" paragraph>
            {state.auth.error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          // disabled={submitTrue}
          onClick={handleLoginSubmit}
        >
          Send
        </Button>
        <Typography variant="body2" m="16px">
          Create a new <Link to={"/signup"}>account</Link>?
        </Typography>
      </form>
    </Box>
  );
  //   };

  //   const Submitted = () => {
  //     return (
  //       <>
  //         <Typography>Submitting</Typography>
  //       </>
  //     );
  //   };

  //   return isSubmitted ? <Submitted /> : <SignUpForm />;
  //   return SignUpForm();
};

export default Login;

//TODO: clear state DONE!
