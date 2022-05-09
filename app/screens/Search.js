import React,{useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from "react-native";
import {SearchBar,ListItem,Icon,Avatar} from "react-native-elements";
import {FireSQL} from "firesql";
import * as firebase from "firebase";
import { screen } from "../utils/ScreenName";

const  fireSQL = new FireSQL(firebase.firestore(), {includeId: "id"});

export default function Search(props){
  const {navigation} = props;
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants]= useState([]);
 

  useEffect(()=>{
    if(search){
       fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
          .then((response) =>{
             setRestaurants(response);
          });
    }
  },[search]);

   
    return(
        <View>
        <SearchBar
        placeholder="Busca tu restaurante.."
        onChangeText={(e)=>setSearch(e)}
        value={search}
        containerStyle={styles.searchBar}
        />
        {restaurants.length === 0 ? (
          < NoFoundRestaurants/>
        ) : (
          <FlatList
            data={restaurants}
            renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation}/>}
            keyExtractor={(item,index)=> index.toString()}
          />
        )}
        </View>
    );
}


function NoFoundRestaurants(){
  return(
    <View style={{flex:1, alignItems: "center"}}>
    <Image 
      source={require("../../assets/img/no-result-found.png")}
      resizeMode="cover"
      style={{width:200, height:200}}
    />
  </View>
  );
}

function Restaurant(props){
  const {restaurant,navigation} = props;
  const {id,name,images} =  restaurant.item
 
 const goToRestaurant = (idRestaurant) => {
    navigation.navigate(screen.restaurant.tab, {
      screen: screen.restaurant.restaurant,
      params: {
        id: idRestaurant,
      },
    });
  };
  
  return(
    
    <ListItem 
    key={id}
    bottomDivider
    onPress={() => goToRestaurant (id)}
    >
    <Avatar source={{ uri: images[0] }} rounded />
        <ListItem.Content>
            <ListItem.Title>{name}</ListItem.Title>
        </ListItem.Content>
        <Icon type="material-community" name="chevron-right" />
    </ListItem>

    
  );
}

const styles = StyleSheet.create({
  searchBar:{
    marginBottom:20
  }
})