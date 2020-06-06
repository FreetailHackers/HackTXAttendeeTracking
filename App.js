import 'react-native-gesture-handler';
import React, { useEffect, useReducer, useMemo } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';

import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage, Alert } from 'react-native';

import MainScreen from './components/MainScreen.js'
import Login from './components/Login.js'

const Stack = createStackNavigator();
const REACT_NATIVE_SERVER_URL = "http://192.168.1.72:3000";

function reducer(prevState, action) {
  switch(action.type) {
    case "RESTORE_TOKEN":
      return {...prevState, isLoading: false, authToken: action.authToken, user: action.user, mode: action.mode};
    case "LOG_IN":
      return {...prevState, isSignOut: false, authToken: action.authToken, user: action.user, mode: action.mode};
    case "LOG_OUT":
      return {...prevState, isSignOut: true, authToken: null, authToken: null, user: null, mode: null};
    default:
      throw Error();
  }
}

async function storeCurrUser(payload) {
  try {
    await AsyncStorage.setItem('@curr_user', JSON.stringify(payload));
  }
  catch(e) {
    console.log(e)
  }
}



export default function App() {
  const initalState = {isLoading : true, isSignOut: false, authToken: null, user: null, mode: null};
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@curr_user');
        if(raw) {
          const currUser = JSON.parse(raw);
          console.log(currUser);
          dispatch({type : "RESTORE_TOKEN", authToken : currUser.authToken, user : currUser.user, mode : currUser.mode})
        }
        else {
          dispatch({type : "RESTORE_TOKEN", authToken : null, user : null, mode : null})
        }
      }
      catch(e) {
        console.log(e)
      }
    })();
  }, []);

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {text: "OK", onPress: () => console.log("OK Pressed")},
      ], {cancelable: false});
  }

  const authContext = useMemo(() => ({
    signIn: async (payload) => {
      // Calls login request
      console.log(REACT_NATIVE_SERVER_URL);
      await fetch(REACT_NATIVE_SERVER_URL + "/auth/login", {

          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body : JSON.stringify(payload)

      }).then((data) => data.json())
      .then((data) => {
          console.log(data);
          // Stores auth-token if successful
          if(data.message === undefined) {
            if(data.user.admin !== true && data.user.sponsor !== true) {
              showAlert("Error", "Invalid Login: User is not an admin or sponsor");
            }
            else {
              let user = data.user;
              let authToken = data.token;
              let mode = null;
              if(data.user.admin) mode = "admin";
              else if(data.user.sponsor) mode = "sponsor"
              storeCurrUser({authToken, user, mode});
              dispatch({type : "LOG_IN", authToken, user, mode});
            }
          }
      }).catch((err) => console.log(err));
    },
    signOut: async () => {
      // Destroy locally-stored token
      try {
        await AsyncStorage.removeItem('@curr_user');
      }
      catch(e) {
        console.log(e);
      }
      dispatch({type : "LOG_OUT"});
    },
    ...state
  }),[state]);


  return (
    <NavigationContainer>
      <AuthProvider value={authContext}>
        <Stack.Navigator headerMode="none">
          {
          state.authToken !== null ?
            <>
              <Stack.Screen name="Main" component={MainScreen} />
            </>
            :
          <Stack.Screen name="Login" component={Login} />
          }
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}


