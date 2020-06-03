import 'react-native-gesture-handler';
import React, { useEffect, useReducer, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';

import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';

import CheckInScreen from './components/CheckInScreen.js';
import FoodScreen from './components/FoodScreen.js';
import AdminScreen from './components/AdminScreen.js'
import Login from './components/Login.js'

const Stack = createStackNavigator();

const REACT_NATIVE_SERVER_URL = "http://192.168.1.72:3000";

function reducer(prevState, action) {
  switch(action.type) {
    case "RESTORE_TOKEN":
      return {...prevState, isLoading: false, authToken: action.authToken, id: action.id};
    case "LOG_IN":
      return {...prevState, isSignOut: false, authToken: action.authToken, id: action.id};
    case "LOG_OUT":
      return {...prevState, isSignOut: true, authToken: null, email: null};
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
  const initalState = {isLoading : true, isSignOut: false, authToken: null, email: null};
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    let loadToken = async () => {
      try {
        const raw = await AsyncStorage.getItem('@curr_user');
        if(raw) {
          const currUser = JSON.parse(raw);
          dispatch({type : "RESTORE_TOKEN", authToken : currUser.authToken, id : currUser.id})
        }
        else {
          dispatch({type : "RESTORE_TOKEN", authToken : null, id : null})
        }
      }
      catch(e) {
        console.log(e)
      }
    }
    loadToken();
  }, []);

  const authContext = useMemo(() => ({
    signIn: async (payload) => {
      let authToken = null;
      let email = null;
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
            id = data.user.id;
            authToken = data.user.token;
            storeCurrUser({id, authToken});
            dispatch({type : "LOG_IN", authToken, id});
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
        <Stack.Navigator>
          {
          state.authToken !== null ?
            <>
              <Stack.Screen name="Hackathon Check In" component={CheckInScreen} />
              <Stack.Screen name="Food Check In" component={FoodScreen} />
              <Stack.Screen name="Admin" component={AdminScreen} />
            </>
            :
          <Stack.Screen name="Login" component={Login} />
          }
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}


