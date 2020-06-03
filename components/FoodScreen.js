import * as React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { QRCode } from 'react-native-custom-qr-codes-expo';



export default function FoodScreen() {
  const [value, onChangeText] = React.useState('enter your name here');
  const [textEditable, setTextEditable] = React.useState(true);

  return (
    <React.Fragment>

      <Text style={{marginTop:100, marginLeft:140, fontWeight:"bold", fontSize:20}}>
        Get your food!
      </Text>

      <TextInput
        style={{ paddingLeft: 5, marginTop: 20, marginLeft: 20, marginRight: 20,
          height: 40, borderColor: 'gray', borderWidth: 1, color: 'gray' }}
        onChangeText={text => onChangeText(text)}
        value={value}
        editable = {textEditable}
      />

      <TouchableOpacity
        onPress={() => setTextEditable(false)}
        style={{ backgroundColor: '#01cdfe', margin: 20, padding: 20, marginRight:130, marginLeft:120 }}>
          <Text style={{ fontSize: 20, color: '#fffb96', fontFamily:'System' }}> submit name </Text>
      </TouchableOpacity>

      <View style={{marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
        <QRCode
          content={value ? value + "_food" : "invalid name"}
          />
      </View>

    </React.Fragment>

  );
}
