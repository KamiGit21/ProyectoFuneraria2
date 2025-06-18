// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import RegisterScreen from "./RegisterScreen";
import CartScreen from "./CartScreen";
import SearchObituaryScreen from "./SearchObituaryScreen";
import Products from "./Products";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Buscar" component={SearchObituaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
