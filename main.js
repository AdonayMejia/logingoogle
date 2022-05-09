import React from "react";
import Splash from "./app/screens/Splash";
import Navigation from "./app/Navigations/Navigation";


export default class Main extends React.Component{

  constructor(props){
    super(props);
    this.state={currentScreen:"Splash"};
      setTimeout(()=>{

        this.setState({
          currentScreen:"Navigation"
        })

      },5000)
    
  }
  render(){
    const {currentScreen} = this.state;
    let mainScreen = currentScreen === "Splash" ? <Splash/> : <Navigation/>
    return mainScreen;
    
  }

}