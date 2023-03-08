import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './code/login';
import Home from './code/home';
import First from './code/firstPage';
import SignUp from './code/signup';
import Verify_Email from './code/verify_email';
import Market from './code/market';
import Profile from './code/profile';
import Offer from './code/offer';
import Offers from './code/offers';
import OffersMade from './code/offersMade';
import Settings from './code/settings';
import Pay from './code/pay';
import PayOffer from './code/payOffer';
import List from './code/List';
import TNS from './code/tNs';


const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer linking={{config:{screens:{first:'/',login:'/login',home:'/home',signup:'/signup',market:'/market',profile:'/profile',offer:'/offer',offers:'/offers',offersmade:"/offersmade",settings:"/settings",pay:"/pay",payOffer:"/payoffer",list:'/list'}},prefixes:["http://number.na"]}} >
      <Stack.Navigator initialRouteName="first" screenOptions={{headerShown: false,animation:'none'}} >
        <Stack.Screen name="login" component={Login} options={{title:'Log in'}} />
        <Stack.Screen name="home" component={Home} options={{title:'Number'}}/>
        <Stack.Screen name="first" component={First} options={{title:'Number'}} />
        <Stack.Screen name="signup" component={SignUp} options={{title:'Sign up'}} />
        <Stack.Screen name="verify" component={Verify_Email} options={{title:'Verify'}} />
        <Stack.Screen name="market" component={Market} options={{title:'Market'}} />
        <Stack.Screen name="profile" component={Profile} options={{title:'Profile'}} />
        <Stack.Screen name="offer" component={Offer} options={{title:'Offer'}} />
        <Stack.Screen name="offers" component={Offers} options={{title:'Offers Taken'}} />
        <Stack.Screen name="offersmade" component={OffersMade} options={{title:'Offers Made'}} />
        <Stack.Screen name="settings" component={Settings} options={{title:'Settings'}} />
        <Stack.Screen name="pay" component={Pay} options={{title:'Pay'}} />
        <Stack.Screen name="payOffer" component={PayOffer} options={{title:'Pay'}} />
        <Stack.Screen name="list" component={List} options={{title:'List'}} />
        <Stack.Screen name="termsandservices" component={TNS} options={{title:'Terms'}} />
        {/* <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="list" component={List} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}