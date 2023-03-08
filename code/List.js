import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Image, Dimensions, ScrollView,Pressable } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
let number_of_D_H = Math.trunc(width/230)
let Hor = []
let Ver = []
let number_of_D_V
export default function List({navigation}){

    const [market,setMarket] = React.useState({})
    const [marketList,setMarketList] = React.useState([])
    const [USDtoETH,setUSDtoETH] = React.useState()
    const [refresh,setRefresh] = React.useState(false)
    const isInitialMount = React.useRef(true);
    const [number,setNumber] = React.useState([])

    React.useEffect(()=>{
        if (isInitialMount.current) {
            isInitialMount.current = false
            axios({
                method:'GET',
                url:'http://127.0.0.1:4242/numbers_taken',
                
            })
            .then(res=>{
                let response =  res.data
                
                
                number_of_D_V = response.numbers.length/number_of_D_H
                for (let iees = 0; iees < Math.trunc(number_of_D_V); iees++) {
                    Ver.push(iees)
                }
                if (number_of_D_V != Math.trunc(number_of_D_V)) {
                    Ver.push(0)
                }
                for (let ieesh = 0; ieesh < number_of_D_H; ieesh++) {
                    Hor.push(ieesh)
                }
                setNumber(response.numbers)
                setRefresh(!refresh)
                console.log(response.numbers)
            })
        }
            

    })
    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) {
        return null;
      }
    let height_from_top = -270
    let num_index = -1

    try { 
        return(
            <View style={{backgroundColor:'black',flex:1,width:'100%',overflow:'hidden',height:height}} >
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{width:width,backgroundColor:'black'}} >
                    {
                        Ver.map((im,key)=>{
                            height_from_top += 380
                                return(
                                    <View key={key} style={{flexDirection:'row',position:'absolute',top:height_from_top,justifyContent:'center',alignItems:'center',alignContent:'center',alignSelf:'center',paddingVertical:30,marginBottom:100}} >
                                        {
                                            Hor.map((il,key1)=>{
                                                num_index +=1
                                                
                                                if (num_index < number.length) {
                                                    let ok = number[num_index]
                                                    
                                                    return(
                                                        <View key={key1} style={{marginBottom:30}}>
                                                            <View style={{justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',borderRadius:20,width:230,height:230,alignItems:'center'}} >
                                                                <View style={{height:'100%',width:'100%',position:'absolute',overflow:'hidden',justifyContent:'center',alignItems:'center',alignContent:'center'}}  >
                                                                        <View style={{justifyContent:'center',alignContent:'center',width:'100%',height:'100%'}} >
                                                                            <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                                                            <Text style={{fontFamily:'BB',fontSize:35,color:'white',position:'absolute',alignSelf:'center'}} >{ok}</Text>
                                                                            
                                                                        </View>
                                                                </View>
                                                                
                                                            </View>
                                                        </View>
                                                    )
                                                }else{
                                                    return null
                                                }
                                            })
                                        }
                                    </View>
                                )
                        })
                    
                    }
                </View>
                </ScrollView>
                <Pressable onPress={()=>navigation.navigate('home')} style={{backgroundColor:'black',height:70,width:'100%',top:0,position:"absolute",shadowColor: "#000",shadowOffset: {width: 0,height: 30,},shadowOpacity: 1,shadowRadius: 30.00,elevation: 14,}} >
                    <Image style={{tintColor:'white',height:70,width:70,alignSelf:'center'}} source={require('../imgs/logo.png')} />
                </Pressable>
            </View>
        )
    } catch (error) {
        return null
    }
}