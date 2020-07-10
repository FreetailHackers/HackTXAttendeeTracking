import React, {useEffect} from 'react';
import {Text, View, Platform, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
import DropDownPicker from 'react-native-dropdown-picker';
import AuthContext from '../context/AuthContext';
import {admin_options, sponsor_options} from './ScanOptions.json';
import {showAlert, errorAlert} from '../utils/alertFunctions';
import {markUser} from '../services/UserService';

export default function Camera({navigation}) {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [mode, setMode] = React.useState(0);

  const {authToken} = React.useContext(AuthContext);
  const userOptions = React.useContext(AuthContext).mode === 'admin' ?
    admin_options : sponsor_options;

  useEffect(() => {
    const onfocus = navigation.addListener('focus', () => {
        // when coming back to this screen, set scanned to false
        setScanned(false);
    });
    (async () => {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      const status = await check(permission);
      if (status === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        // need to request permission
        const status2 = await request(permission);
        setHasPermission(status2 === RESULTS.GRANTED);
      }
    })();
    return onfocus;
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned == true) return;
    setScanned(true);
    // create alert
    try {
      const attendee_id = JSON.parse(data).id;
      if (attendee_id === undefined)
        throw new Error();
      // ask the user to confirm whether they want to scan
      showAlert("Confirm Action", "Are you sure you want to " + userOptions[mode]['label'] + "?",
        [{text: "Cancel", onPress: () => {setScanned(false);}},
         {text: "Confirm", onPress: () => {markUserPressed(attendee_id);}}]
      );
    } catch (err) {
        errorAlert("Invalid QRCode Scanned", [{text: "OK", onPress: () => {setScanned(false);}}]);
    }
  }

  const markUserPressed = (attendee_id) => {
      markUser(attendee_id, userOptions[mode]['route'], authToken,
          (json) => {
              let options = [{text: "OK", onPress: () => {setScanned(false)}}]
              if (json.profile && json.profile.resume)
                  options.push({text: "View Resume", onPress: () => {moveToResume(json.id)}})
              showAlert("Success!", "Successfully marked", options)
          },
          () => {setScanned(false)}
      )
  }

  const moveToResume = (id) => {
    navigation.navigate('Resume', {"id": id})
  }

  return (
    <SafeAreaView style={hasPermission ? styles.container : styles.centeredContainer}>
      {!hasPermission ? <Text>No Access to Camera</Text>
        :
      <>
      <StatusBar translucent backgroundColor="transparent" />
      <DropDownPicker
        items={userOptions}
        defaultValue={userOptions[0]['value']}
        containerStyle={styles.picker}
        captureAudio={false}
        onChangeItem={newmode => parseInt(setMode(newmode.value))}
      />
      <RNCamera
        ref={ref => { this.camera = ref;}}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        style={styles.camera}
        onBarCodeRead={handleBarCodeScanned}>
      </RNCamera>
      </>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  centeredContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  picker: {
    height: 50,
    width: '90%',
    position: 'absolute',
    marginTop: 50,
    marginLeft: '5%',
    marginRight: '5%',
    zIndex: 1,
    elevation: 1
  },

  camera: {
    flex: 1,
    width: '100%',
  }
})
