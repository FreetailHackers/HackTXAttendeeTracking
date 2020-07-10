import * as AlertFunction from '../utils/alertFunctions';
import {convertToBase64} from '../utils/utils';
import {AsyncStorage} from 'react-native';

const SERVER_URL = "http://demo-quill-2021.herokuapp.com"

function getRequest(url, onSuccess, onError) {
    return fetch(url)
        .then(response => response.json()
            .then(json => {
                if (response.ok)
                    return onSuccess(json)
                if (response.status == 400)
                    return Promise.reject(json)
                // otherwise use a generic error message
                return Promise.reject({})
            })
        )
        .catch(err => onError(err));
}

function payloadRequest(type, url, body, token, onSuccess, onError) {
    console.log("MAKING A REQUEST")
    return fetch(url, {
        method: type,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
        body: body ? JSON.stringify(body) : null})
        .then(response => response.json()
            .then(json => {
                if (response.ok)
                    return onSuccess(json)
                if (response.status == 400)
                    return Promise.reject(json)
                // otherwise use a generic error message
                return Promise.reject({})
            })
        )
        .catch(err => onError(err));
}

export async function signInUser(payload, onSuccess) {
    await payloadRequest('POST', SERVER_URL + '/auth/login', payload, null,
        async (data) => {
            // Stores auth-token if successful
            if(data.user.admin !== true && data.user.sponsor !== true) {
                AlertFunction.errorAlert("You need to be a admin or sponsor to use this app");
            } else {
                const user = data.user;
                const authToken = data.token;
                const mode = data.user.admin ? 'admin' : 'sponsor';
                const payload = {user, authToken, mode};
                AlertFunction.genericErrorWrapper( async () => {
                    await AsyncStorage.setItem('@curr_user', JSON.stringify(payload));
                    onSuccess(payload)
                })
            }
        },
        (err) => {
            AlertFunction.errorAlert(err.message ? err.message : "Invalid credentials")
        }
    );
}

export async function restoreUserSession(onSuccess) {
    AlertFunction.genericErrorWrapper(async () => {
        let user = await AsyncStorage.getItem('@curr_user');
        if (user) {
            onSuccess(JSON.parse(user))
        }
    })
}

export async function signOutUser(onCompletion) {
    AlertFunction.genericErrorWrapper(async () => {
        await AsyncStorage.removeItem('@curr_user');
        onCompletion()
    })
}

export async function markUser(id, route, token, onSuccess, onError) {
    await payloadRequest('PUT', SERVER_URL + "/api/users/" + id + "/" + route,
        null, token, onSuccess, 
        (err) => {
            AlertFunction.errorAlert(err.message ? err.message : undefined, [{text: "OK", onPress: onError}])
        }
    );
}

export async function getResume(id, onSuccess) {
    const url = SERVER_URL + "/api/users/" + id + "/resume"
    console.log("URL IS " + url)
    await getRequest(url, 
        (response) => onSuccess(convertToBase64(response.Body.data)),
        AlertFunction.errorAlert)
}

