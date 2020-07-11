# HackTX Attendee Tracking App

We use this app for retrieving and updating information about our attendees the day-of.

## Configure/Setup

Make sure that the following are installed and configured for your respective device

React Native (the cli, not Expo)
npm (should come with node.js)
cocoapods (only needed for iOS development, can only be done through a Mac)
First install all dependencies
```
npm install
```
For iOS, install all cocoapods dependencies
```
cd ios
pod install
cd ..
```
Then, run the following command in 1 window
```
npx react-native start
```
Finally, run the either of the following commands in another window, depending on which device you wish to work on the app. Make sure when testing that the device is on the same connection as the server. If you are unable to log into due to a failed request, make sure you have Quill set up, and try starting the Metro bundler with the cache reset (npx react-native start --reset-cache)
```
npx react-native run-android
npx react-native run-ios
```
