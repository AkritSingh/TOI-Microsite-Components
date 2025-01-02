/* eslint-disable react/prop-types */
import React, { createContext, useContext, useReducer } from 'react';

const initalLoginState = {
  userData: {},
  userPrcData: {},
};
const LoginContext = createContext(initalLoginState);

const LoginDispatchContext = createContext(null);

function LoginReducer(loginState, action) {
  switch (action.type) {
    case 'storeUser': {
      const uData = loginState.userData || {};
      const payload = action.payload || {};
      if (!payload.isLoggedIn) {
        return { ...initalLoginState };
      }
      return {
        ...loginState,
        userData: {
          ...uData,
          ...payload,
        },
      };
    }
    case 'storeUserPrcData': {
      const uData = loginState.userPrcData || {};
      return {
        ...loginState,
        userPrcData: {
          ...uData,
          ...action.payload.userPrcData,
        },
      };
    }

    default: {
      return loginState;
    }
  }
}

export default function LoginContextProvider({ children }) {
  const [loginState, dispatch] = useReducer(LoginReducer, initalLoginState);
  // console.log('LoginContextProvider==========================>>', loginState);

  // if (loginState?.userData?.getEmail) {
  //   console.log(
  //     'LoginContextProvider==========================>>',
  //     loginState.userData.getEmail(),
  //     loginState.userData.getMappedUser(),
  //   );
  // }

  return (
    <LoginContext.Provider value={loginState}>
      <LoginDispatchContext.Provider value={dispatch}>
        {children}
      </LoginDispatchContext.Provider>
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  return useContext(LoginContext);
}

export function useLoginDispatch() {
  return useContext(LoginDispatchContext);
}
