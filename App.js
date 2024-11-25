import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import "react-native-gesture-handler";

import HomeScreen from "./screens/HomeScreen";
import FavouriteScreen from "./screens/FavouriteScreen";
import DetailScreen from "./screens/DetailScreen";
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          borderBottomWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favourite") {
            iconName = focused ? "heart" : "heart-outline";
          }else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{ headerShown: true }}
      />
       <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ 
          headerShown: true,
          headerTitle: "My Profile"
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
         <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}