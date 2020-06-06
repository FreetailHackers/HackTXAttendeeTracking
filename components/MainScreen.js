import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Profile from './Profile';
import Camera from './Camera';

const Tab = createMaterialTopTabNavigator();

export default function MainScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Camera" component={Camera} />
        </Tab.Navigator>
    )
}