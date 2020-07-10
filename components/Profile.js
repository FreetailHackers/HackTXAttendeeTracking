import React, { useContext } from 'react';
import { Button, SafeAreaView } from 'react-native';
import AuthContext from '../context/AuthContext';

export default function Profile({navigation}) {

    const { signOut } = useContext(AuthContext);

    return (
        <SafeAreaView>
            <Button onPress={() => {signOut()}} title="Log Out"/>
        </SafeAreaView>
    )
}