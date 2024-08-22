import { ComponentType, useEffect, useState } from "react";
import useAppCtx from "../state";
import { getData } from "../services/db/indexedDb";
import { AuthActions, UserType } from "../reducer/authReducer";
import { Navigate } from "react-router-dom";
import { Typography } from "@mui/material";

interface AuthProps<P = object> {
  Component: ComponentType<P>;
}

interface AuthComponentProps {
  [key: string]: unknown;
}

const authentication = <P extends AuthComponentProps>({
  Component,
}: AuthProps<P>) => {
  const AuthComponent = (props: P) => {
    const [state, dispatch] = useAppCtx();
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = state;

    // const getCurrentUser = async (): Promise<UserType> => {
    //   const currentUser = await getData<UserType[]>("currentUser");
    //   setCuttentUser(currentUser[0]);
    //   return currentUser[0];
    // };

    useEffect(() => {
      if (!auth.isAuthenticated) {
        const getCurrentUser = async () => {
          try {
            const current = await getData<UserType>("currentUser");
            if (current.length > 0) {
              // const data = current[0]
              setCurrentUser(current[0]);
              dispatch({
                type: AuthActions.LOGIN_SUCCESS_CU,
                payload: current[0],
              });
              setIsLoading(false);
            }
          } catch (e) {
            console.error(e);
          } finally {
            setIsLoading(false);
          }
        };
        if (!auth.isAuthenticated) {
          getCurrentUser();
          // setIsLoading(false);
        }
      }
    }, []);

    // useEffect(() => {
    //   getCurrentUser();
    //   console.log("currentUser");
    // }, []);
    // const navigate = useNavigate();

    // useEffect(() => {
    //   if (!auth.isAuthenticated) {
    //     getData<UserType>("currentUser")
    //       .then((data) => {
    //         console.log("Auth");
    //         if (data.length > 0) {
    //           console.log(data);
    //           dispatch({
    //             type: AuthActions.LOGIN_SUCCESS_CU,
    //             payload: data[0],
    //           });
    //         } else {
    //           console.log("not");
    //           navigate("/login");
    //         }
    //       })
    //       .catch((e) => {
    //         console.error(e);
    //         navigate("/login");
    //       });
    //   }
    // }, [auth.isAuthenticated, dispatch, navigate]);

    if (isLoading && !auth.isAuthenticated) {
      return <Typography>Loading...</Typography>;
    }

    if (auth.isAuthenticated || currentUser) {
      return <Component {...props} />;
    } else if (!(currentUser || auth.isAuthenticated) && !isLoading) {
      return <Navigate to="/login" />;
    }
  };

  return AuthComponent;
};

export default authentication;
