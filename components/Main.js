import React, {useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { StatusBar, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image, View, FlatList} from 'react-native';

const rows = [
    { id: 0, title: 'Hackathon Check In', toGo: 'Hackathon Check In' },
    { id: 1, title: 'Food Check In', toGo: 'Food Check In'},
    { id: 2, title: 'Admin', toGo: 'Admin'},
];

export default function Main({navigation}){
    const { signOut } = useContext(AuthContext);
    return (
        <>
            <StatusBar barStyle='dark-content' />
            <SafeAreaView style={styles.container}>
                {/* <Text style={styles.header} >Welcome to HackTX! </Text> */}
                <FlatList 
                    data={rows}
                    renderItem={({item}) => <Item title={item.title} toGo={item.toGo} navigation={navigation} />}
                    keyExtractor = {item => String(item.id)}
                />
                <TouchableOpacity onPress={() => signOut()}>
                    <View style={styles.viewStyle}>
                        <Text>Log Out</Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
}

function Item({title, toGo, navigation}) {
    return (
        <TouchableOpacity onPress={() => navigation.navigate(toGo)}>
            <View style={styles.viewStyle}>
                <Text>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'column',
        alignItems:'center',
        paddingTop: 10
    },
    header: {
        marginTop: 20,
        fontSize: 30,
        color: '#000'
    },
    viewStyle: {
        width: 400,
        height:100,
        justifyContent: 'center',
        alignItems:'center', 
        marginBottom : 10,
        marginTop : 30,
        backgroundColor:'#6495ed',
        borderRadius:10
    },
    Text:{
        color:'#ffffff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10,
        fontSize : 150,
        fontWeight: 'bold'
    }
});