export type FormState = {
  data: {
    name: string;
    username: string;
    email: string;
    avatar: string;
    password: string;
    confirmPassword: string;
  };
  errors: {
    username: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
  };
};

export type ErrorMessage = {
  type: "username" | "email" | "password" | "confirmPassword";
  msg: string;
};

export type FormActionType =
  | { type: FormActions.SET_NAME; payload: string }
  | { type: FormActions.SET_USERNAME; payload: string }
  | { type: FormActions.SET_EMAIL; payload: string }
  | { type: FormActions.SET_PASSWORD; payload: string }
  | { type: FormActions.SET_CONFIRM_PWD; payload: string }
  | { type: FormActions.SET_AVATAR; payload: string }
  | { type: FormActions.RESET_FORM; payload?: null }
  | { type: FormActions.SET_ERROR; payload: ErrorMessage };

export enum FormActions {
  SET_NAME = "SET_NAME",
  SET_USERNAME = "SET_USERNAME",
  SET_EMAIL = "SET_EMAIL",
  SET_PASSWORD = "SET_PASSWORD",
  SET_AVATAR = "SET_AVATAR",
  SET_CONFIRM_PWD = "SET_CONFIRM_PWD",
  RESET_FORM = "RESET_FORM",
  SET_ERROR = "SET_ERROR",
}

function validateEmail(email: string) {
  const emailRE = /\S+@\S+\.\S+/;
  return emailRE.test(String(email));
}

// function validatePassword(password: string) {
//   return String(password).includes(" ");
// }

// if (validatePassword(userData.password!)) {
//   setMessage("White spaces are not allowed in passwords");
//   return;
// }

// if (userData.password !== userData.passwordConfirmation) {
//   setMessage("Passwords did not match");
//   return;
// }
// if (String(userData.password!).length < 8) {
//   setMessage("Password must be at least 8 characters");
//   return;
// }

const formReducer = (state: FormState, action: FormActionType) => {
  const { type, payload } = action;

  switch (type) {
    case FormActions.SET_NAME: {
      return {
        ...state,
        data: {
          ...state.data,
          name: payload,
        },
      };
    }

    case FormActions.SET_USERNAME: {
      // const existingUser = await getData(payload);
      return {
        ...state,
        data: {
          ...state.data,
          username: payload,
        },
      };
    }

    case FormActions.SET_EMAIL: {
      let error = null;
      if (!validateEmail(payload)) {
        error = "Please enter a valid email address";
      }
      return {
        ...state,
        data: {
          ...state.data,
          email: payload,
        },
        errors: {
          ...state.errors,
          email: error,
        },
      };
    }

    case FormActions.SET_AVATAR: {
      return {
        ...state,
        data: {
          ...state.data,
          avatar: payload,
        },
      };
    }

    case FormActions.SET_PASSWORD: {
      let error = null;
      //   const isValid = validatePassword(payload);
      //   if (!isValid) {
      //     error = "White spaces are not allowed in passwords";
      //   }
      if (payload.length < 8) {
        error = "Password must be at least 8 characters";
      }
      return {
        ...state,
        data: {
          ...state.data,
          password: payload,
        },
        errors: { ...state.errors, password: error },
      };
    }

    case FormActions.SET_CONFIRM_PWD: {
      return {
        ...state,
        data: {
          ...state.data,
          confirmPassword: payload,
        },
        errors: {
          ...state.errors,
          confirmPassword:
            state.data.password !== payload ? "Passwords must match" : null,
        },
      };
    }

    case FormActions.RESET_FORM: {
      return {
        ...state,
        data: {
          ...state.data,
          name: "",
          username: "",
          password: "",
          confirmPassword: "",
          avatar: "",
          email: "",
        },
        errors: {
          username: null,
          email: null,
          password: null,
          confirmPassword: null,
        },
      };
    }

    case FormActions.SET_ERROR: {
      return {
        ...state,
        errors: { ...state.errors, [payload.type]: payload.msg },
      };
    }

    default:
      return state;
  }
};

export default formReducer;
