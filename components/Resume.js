import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import Pdf from 'react-native-pdf';
import {getResume} from '../services/UserService';

export default function Resume(props) {
    const id = props.route.params.id
    const [source, setSource] = useState(null);
    const [percent, setPercent] = useState(0);

    const loadResume = () => {
        getResume(id, (base64) => {
            setSource({'uri': 'data:application/pdf;base64,' + base64})
        })
    }
    useEffect(loadResume, []);

    return (
        <View style={styles.container}>
            {source ?
            <Pdf
                source={source}
                onLoadProgress={(percent)=>{
                    setPercent(percent);
                }}
                onError={(error)=>{
                    console.log(error);
                }}
                style={styles.pdf}
            />
            :
            <Text>{percent + "% Loaded"}</Text>
        }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});