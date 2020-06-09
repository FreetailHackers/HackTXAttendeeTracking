import * as React from 'react';
import { Text, View, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { resumeScreen } from './pdfViewer.js';
import { adminScreen } from './adminScreen.js';
import { foodScreen } from './foodScreen.js';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export function adminResumeScreen() {
	return (
     	<Stack.Navigator initialRouteName="Scanner">
        	<Stack.Screen name="Scanner" component={adminScreen} />
        	<Stack.Screen name="View Resume" component={resumeScreen} />
      	</Stack.Navigator>
    );
}