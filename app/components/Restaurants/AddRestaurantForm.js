import React, {useState,useEffect} from 'react';
import { StyleSheet, View , ScrollView,Alert,Dimensions, Text,ToastAndroid} from 'react-native';
import { Input, Icon, Button,Avatar,Image } from 'react-native-elements';
import {map, size, filter} from "lodash";
import { Camera } from 'expo-camera';
import * as Permissions from "expo-permissions";
import * as  ImagePicker from "expo-image-picker";
import * as Location  from "expo-location";
import MapView from 'react-native-maps';
import Modal from "../Modal";
import {firebaseApp} from "../../utils/firebase";
import * as firebase from "firebase";
import "firebase/storage";
import "firebase/firestore";
import uuid from "random-uuid-v4";
const db =firebase.firestore(firebaseApp);


const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props){
   
  const {toasRef,setIsLoading,navigation} = props;
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress,setRestaurantAddress] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [imageSelected,setImagesSelected]= useState([]);
  const [isVisibleMap,setIsVisibleMap] = useState(false);
  const [locationRestaurant,setLocationRestaurant]= useState(null);



  const addRestaurante = () =>{
  if(!restaurantName && !restaurantAddress && !restaurantDescription){
     ToastAndroid.show('Todos los campos del formulario son obligatorios', ToastAndroid.LONG);
  
  }else if(size(imageSelected) ===0){
     ToastAndroid.show('El restaurante debe tener al menos una foto!', ToastAndroid.LONG);
    

  }else if(!locationRestaurant){
     ToastAndroid.show('Tienes que localizar el restaurante en el mapa!', ToastAndroid.LONG);
   
  }else{
    //console.log("Restaurante guardado");
    setIsLoading(true);
    uploadImageStorage().then((response)=>{
    

       db.collection("restaurants")
        .add({
          name: restaurantName,
          address: restaurantAddress,
          description: restaurantDescription,
          location: locationRestaurant,
          images: response,
          rating:0,
          ratingTotal:0,
          quantityVoting: 0,
          createAt: new Date(),
          createBy: firebase.auth().currentUser.uid,
        })
        .then(()=>{
          setIsLoading(false);
          navigation.navigate("restaurants");
        }).catch(()=>{
          setIsLoading(false);
          ToastAndroid.show('Error al subir el restaurante, intentelo nuevamente!', ToastAndroid.LONG);
        })
    });
   
  }
   
  };

  const uploadImageStorage= async ()=>{
  const imageBlob =[];
   await Promise.all(
     map(imageSelected, async (image) =>{
      const response = await fetch(image);
      const blob = await response.blob();
        const ref = firebase.storage().ref("restaurants").child(uuid());
        await ref.put(blob).then( async result =>{
          await firebase
                .storage()
                .ref(`restaurants/${result.metadata.name}`)
                .getDownloadURL()
                .then(photoURL => {
                  imageBlob.push(photoURL)
                })
        });
    })
    );

   
    return imageBlob;
  };
  return(
    <ScrollView style={styles.scrollView}>
    <ImagenRestaurante imagenRestaurant={imageSelected[0]}/>
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddress ={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
      />
      <UploadImage 
      toasRef={toasRef} 
      imageSelected={imageSelected} 
      setImagesSelected={setImagesSelected}
     
      />
      <Button
        title="Crear Restaurante"
        onPress={addRestaurante}
        buttonStyle={styles.btnAddRestaurant}
      />
      <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap} setLocationRestaurant={setLocationRestaurant} toasRef={toasRef}/>
    </ScrollView>
  );
}

function ImagenRestaurante(props){
  const {imagenRestaurant}= props;

  return(
    <View style={styles.viewPhoto}>
      <Image 
        source={imagenRestaurant ? {uri:imagenRestaurant} :require("../../../assets/img/no-image.png")}
        style={{width:widthScreen, height:200}}
      />
    </View>
  )
}

function FormAdd(props){
  const {
    setRestaurantName,
    setRestaurantAddress,
    setRestaurantDescription,
    setIsVisibleMap,
    locationRestaurant
  } = props;
  return(
    <View style={styles.viewForm}>
        <Input
          placeholder="Nombre del restaurante"
          containerStyle={styles.input}
          onChange={(e)=>setRestaurantName(e.nativeEvent.text)}
        />
        <Input
          placeholder="Dirección"
          containerStyle={styles.input}
          onChange={(e)=>setRestaurantAddress(e.nativeEvent.text)}
          rightIcon={{
            type:"material-community",
            name:"google-maps",
            color:locationRestaurant ? "#FC370C": "#c2c2c2",
            onPress:()=>setIsVisibleMap(true)
          }}
        />
        <Input
          placeholder="Descripción"
          multiline={true}
          containerStyle={styles.textArea}
          onChange={(e)=>setRestaurantDescription(e.nativeEvent.text)}
        />
    </View>
  )
}

function Map(props){
 const {isVisibleMap, setIsVisibleMap,setLocationRestaurant, toasRef}= props;
 const [location,setLocation]= useState(null);


useEffect (()=>{
  (async ()=>{
    const resultPermissions = await Permissions.askAsync( Permissions.LOCATION);
    const statusPermissions = resultPermissions.permissions.location.status;

    if(statusPermissions !== "granted"){
       ToastAndroid.show('Tiene que aceptar los permisos', ToastAndroid.LONG);
    //console.log("Tiene que aceptar los permisos");
    }else{
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude:loc.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta:0.001,
      });
    }
  })()
},[])

const confirmLocation = () =>{
  setLocationRestaurant(location);
   ToastAndroid.show('Localizacion guardada exitosamente!!', ToastAndroid.LONG);
  setIsVisibleMap(false);
}

 return(
   <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
    <View>
      {location &&(
        <MapView
        style={styles.mapStyle}
        initialRegion={location}
        showsUserLocation={true}
        onRegionChange={(region)=>setLocation(region)}
        >
        <MapView.Marker
          coordinate={{
            latitude:location.latitude,
            longitude:location.longitude
          }}
          draggable
        />
      
        </MapView>
      )}
      <View style={styles.viewMapBtn}>
          <Button
          title="Guardar Ubicacion"
          containerStyle={styles.viewMapBtnContainerSave}
          buttonStyle={styles.viewMapBtnSave}
          onPress={confirmLocation}
          />
           <Button
          title="Cancelar Ubicacion"
          containerStyle={styles.viewMapBtnContainerCancel}
          buttonStyle={styles.viewMapBtnCancel}
          onPress={()=>setIsVisibleMap(false)}
          />
      </View>
    </View>
   </Modal>
 )

}

function UploadImage(props){
  const {toasRef,imageSelected, setImagesSelected} = props;

  const imgSelect= async ()=>{
    const resultPermissions = await Camera.requestCameraPermissionsAsync(
      Camera.CAMERA_ROLL
    );
    if(resultPermissions === "denied"){
      toasRef.current.show("Es necesario aceptar los permisos de la galeria", 3000);
    }else{
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect:[4,3]
      });
      
      if(result.cancelled){
        toasRef.current.show("Has cerrado la galeria sin selecionar una imagen",2000);
      }
      else{
       setImagesSelected([...imageSelected,result.uri])
      }
    }
  };

  const removeImage = (image) =>{
   
    Alert.alert(
      "Eliminar Imagen",
      "¿Estas seguro que quieres eliminar la imagen?",
      [
        {
          text:"Cancel",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress:()=>{
            setImagesSelected(
               filter(imageSelected, (imageUrl)=>imageUrl !== image)
            );
          },
        },
      ],
      {cancelable:false}
    )

  };

  return(
    <View style={styles.viewImages}>
    {size(imageSelected)< 4 && (
    <Icon 
        type="material-community"
        name="camera"
        color="#7a7a7a"
        containerStyle={styles.containerIcon}
        onPress={imgSelect}
      />
    )}
      
      {map(imageSelected, (imageRestaurant,index)=>(
        <Avatar
          key={index}
          style={styles.miniaturaStyle}
          source={{uri:imageRestaurant}}
          onPress={()=>removeImage(imageRestaurant)}
        />
      ))}
    </View>
  )
}



const styles = StyleSheet.create({
  scrollView:{
    height:"100%",
  },
  viewForm:{
    marginLeft:10,
    marginRight:10
  },
  input:{
    marginBottom:10,
  },
  textArea:{
    height: 100,
    width:"100%",
    padding: 0,
    margin:0
  },
  btnAddRestaurant:{
    backgroundColor:"#FC370C",
    margin:20
  },
  viewImages:{
    flexDirection:"row",
    marginLeft:20,
    marginRight:20,
    marginTop:30
  },
  containerIcon:{
    alignItems:"center",
    justifyContent:"center",
    marginRight:10,
    height:70,
    width:70,
    backgroundColor:"#e3e3e3"
  
  },
  miniaturaStyle:{
    width:70,
    height:70,
    marginRight:10
  },
  viewPhoto:{
    alignItems: "center",
    height: 200,
    marginBottom:20
  },
  mapStyle:{
    width:"100%",
    height:550
  },
  viewMapBtn:{
    flexDirection: "row",
    justifyContent: "center",
    marginTop:10
  },
  viewMapBtnContainerCancel:{
    paddingLeft:5
  },
  viewMapBtnCancel:{
    backgroundColor:"#a60d0d"
  },
  viewMapBtnContainerSave:{
    paddingRight:5
  },
  viewMapBtnSave:{
    backgroundColor:"#0000FF"
  }
});
