import * as React from 'react';
import { Text, View, TextInput, StyleSheet, Button, Alert } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
//link: http://demo-quill-2021.herokuapp.com/api/users/5eceb473135347001747e45d/resume
export function resumeScreen() {
	return (
	    <PDFReader
	      source={{
	        uri: 'http://demo-quill-2021.herokuapp.com/api/users/5eceb473135347001747e45d/resume',
	      }}
	    />
	);
}