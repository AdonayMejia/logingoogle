import React, {useState,useRef, useCallback} from 'react';
import {StyleSheet,View, Text,FlatList,ActivityIndicator,TouchableOpacity,Alert} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {Image,Button,Icon} from "react-native-elements";
import Loading from "../components/Loading";
import Toast from "react-native-easy-toast";
import {firebaseApp} from "../utils/firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import { screen } from "../utils/ScreenName";

const db =firebase.firestore(firebaseApp);

export default function Favorites(props){
  
  const {navigation} = props;
  const [restaurants,setRestaurants] = useState(null);
  const [userLogged,setUserLogged] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [reloadData,setReloadData]=useState(false)
  const toasRef= useRef();

  console.log(restaurants);

   firebase.auth().onAuthStateChanged((user)=>{
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(()=>{
      if(userLogged){
        const idUser=firebase.auth().currentUser.uid;
        db.collection("favorites")
        .where("idUser", "==", idUser)
        .get()
        .then((response)=>{
          const idRestaurantsArray = [];
          response.forEach((doc) =>{
            idRestaurantsArray.push(doc.data().idRestaurant)
      });
      getDataRestaurant(idRestaurantsArray).then((response)=>{
        const restaurants = [];
        response.forEach((doc)=>{
          const restaurant = doc.data();
          restaurant.id =doc.id;
          restaurants.push(restaurant);
        });
        setRestaurants(restaurants)

      });
     
     });
    }
    setReloadData(false);
  },[userLogged,reloadData])
);


const getDataRestaurant = (idRestaurantsArray) => {
  const arrayRestaurants = [];
  idRestaurantsArray.forEach((idRestaurant) =>{
    const result = db.collection("restaurants").doc(idRestaurant).get();
    arrayRestaurants.push(result);

  })
  return Promise.all(arrayRestaurants);//Esperar a que se obtengan todos los datos del restaurante

};

if(!userLogged){
  return <UserNoLoggeed navigation={navigation}/>
}

 if(restaurants?.length === 0){
  return <NotFoundRestaurants/>
}

    return(
        <View style={styles.viewBody}>
           {restaurants ? (
            <FlatList
              data={restaurants}
              renderItem={(restaurant)=><Restaurant restaurant={restaurant} 
              setIsLoading={setIsLoading}
               toasRef={toasRef}
               setReloadData={setReloadData}
               navigation={navigation}/>}
              keyExtractor={(item,index)=> index.toString}
            />
           ): (
             <View style={styles.loaderRestaurant}>
              <ActivityIndicator size="large"/>
              <Text style={{textAlign:"center"}}>Cargando Restaurantes</Text>
             </View>
           )}
           <Toast ref={toasRef} position="center" opacity={0.9}/>
           <Loading
            text="Eliminando Restaurante" isVisible={isLoading}
           />
        </View>
    );
}

function NotFoundRestaurants(){
  return(
    <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
     <Icon type="material-community" name="alert-outline" size={50}/>
     <Text style={{fontSize:20, fontWeight:"bold"}}>No tienes restaurantes en tu lista</Text>
    </View>
  )
}
function UserNoLoggeed(props){
  const {navigation} = props;

  
  const goToLogin = () => {
    navigation.navigate(screen.account.tab, {
      screen: screen.account.login,
    });
  };

  return(
    <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
      <Icon type="material-community" name="alert-outline" size={50}/>
      <Text style={{fontSize:20, fontWeight:"bold",textAlign:"center"}}>Necesitas estar logeado para esta sesión</Text>
      <Button
        title="Ir al Login"
        containerStyle={{marginTop:20, width:"80%"}}
        buttonStyle={{backgroundColor:"#FC370C"}}
        onPress={goToLogin}
      />
    </View>
  )
}
function Restaurant(props){
  const {restaurant,setIsLoading,toasRef,setReloadData,navigation} = props;
  const {id,name,images} =restaurant.item;

  const confirmRomoveFavorite =()=>{
    Alert.alert(
      "Eliminar Restaurante de Favoritos",
      "¿Estas seguro de que quieres eliminar el restaurante de favoritos?",
      [
        {
          text:"Cancelar",
          style:"cancel"
        },
        {
          text:"Eliminar",
          onPress: removeFavorite
        }
      ],
      {cancelable:false}
    )
  }

 const removeFavorite = () =>{
   setIsLoading(true);
    db.collection("favorites")
    .where("idRestaurant","==",id)
    .where("idUser","==", firebase.auth().currentUser.uid)
    .get()
    .then((response)=>{
      response.forEach((doc)=>{
        const idFavorite = doc.id;
        db.collection("favorites")
        .doc(idFavorite)
        .delete()
        .then(()=>{
          setIsLoading(false);
          setReloadData(true);
          toasRef.current.show("Restaurante Eliminado correctamente!!");
        })
        .catch(()=>{
          setIsLoading(false);
          toasRef.current.show("Error al eliminar el restaurante");
        })
      })
    }) 
  };
   const goToRestaurant = (idRestaurant) => {
    navigation.navigate(screen.restaurant.tab, {
      screen: screen.restaurant.restaurant,
      params: {
        id: idRestaurant,
      },
    });
  };

  return(
    <View  style={styles.restaurant}>
      <TouchableOpacity  onPress={() => goToRestaurant (id)} >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff"/>}
          source={
            images[0]
            ? {uri: images[0]}
            : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon type="material-community" 
          name="heart"  
          color="#f00" 
          containerStyle={styles.favorites}
          onPress={confirmRomoveFavorite}
          underlayColor="transparent"
          
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
viewBody:{
  flex:1,
  backgroundColor:"#f2f2f2"
},
loaderRestaurant:{
  marginTop:10,
  marginBottom:10
},
restaurant:{
  margin:10
},
image:{
  width:"100%",
  height:180
},
info:{
flex:1,
alignItems:"center",
justifyContent:"space-between",
flexDirection:"row",
paddingLeft:20,
paddingRight:20,
paddingTop:10,
paddingBottom:10,
marginTop:-30,
backgroundColor:"#fff"
},
name:{
  fontWeight:"bold",
  fontSize:20
},
favorites:{
  marginTop:-35,
  backgroundColor:"#fff",
  padding:15,
  borderRadius:100
}
})