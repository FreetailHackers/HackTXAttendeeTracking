import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from './Profile';
import Camera from './Camera';
import Resume from './Resume';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CameraTab() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Camera" component={Camera} options={{headerShown: false}} />
            <Stack.Screen name="Resume" component={Resume}/>
        </Stack.Navigator>
    )
}

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="ScanScreen" component={CameraTab} />
        </Tab.Navigator>
    )
}