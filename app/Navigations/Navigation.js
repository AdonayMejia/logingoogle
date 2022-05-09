import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { screen } from "../utils/ScreenName";

import {Icon} from "react-native-elements";
import RestaurantStack from "./RestaurantStack";
import FavoriteStack from "./FavoriteStack";
import AccountStack from "./AccountStack";
import SearchStack from "./SearchStack";
import TopRestaurantStack from "./TopRestaurantStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
    return(
        <NavigationContainer>
            <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarInactiveTintColor: "#646464",
                tabBarActiveTintColor: "#FC370C",
                tabBarIcon: ({color}) => screenOptions(route,color)
            })}
            >
            
                <Tab.Screen name={screen.restaurant.tab} 
                component={RestaurantStack} 
                options={{title:"Restaurantes", headerShown: false}}/>

                <Tab.Screen name={screen.favorites.tab} 
                component={FavoriteStack} 
                options={{title:"Favoritos", headerShown: false}}/>

                <Tab.Screen name={screen.ranking.tab} 
                component={TopRestaurantStack} 
                options={{title:"Top 5", headerShown: false}}/>

                <Tab.Screen name={screen.search.tab}
                component={SearchStack} 
                options={{title:"Buscador", headerShown: false}}/>

                <Tab.Screen name={screen.account.tab} 
                component={AccountStack} 
                options={{title:"Cuenta", headerShown: false}}/>    
            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color, size) {
  let iconName;

  if (route.name === screen.restaurant.tab) {
    iconName = "compass-outline";
  }

  if (route.name === screen.favorites.tab) {
    iconName = "heart-outline";
  }

  if (route.name === screen.ranking.tab) {
    iconName = "star-outline";
  }

  if (route.name === screen.search.tab) {
    iconName = "magnify";
  }

  if (route.name === screen.account.tab) {
    iconName = "home-outline";
  }
    return(
        <Icon type="material-community" name={iconName} size={22} color={color}/>
    ); 
}