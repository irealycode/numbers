import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function Settings(){

    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) { 
        return null;
      }
    return(
        <View style={{alignItems:'center',backgroundColor:'black',height:'100%'}} >
            <ScrollView>
                
            </ScrollView>
        </View>
    )
}