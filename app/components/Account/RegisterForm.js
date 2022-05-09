import React,{useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Icon, Button} from 'react-native-elements'
import Loading from "../Loading";
import {validateEmail} from "../../utils/validations";
import {size, isEmpty} from "lodash";
import * as firebase from "firebase";
import { useNavigation } from '@react-navigation/native';

export default function RegisterForm(props){
  console.log(props);
  const {toastRef}= props;
  const [showPassword,setShowPassword] = useState(false);
  const [showRepeatPasword,setShowRepeatPasword] = useState(false);
  const [formData,setFormData] = useState(defaultFormValue());
  const [loading, setLoading]= useState(false);
  const navigation = useNavigation();
  
  const onSubmit = ()=>{
   
    if(isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)){
      toastRef.current.show("Todos los campos son obligatorios");
    }else if(!validateEmail(formData.email)){
      toastRef.current.show("El correo ingresado es incorrecto");
    }else if(formData.password !== formData.repeatPassword){
      toastRef.current.show("Las contraseñas deben ser iguales.");
    }else if(size(formData.password)<6){
     toastRef.current.show("Debes ingresar una contraseña de al menos 6 caracteres");
    }
    else{
      setLoading(true);
     firebase
     .auth()
     .createUserWithEmailAndPassword(formData.email, formData.password)
     .then(() => {
       setLoading(false);
       navigation.navigate("account");
     })
     .catch(()=>{
        setLoading(false);
       toastRef.current.show("El correo ya se encuentra en uso, pruebe con otro.");
     })
    }
  };
  const onChange = (e, type) =>{
   setFormData({...formData,[type]: e.nativeEvent.text})
  };
  
  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electronico"
        containerStyle={styles.inputForm}
        onChange={e=> onChange(e,"email")}
        rightIcon={
          <Icon 
             type="material-community"
             name="at" 
             iconStyle={styles.iconRight} />}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        onChange={e=> onChange(e,"password")}
        password={true}
        secureTextEntry={showPassword ? false : true}
         rightIcon={
           <Icon 
              type="material-community"
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              iconStyle={styles.iconRight} 
              onPress={()=> setShowPassword(!showPassword)}
              />
              }
      />
      <Input
        placeholder="Repetir contraseña"
        containerStyle={styles.inputForm}
         onChange={e=> onChange(e,"repeatPassword")}
        password={true}
        secureTextEntry={showRepeatPasword ? false : true}
        rightIcon={
           <Icon 
              type="material-community"
              name={showRepeatPasword ? "eye-off-outline" : "eye-outline"} 
              iconStyle={styles.iconRight} 
               onPress={()=> setShowRepeatPasword(!showRepeatPasword)}
              />}
      />
      <Button
        title="Unirse"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Creando cuenta"/>
    </View>
  )
}

function defaultFormValue(){
  return{
    email:"",
    password:"",
    repeatPassword:""
  };
}

const styles = StyleSheet.create({
  formContainer:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
  },
  inputForm:{
    width:"100%",
    marginTop:20,
  },
  btnContainerRegister:{
    marginTop:20,
    width: "95%",

  },
  btnRegister:{
    backgroundColor:"#FC370C",
  },
  iconRight:{
    color:"#c1c1c1"
  }
});