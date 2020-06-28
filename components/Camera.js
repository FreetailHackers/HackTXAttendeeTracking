import * as React from 'react';
import { Alert, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-community/picker';
import AuthContext from '../context/AuthContext';

export default function AdminScreen() {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [mode, setMode] = React.useState(null);
  const [confirm, setConfirm] = React.useState(false);

  const {authToken} = React.useContext(AuthContext);
  const userMode = React.useContext(AuthContext).mode;

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
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
          {text: "Cancel", onPress: () => setScanned(false)},
          {text: "Confirm", onPress: () => {setConfirm(true); setScanned(false)}},
        ], {cancelable: false});
  }

  const handleBarCodeScanned = ({ type, data }) => {
    const REACT_NATIVE_SERVER_URL = "http://192.168.1.72:3000";
    setScanned(true);
    showAlert("Confirm Operation", "Please confirm that you are requesting the following action: " + mode);

    let json = JSON.parse(data);
    let attendee_id = json.id;
    if(confirm) {
      if(mode === "checkin") {
        console.log("woah");
        fetch(REACT_NATIVE_SERVER_URL + "/api/users/" + attendee_id + "/checkin", {
          method: 'POST',
          headers : {
            "x-access-token" : authToken
          }
        }).then(res => res.json()).then(res => console.log(res));
      }
      else if(mode === "lunch") {
        fetch(REACT_NATIVE_SERVER_URL + "/api/users/" + attendee_id + "/receivedlunch", {
          method: 'PUT',
          headers : {
            "x-access-token" : authToken
          }
        }).then(res => res.json()).then(res => res.message ? showAlert("" + res.message) : null)
      }
      else if(mode === "dinner") {
        fetch(REACT_NATIVE_SERVER_URL + "/api/users/" + attendee_id + "/receiveddinner", {
          method: 'PUT',
          headers : {
            "x-access-token" : authToken
          }
        }).then(res => res.json()).then(res => res.message ? showAlert("" + res.message) : null)
      }
      else if(mode === "profile") {

      }
      else if(mode === "table") {
        fetch(REACT_NATIVE_SERVER_URL + "/api/users/" + attendee_id + "/addtablevisited", {
          method: 'PUT',
          headers : {
            "x-access-token" : authToken
          }
        }).then(res => res.json()).then(res => console.log(res));
      }
      else if (mode === "workshop") {
        fetch(REACT_NATIVE_SERVER_URL + "/api/users/" + attendee_id + "/addworkshopattended", {
          method: 'PUT',
          headers : {
            "x-access-token" : authToken
          }
        }).then(res => res.json()).then(res => console.log(res));
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
        {userMode === "admin" ?
          <Picker
          selectedValue={mode}
          onValueChange={(itemValue, itemIndex) =>
            setMode(itemValue)
          }>
            <Picker.Item label="Check In" value="checkin" />
            <Picker.Item label="Mark Lunch" value="lunch" />
            <Picker.Item label="Mark Dinner" value="dinner" />
          </Picker>
          :
          <Picker
          selectedValue={mode}
          onValueChange={(itemValue, itemIndex) =>
            setMode(itemValue)
          }>
            <Picker.Item label="Profile" value="profile" />
            <Picker.Item label="Table" value="table" />
            <Picker.Item label="Workshop" value="workshop" />
          </Picker>
      }

      </View>
      <View style={{flexGrow : 1}}>
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          ratio='16:9'
          style={{flex: 1}}
        />
      </View>
    </View>
  );
}
