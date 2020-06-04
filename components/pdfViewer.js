import * as React from 'react';
import { Text, View, TextInput, StyleSheet, Button, Alert } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';

export default class viewResumePDFScreen extends React.Component {
  // const requestOptions = {
  //   method: 'GET',
  //   headers: {':id' : user}
  // };
  // fetch('https://localhost:3000/api/users/:id/resume', requestOptions)
  render() {
  	return (
	    <PDFReader
	      source={{
	        uri: 'http://gahp.net/wp-content/uploads/2017/09/sample.pdf',
	      }}
	    />
	  );
	}
}