import React,{useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Button, Avatar, Rating} from 'react-native-elements';
import {map} from "lodash";
import {firebaseApp} from "../../utils/firebase";
import * as firebase from "firebase";
import "firebase/storage";
import "firebase/firestore";
import { screen } from "../../utils/ScreenName";

const db =firebase.firestore(firebaseApp);

export default function ListReviews(props){
  const {navigation,idRestaurant,setRating} = props;

  const [userLogged, setUserLogged] = useState(false);
  const [reviews, setReviews] = useState([]);

  firebase.auth().onAuthStateChanged((user)=>{
     user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(()=>{
      db.collection("reviews").where("idRestaurant","==",idRestaurant).get()
      .then((response)=>{
        const resultReview = [];
        response.forEach(doc =>{
            const data = doc.data();
            data.id = doc.id;
            resultReview.push(data);
        });
        setReviews(resultReview);
      });
  }, []);


  const goToLogin = () => {
    navigation.navigate(screen.account.tab, {
      screen: screen.account.login,
    });
  };
  return(

    <View>
        {userLogged ? (
          <Button
          title="Escriba su opinion"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type:"material-community",
            name:"square-edit-outline",
            color:"#FC370C"

          }}
          onPress={()=> navigation.navigate("add-review-restaurant", {
            idRestaurant: idRestaurant,

          })}
          />
        ) : (
          <View>
            <Text
              style={{textAlign:"center",color:"#FC370C", padding:20}}
              onPress={goToLogin} >Para escribir un comentario es necesario iniciar sesión{" "}
              <Text
              style={{fontWeight:"bold"}}
              >
                  Pulsa aquí para iniciar sesión            
              </Text>
            </Text>
          </View>
        )}

        {
          map(reviews, (review, index)=>(
              <Review
              key={index}
              review={review}
              />
          ))
        }

    </View>

  );
}

function Review(props){
const { title, review, rating, createAt, avatarUser } = props.review;


return(
  <View style={styles.viewReview}>
    <View style={styles.viewImageAvatar}>
      <Avatar
      size="large"
      rounded
      containerStyle={styles.imageAvatarUser}
      source={avatarUser ? {uri: avatarUser} : require("../../../assets/img/avatar-default.jpg")}
      />
    </View>

    <View style={styles.viewInfo}>

    <Text style={styles.reviewTitle}>{title}</Text>
    <Text style={styles.reviewText}>{review}</Text>
    <Rating
    imageSize={15}
    startingValue={rating}
    readonly
    />

    </View>

  </View>
)
}

const styles= StyleSheet.create({
  btnAddReview:{
    backgroundColor:"transparent",
  },
  btnTitleAddReview:{
    color:"#FC370C",
    },
    viewReview:{
      flexDirection:"row",
      padding:10,
      paddingBottom:20,
      borderBottomColor:"#e3e3e3",
      borderBottomWidth:1
    },
    viewImageAvatar:{
      marginRight:15
    },
    imageAvatarUser:{
      width:50,
      height:50
    },
    viewInfo:{
      flex:1,
      alignItems:"flex-start"
    },
    reviewTitle:{
      fontWeight:"bold"
    },
    reviewText:{
      paddingTop:2,
      color:"grey",
      marginBottom:5
    },
});