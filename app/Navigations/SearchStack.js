import * as React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Search from "../screens/Search";
import { screen } from "../utils/ScreenName";

const Stack = createNativeStackNavigator();

export default function SearchStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name={screen.search.search}
                component={Search}
                options={{title:"Buscador"}}/>
        </Stack.Navigator>
    );
}