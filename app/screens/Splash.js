import React from "react";
import {View, Image, ImageBackground} from "react-native";
import Navigation from "../Navigations/Navigation";


export default class Splash extends React.Component{
  constructor(props){
    super(props);
    this.state={fontLoaded:false}
  }

  render(){
    return(
      <View>
        <ImageBackground source={require("../../assets/SaborcitoSplash.png")}
        style={{width:"100%", height:"100%"}}/>
      </View>
    )
  }
}
