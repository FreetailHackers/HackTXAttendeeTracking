import React, {useState, useContext} from 'react'
import { StatusBar, SafeAreaView, Text, TextInput, Button, StyleSheet} from 'react-native'
import AuthContext from '../context/AuthContext'

export default function Login({navigation}) {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <StatusBar barStyle='dark-content' />
            <SafeAreaView style={styles.container}>
                <Text style={styles.centeredText}>Login</Text>
                <TextInput style={styles.input} autoCapitalize="none" onChangeText={text => setEmail(text)} value={email} />
                <TextInput style={styles.input} autoCapitalize="none" onChangeText={text => setPassword(text)} secureTextEntry={true} value={password} />
                <Button title="Submit" onPress={() => signIn({email, password})} />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00FF00"
    },
    centeredText: {
        textAlign: 'center'
    },
    input: {
        borderWidth: 2,
    }
})