import {Alert} from 'react-native';

export function showAlert(title, message, options) {
    Alert.alert(title, message, options, {cancelable: false});
}

export function errorAlert(message = "Something went wrong", options = [{"text": "OK"}]) {
    showAlert("Uh oh", message, options)
}

/**
 * tries to execute an asynchronos function, and displays a generic error alert if fails
 * only to be used with asynchronous function
 * @param {Function} func 
 */
export async function genericErrorWrapper(func) {
    try {
        await func()
    } catch (err) {
        errorAlert()
    }
}