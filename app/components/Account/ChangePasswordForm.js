import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import {size} from "lodash";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";


export default function ChangePasswordForm(props) {
  const{setShowModal, toastRef}=props;

  const [showPassword, setShowPassword]= useState(false);
  const [formData, setFormData]= useState(defaultValue());
  const [errors, setErrors]= useState({});
  const [isLoading, setIsLoading]= useState(false);

  const onChange= (e, type)=>{
      setFormData({
        ...formData, [type]: e.nativeEvent.text
      });
  };

   const onSubmit= async ()=>{
     let isSetErrors=true;
      let errorsTemp={};

      setErrors({});

      if(!formData.password || !formData.newPassword || !formData.repeatNewPassword){
          errorsTemp={
            password:!formData.password ? "La contraseña no puede estar vacia" : "",
            newPassword:!formData.newPassword ? "La contraseña no puede estar vacia" : "",
            repeatNewPassword:!formData.repeatNewPassword ? "La contraseña no puede estar vacia" : "",
          };
      } else if(formData.newPassword !== formData.repeatNewPassword) {
            errorsTemp={
            newPassword:"Las contraseñas no son iguales",
            repeatNewPassword:"Las contraseñas no son iguales",
          };
      } else if(size(formData.newPassword) < 6 ){
            errorsTemp={
            newPassword:"Las contraseña tiene que ser mayor a 5 caracteres",
            repeatNewPassword:"Las contraseña tiene que ser mayor a 5 caracteres",
          };
      }else{
        setIsLoading(true);

        await reauthenticate(formData.password).then(async ()=> {
          
          await firebase.auth().currentUser.updatePassword(formData.newPassword).then(()=>{
            isSetErrors=false;
            setIsLoading(false);
            setShowModal(false);
            firebase.auth().signOut();
          }).catch(()=>{
            errorsTemp={
              other:"Error al actualizar la contraseña",
            };
            setIsLoading(false);
          });
            
        }).catch(()=> {

            errorsTemp={
              password:"La contraseña no es correcta"
            };

            setIsLoading(false);
        });
      }
      isSetErrors && setErrors(errorsTemp);
  };

  return(
      <View style={styles.view}>
        
    <Input 
      placeholder="Contraseña Actual"
      containerStyle={styles.input}
      password={true}
      secureTextEntry={showPassword ? false : true}
      rightIcon={{
        type: "material-community",
        name: showPassword ? "eye-off-outline" : "eye-outline" ,
        color:"#c2c2c2",
        onPress: ()=> setShowPassword(!showPassword),
      }}
      onChange={(e)=>onChange(e, "password")}
      errorMessage={errors.password}
    />

    <Input 
      placeholder="Nueva Contraseña"
      containerStyle={styles.input}
      password={true}
      secureTextEntry={showPassword ? false : true}
      rightIcon={{
        type: "material-community",
        name: showPassword ? "eye-off-outline" : "eye-outline" ,
        color:"#c2c2c2",
        onPress: ()=> setShowPassword(!showPassword),
      }}
      onChange={(e)=>onChange(e, "newPassword")}
      errorMessage={errors.newPassword}
    />

    <Input 
      placeholder="Repetir Nueva Contraseña"
      containerStyle={styles.input}
      password={true}
      secureTextEntry={showPassword ? false : true}
      rightIcon={{
        type: "material-community",
        name: showPassword ? "eye-off-outline" : "eye-outline" ,
        color:"#c2c2c2",
        onPress: ()=> setShowPassword(!showPassword),
      }}
      onChange={(e)=>onChange(e, "repeatNewPassword")}
      errorMessage={errors.repeatNewPassword}
    />

    <Button
        title="Cambiar Contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
    <Text>{errors.other}</Text>
      </View>
  );
}

function defaultValue() {
    return{
      password:"",
      newPassword:"",
      repeatNewPassword:""
    }
}


const styles = StyleSheet.create({
  view:{
    alignItems:"center",
    paddingTop:10,
    paddingBottom:10,
  },
  input:{
    marginBottom:10,
  },
  btnContainer:{
    marginTop:20,
    width:"95%",
  },
  btn:{
    backgroundColor:"#FC370C",
  }
});