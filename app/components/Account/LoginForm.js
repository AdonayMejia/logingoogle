import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import Loading from "../Loading";
import {isEmpty} from "lodash";
import { useNavigation } from '@react-navigation/native';
import * as firebase from "firebase";
import {validateEmail} from "../../utils/validations";


export default function LogingForm(props) {
 const {toastRef}= props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading]= useState(false);
  const navigation = useNavigation();


  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    if(isEmpty(formData.email) || isEmpty(formData.password)){
     toastRef.current.show("Todos los campos son obligatorios");
    }else if(!validateEmail(formData.email)){
      toastRef.current.show("El correo ingresado es invalido");
    }else{
       setLoading(false);
      firebase
      .auth()
      .signInWithEmailAndPassword(formData.email, formData.password)
      .then(()=>{
         setLoading(false);
        navigation.navigate("account");
      })
      .catch(()=>{
         setLoading(true);
        toastRef.current.show("Correo o contraseña incorrecto");
      })
    }
  };
  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electronico"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, 'email')}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, 'password')}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Button
        title="Iniciar Sesión"
        containerStyle={styles.btnContainerLoging}
        buttonStyle={styles.btnLogin}
        onPress={onSubmit}
      />
       <Loading isVisible={loading} text="Iniciando Sesion"/>
    </View>
  );
}

function defaultFormValue() {
  return {
    email: '',
    password: '',
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  inputForm: {
    width: '100%',
    marginTop: 20,
  },
  btnContainerLoging: {
    marginTop: 20,
    width: '95%',
  },
  btnLogin: {
    backgroundColor: '#FC370C',
  },
  iconRight: {
    color: '#c1c1c1',
  },
});
