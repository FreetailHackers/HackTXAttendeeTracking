import * as React from 'react';
import { Alert, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Picker } from '@react-native-community/picker';

export function addUser(user){

    const requestOptions = {
        method: 'POST',
        headers: {'arg1': user },
        queryParams: JSON.stringify({ arg1: user })
    };

    fetch('https://webhooks.mongodb-stitch.com/api/client/v2.0/app/hacktxapp-dufgi/service/add_user/incoming_webhook/webhook0?arg1='+user, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          console.log(data.hasOwnProperty("error"))
          if (data.hasOwnProperty("error")){
            alert("User already added!")
          }else{
            alert("User added!")
          }

        }
      );
}

export function setFoodCheckIn(user) {

  const requestOptions = {
      method: 'POST',
      headers: {'arg1': user },
      queryParams: JSON.stringify({ arg1: user })
  };

  fetch('https://webhooks.mongodb-stitch.com/api/client/v2.0/app/hacktxapp-dufgi/service/get_user/incoming_webhook/webhook0?arg1='+user, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.hasOwnProperty("error")){
          alert("Internal error!")
        } else{
          console.log(data["matchedCount"]["$numberInt"])
          console.log(data["modifiedCount"]["$numberInt"])
          if (data["matchedCount"]["$numberInt"] == 0) {
            alert('Person has not checked in!')
          }
          else if (data["modifiedCount"]["$numberInt"] == 0 ) {
              alert('This person has already received his food!')
          }
          else {
              alert("Success! This person can get their food! ")
          }
        }

      }
    );

}

export function clearDatabase(){

    const requestOptions = {
        method: 'POST',
        headers: {},
        queryParams: JSON.stringify({})
    };

    fetch('https://webhooks.mongodb-stitch.com/api/client/v2.0/app/hacktxapp-dufgi/service/clear_database/incoming_webhook/webhook0', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.hasOwnProperty("error") || data.hasOwnProperty("message")){
            alert("Internal Error!")
          }else{
            alert("Database cleared! Removed " + data["deletedCount"]["$numberInt"] + " entries.")
          }

        }
      );
}

export default function AdminScreen() {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [mode, setMode] = React.useState("checkin");
  const [confirm, setConfirm] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const showAlert = (title, message) => {
      Alert.alert(
        title,
        message,
        [
          {text: "Confirm", onPress: () => {setConfirm(true); setScanned(false)}},
          {text: "Cancel", onPress: () => setScanned(false)}
        ], {cancelable: false});
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    showAlert("Confirm Operation", "Please confirm that you are requesting the following action: " + mode);
    console.log(data);

    // if (data.includes("_hack")) {
    //   data = data.slice(0, -5);
    //   addUser(data);
    // }
    // if (data.includes("_food")) {
    //   data = data.slice(0, -5);
    //   setFoodCheckIn(data);
    // }
    // if (data.includes("clear")) {
    //   clearDatabase();
    // }
    if(confirm) {
      if(mode === "checkin") {

      }
      else if(mode === "food") {
  
      }
      else if(mode === "profile") {
  
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <View>
        <Picker
          selectedValue={mode}
          onValueChange={(itemValue, itemIndex) => 
            setMode(itemValue)
          }>
          <Picker.Item label="Check In" value="checkin" />
          <Picker.Item label="Food" value="food" />
          <Picker.Item label="Get Profile" value="profile" />
        </Picker>
      </View>
      <View style={{flexGrow : 1}}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{flex: 1}}
        />
      </View>
    </View>
  );
}
