import * as React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { screen } from "../utils/ScreenName";
import Account from "../screens/Account/Account";
import Login from "../screens/Account/Login";
import Register from "../screens/Account/Register"

const Stack = createNativeStackNavigator();

export default function AccountStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name={screen.account.account}
                component={Account}
                options={{title:"Mi cuenta"}}/>
            <Stack.Screen
                name={screen.account.login}
                component={Login}
                options={{title:"Iniciar Sesion"}}
            />
            <Stack.Screen
              name={screen.account.register}
              component={Register}
              options={{title:"Registro"}}
            />
        </Stack.Navigator>
    );
}