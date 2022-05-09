import React from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import {Image} from "react-native-elements";
import { size } from "lodash";
import {useNavigation} from "@react-navigation/native";

export default function ListRestaurants(props) {

  const { restaurants, handlerLoadMore, isLoading } = props; 
  const navigation= useNavigation();

  return (
    <View style={styles.container}>
      {size(restaurants) > 0 ? (
        <FlatList
        data={restaurants}
        renderItem={(restaurant)=> <Restaurant restaurant={restaurant} navigation={navigation}/>}
        keyExtractor={(item , index)=> index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={handlerLoadMore}
        ListFooterComponent={<FooterList isLoading={isLoading}/>}
        
        />
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator
            size="large"
            color="#000"
          />
          <Text>Cargando Restaurantes</Text>
        </View>
      )}
    </View>
  );
}


function Restaurant(props) {
  const {restaurant, navigation} = props;
  const {id, images, name, description, address } = restaurant.item;
  const imagesRestaurants=images[0];


  const goRestaurant = ()=>{

    navigation.navigate("restaurant", {
      id,
      name,
    });
  }

  return(
    <TouchableOpacity onPress={goRestaurant}>
      <View style={styles.viewRestaurants}>
        <View style={styles.viewRestaurantsImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#000"/>}
            source={
              imagesRestaurants ? {uri:imagesRestaurants}
              : require("../../../assets/img/no-image.png")
            }
            style={styles.imagesRestaurants}
          />
        </View>

        <View>
          <Text style={styles.restaurantName}>{name}</Text>
          <Text style={styles.restaurantAddress}>{address}</Text>
          <Text style={styles.restaurantDescription}>{description.substr(0,60)}...</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

}

 function FooterList(props){
    const {isLoading} = props;

    if(isLoading){
      return(
        <View style={styles.loaderRestaurants}>
            <ActivityIndicator
            size="large"
            color="#000"
          />    
        </View>
      )
    } else{
       return(
        <View style={styles.notFoundRestaurants}>
          <Text>No quedan Restaurantes por cargar</Text>   
        </View>
      )
    }
  }

const styles=StyleSheet.create({
loaderRestaurants:{
  marginTop:10,
  marginBottom:10,
  alignItems:"center",
},
viewRestaurants:{
  flexDirection:"row",
  margin:10,
},
viewRestaurantsImage:{
  marginRight:15,
},
imagesRestaurants:{
  height:80,
  width:80,
},
restaurantName:{
  fontWeight:"bold",
},
restaurantAddress:{
  paddingTop:2,
  color:"grey",
},
restaurantDescription:{
  paddingTop:2,
  color:"grey",
  width:300,
},
notFoundRestaurants:{
  marginTop:10,
  marginBottom:20,
  alignItems:"center",
}

});