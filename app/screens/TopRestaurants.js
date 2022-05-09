import React, {useEffect, useState, useRef} from 'react';
import {View} from "react-native";
import Toast from "react-native-easy-toast";
import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";
import {firebaseApp} from "../utils/firebase";
import * as firebase from "firebase";
import "firebase/storage";
import "firebase/firestore";

const db =firebase.firestore(firebaseApp);

export default function TopRestaurants(props){

  const { navigation } = props;

  const [restaurants, setRestaurants] = useState([]);

  const toastref = useRef(); 


  useEffect(()=>{

    db.collection("restaurants")
    .orderBy("rating", "desc")
    .limit(5)
    .get()
    .then((response)=>{
      const restaurantArray=[];
      response.forEach((doc)=>{
        const data = doc.data();
        data.id = doc.id;
        restaurantArray.push(data);

      });
      setRestaurants(restaurantArray);
    });

  },[]);

    return(
        <View>
            <ListTopRestaurants
            restaurants={restaurants}
            navigation={navigation}
            />
            <Toast
            ref={toastref} 
            position="center"
            opacity={0.9}
            />
        </View>
    );
}