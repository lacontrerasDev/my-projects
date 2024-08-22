import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import avatar1 from "/hombre.png";
import avatar2 from "/mujer.png";
import avatar3 from "/nina.png";
import avatar4 from "/nino.png";
import useAppCtx from "../state";
import { FormActions } from "../reducer/formReducer";
import { AuthActions, UserType } from "../reducer/authReducer";
import { hashPassword } from "../utils/hashPassword";
import { addData, getData } from "../services/db/indexedDb";

const predefinedAvatars = [avatar1, avatar2, avatar3, avatar4];

const Signup = () => {
  const [state, dispatch] = useAppCtx();
  const { form, auth } = state;
  const navigate = useNavigate();

  const [isSubmitted, setIsSubmitted] = useState(false);

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
            navigate("/signup");
          }
        })
        .catch((e) => {
          console.error(e);
          navigate("/signup");
        });
    } else {
      navigate("/game");
    }
  }, [state.auth.isAuthenticated]);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: FormActions.SET_NAME, payload: e.target.value });
  }

  function handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: FormActions.SET_USERNAME, payload: e.target.value });
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: FormActions.SET_EMAIL, payload: e.target.value });
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: FormActions.SET_PASSWORD, payload: e.target.value });
  }

  function handleConfirmPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: FormActions.SET_CONFIRM_PWD, payload: e.target.value });
  }

  function handleAvatarChange(avatar: string) {
    dispatch({ type: FormActions.SET_AVATAR, payload: avatar });
  }

  const handleSignupSubmit = async () => {
    try {
      const existingUser = await getData("users", form.data.username);
      if (!existingUser) {
        for (const field in form.data) {
          if (form.data[field as keyof typeof form.data].trim() === "") {
            dispatch({
              type: AuthActions.LOGIN_FAILURE,
              payload: "All fields are required",
            });
            return;
          }
        }
        if (form.data.password.includes(" ")) {
          // dispatch({
          //   type: AuthActions.LOGIN_FAILURE,
          //   payload: "White spaces are not allowed in passwords",
          // });
          dispatch({
            type: FormActions.SET_ERROR,
            payload: {
              type: "password",
              msg: "White spaces not allowed in password",
            },
          });
          return;
        }
        const hashedPassword = hashPassword(form.data.password);
        const user = {
          id: form.data.username.trim(),
          name: form.data.name.trim(),
          username: form.data.username.trim(),
          email: form.data.email.trim(),
          avatar: form.data.avatar.trim(),
          password: hashedPassword,
        };

        addData("users", user);
        addData("currentUser", user);
        setIsSubmitted(true);
        dispatch({ type: FormActions.RESET_FORM });
        dispatch({ type: AuthActions.LOGIN_SUCCESS, payload: user });
      } else {
        // dispatch({
        //   type: AuthActions.LOGIN_FAILURE,
        //   payload: "Username already in use",
        // });
        dispatch({
          type: FormActions.SET_ERROR,
          payload: { type: "username", msg: "Username already in use" },
        });
      }
    } catch (e) {
      dispatch({
        type: AuthActions.LOGIN_FAILURE,
        payload: "Error on signup ",
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Box maxWidth="400px" mx="auto" p="2px">
      <form className="UserSignup" onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Sign up
        </Typography>
        <Typography variant="body2">
          Already have an <Link to={"/Login"}>account</Link>?
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          id="firstName"
          name="firstName"
          label="Name"
          type="text"
          value={form.data.name}
          required
          placeholder="First Name"
          inputProps={{ maxLength: 15 }}
          onChange={handleNameChange}
        />

        <TextField
          color={form.errors.username ? "error" : "primary"}
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
        {form.errors.username && (
          <Typography color="error" variant="body2" paragraph>
            {form.errors.username}
          </Typography>
        )}

        <TextField
          color={form.errors.email ? "error" : "primary"}
          fullWidth
          margin="normal"
          id="email"
          name="email"
          label="Email"
          type="email"
          value={form.data.email}
          required
          inputProps={{ maxLength: 40 }}
          onChange={handleEmailChange}
        />
        {form.errors.email && (
          <Typography color="error" variant="body2" paragraph>
            {form.errors.email}
          </Typography>
        )}

        <Typography variant="h6" gutterBottom>
          Select an Avatar
        </Typography>
        <Box display="flex" justifyContent="space-around">
          {predefinedAvatars.map((avatar) => (
            <Box
              border={
                form.data.avatar === avatar
                  ? "2px solid #1976D2"
                  : "2px solid transparent"
              }
              p="1px"
              borderRadius="50%"
              key={avatar}
              onClick={() => handleAvatarChange(avatar)}
            >
              <Avatar
                src={avatar}
                alt="Avatar"
                sx={{ width: 56, height: 56 }}
              />
            </Box>
          ))}
        </Box>
        <TextField
          color={form.errors.password ? "error" : "primary"}
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
        {form.errors.password && (
          <Typography color="error" variant="body2" paragraph>
            {form.errors.password}
          </Typography>
        )}
        <TextField
          color={form.errors.confirmPassword ? "error" : "primary"}
          fullWidth
          margin="normal"
          id="passwordConfirmation"
          name="passwordConfirmation"
          label="Confirm Password"
          type="password"
          value={form.data.confirmPassword}
          required
          onChange={handleConfirmPasswordChange}
        />
        {form.errors.confirmPassword && (
          <Typography color="error" variant="body2" paragraph>
            {form.errors.confirmPassword}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitted}
          onClick={handleSignupSubmit}
        >
          Register
        </Button>
      </form>
      {auth.error && (
        <Typography marginTop="16px" color="error" variant="h6" paragraph>
          {auth.error}
        </Typography>
      )}
    </Box>
  );
};

export default Signup;
//TODO: error on the user field DONE!
