import React from 'react';
import {StyleSheet,View, Text} from 'react-native';
import {Avatar} from "react-native-elements";
import * as firebase from "firebase";
import { Camera } from 'expo-camera';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";


export default function InfoUser(props){
  const {
    userInfo: {uid ,photoURL,displayName, email},
    toastRef,
    setLoading,
    setLoadingText,
    } = props;


    const imgSelect= async ()=>{
    const resultPermissions = await Camera.requestCameraPermissionsAsync(
      Camera.CAMERA
    );
    if(resultPermissions === "denied"){
      toastRef.current.show("Es necesario aceptar los permisos de la galeria", 3000);
    }else{
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect:[4,3]
      });

      if(result.cancelled){
        toastRef.current.show("Has cancelado la seleccion de imagenes");
      } else{
          uploadImage(result.uri).then(()=>{
            updatePhotoUrl();
          }).catch(()=>{
            toastRef.current.show("Error al subir el avatar");
          })
      }
      
    }
  };

  const uploadImage= async (uri)=>{
    setLoadingText("Actualizando avatar");
    setLoading(true);

    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blob);
  };
    
  const updatePhotoUrl= ()=>{
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response)=>{
          const update = {
            photoURL: response,
          };
          await firebase.auth().currentUser.updateProfile(update);
          setLoading(false);
      })
      .catch(()=>{
        toastRef.current.show("Error al actualizar el avatar");
      })
  }

  console.log(photoURL);
  console.log(displayName);
  console.log(email);
  return(
    <View style={styles.viewUserInfo}>
      <Avatar 
      rounded
      size="large"
      showEditButton
      onPress={imgSelect}
      containerStyle={styles.userInfoAvatar}
      source={
        photoURL ? {uri: photoURL}:
        require("../../../assets/img/avatar-default.jpg")
      }/>
      <View>
        <Text style={styles.displayName}>
          {
            displayName ? displayName : "Anónimo"
          }
        </Text>
        <Text>
          { email ? email : "Social Login"}
        </Text>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  viewUserInfo:{
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row",
    backgroundColor:"#f2f2f2",
    paddingTop:30,
    paddingBottom:30,
  },
  userInfoAvatar:{
    marginRight:20,
    backgroundColor:"#666561" 
  },
  displayName:{
    fontWeight:"bold",
    paddingBottom:10,
  }

});