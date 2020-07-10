import React, { useContext } from 'react';
import { Button } from 'react-native';
import AuthContext from '../context/AuthContext';

export default function Profile({navigation}) {

    const { signOut } = useContext(AuthContext);

    return (
        <Button onPress={() => {signOut()}} title="Log Out"/>
    )
}