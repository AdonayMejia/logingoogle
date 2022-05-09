import React, { useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './app/Navigations/Navigation';
import { firebaseApp } from './app/utils/firebase';
import * as firebase from 'firebase';
import Main from "./main"

export default function App() {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
    });
  }, []);
  return <Main />;
}
