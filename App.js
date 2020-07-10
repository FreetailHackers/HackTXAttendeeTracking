import 'react-native-gesture-handler';
import React, { useEffect, useReducer, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import MainScreen from './components/MainTabs.js'
import Login from './components/Login.js'
import {signInUser, signOutUser, restoreUserSession} from './services/UserService'

const initalState = {authToken: null, user: null, mode: null};

function reducer(prevState, action) {
  const {authToken, user, mode} = action
  switch(action.type) {
    case "RESTORE_TOKEN":
    case "LOG_IN":
      return {...prevState, authToken, user, mode};
    case "LOG_OUT":
      return {...prevState, ...initalState};
    default:
      throw Error();
  }
}

export default function App() {
  const [state, setState] = useReducer(reducer, initalState);

  // check if the user is already logged in
  useEffect(() => {
    restoreUserSession((session) => {
      const {authToken, user, mode} = session
      setState({type : "RESTORE_TOKEN", authToken, user, mode})
    }
  )}, []);

  // will be passed to nested components to allow sign in/out
  const authContextValue = useMemo(() => ({
    signIn: (payload) => {
        signInUser(payload, ({authToken, user, mode}) => {
            setState({type : "LOG_IN", authToken, user, mode})
          }
        )
    },
    signOut: () => {
        // Destroy locally-stored token
        signOutUser(() => {
            setState({type: "LOG_OUT"})
        })
    },
    ...state
  }),[state]);

  return (
      <NavigationContainer>
        <AuthProvider value={authContextValue}>
          {state.authToken ?
            <MainScreen/>
            :
            <Login/>
          }
        </AuthProvider>
        </NavigationContainer>

  );
}