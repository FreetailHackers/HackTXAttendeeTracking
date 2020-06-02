import 'react-native-gesture-handler';
import * as React from 'react';
import checkInScreen from './components/checkInScreen.js';
import foodScreen from './components/foodScreen.js';
import adminScreen from './components/adminScreen.js'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import { Stitch, AnonymousCredential } from "mongodb-stitch-react-native-sdk";

const Tab = createBottomTabNavigator();


export default class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      currentUserId: undefined,
      client: undefined,
      isLoadingComplete: false,
      logged_in : false
    };
  }

  render() {
      return (
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Hackathon Check In" component={checkInScreen} />
            <Tab.Screen name="Food Check In" component={foodScreen} />
            <Tab.Screen name="Admin" component={adminScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      );

  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
