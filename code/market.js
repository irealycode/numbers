import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Image, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { Hoverable, Pressable, } from 'react-native-web-hover'
var jwt = require('jsonwebtoken')
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'



const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB


let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
let number_of_D_H = Math.trunc(width/230)
let Hor = []
let Ver = []
let number_of_D_V

export default function Market({navigation}){



    let reload = [1]
    const [market,setMarket] = React.useState({})
    const [marketList,setMarketList] = React.useState([])
    const [USDtoETH,setUSDtoETH] = React.useState()
    const [refresh,setRefresh] = React.useState(false)
    const isInitialMount = React.useRef(true);
    const [number,setNumber] = React.useState([])

    React.useEffect(()=>{
        if (isInitialMount.current) {
            if (sessionStorage.getItem('number_id')) {
                let data = sessionStorage.getItem('number_id')
                jwt.verify(data, public_key, function(err, decoded) {
                  axios({
                    method:'POST',
                    url:'http://127.0.0.1:4242/numbers_api',
                    headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                        },
                    data: {"data":jwt.sign({'id':decoded.id},private_key,{algorithm:"RS256"})}
                  })
                  .then(res=>{
                    let response =  res.data
                    setNumber(response.prf.number)
                  })
                });
              }else{
                navigation.navigate('login')
              }
            axios({
                method:'GET',
                url:'http://127.0.0.1:4242/market_api',
                timeout:5000
              })
              .then(res=>{
                setMarket(res.data)
                setMarketList(Object.keys(res.data))
                number_of_D_V = Object.keys(res.data).length/number_of_D_H
                for (let iees = 0; iees < Math.trunc(number_of_D_V); iees++) {
                    Ver.push(iees)
                }
                if (number_of_D_V != Math.trunc(number_of_D_V)) {
                    Ver.push(0)
                }
                for (let ieesh = 0; ieesh < number_of_D_H; ieesh++) {
                    Hor.push(ieesh)
                }
                
                axios({
                    method:'GET',
                    url:'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=75e74f8b4589e03d22517b822652d52b6fc5d58da38021b11500973b4f4d0778',
                    timeout:5000
                  })
                  .then(res=>{
                    setUSDtoETH(res.data.USD)
                    setRefresh(!refresh)
                  })
                  setRefresh(!refresh)
              })
              setRefresh(!refresh)
              isInitialMount.current = false
            
        }
    })
    const retry = async() =>{
        if (sessionStorage.getItem('number_id')) {
            let data = sessionStorage.getItem('number_id')
            jwt.verify(data, public_key, function(err, decoded) {
              axios({
                method:'POST',
                url:'http://127.0.0.1:4242/numbers_api',
                headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                data: {"data":jwt.sign({'id':decoded.id},private_key,{algorithm:"RS256"})}
              })
              .then(res=>{
                let response =  res.data
                setNumber(response.prf.number)
              })
            });
          }else{
            navigation.navigate('login')
          }
        axios({
            method:'GET',
            url:'http://127.0.0.1:4242/market_api',
            timeout:5000
          })
          .then(res=>{
            setMarket(res.data)
            setMarketList(Object.keys(res.data))
            number_of_D_V = Object.keys(res.data).length/number_of_D_H
            for (let iees = 0; iees < Math.trunc(number_of_D_V); iees++) {
                Ver.push(iees)
            }
            if (number_of_D_V != Math.trunc(number_of_D_V)) {
                Ver.push(0)
            }
            for (let ieesh = 0; ieesh < number_of_D_H; ieesh++) {
                Hor.push(ieesh)
            }
            
            axios({
                method:'GET',
                url:'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=75e74f8b4589e03d22517b822652d52b6fc5d58da38021b11500973b4f4d0778',
                timeout:5000
              })
              .then(res=>{
                setUSDtoETH(res.data.USD)
                setRefresh(!refresh)
              })
              setRefresh(!refresh)
          })
          setRefresh(!refresh)
    }
    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) {
        return null;
      }
    function convert(x) {
        var floatValue = +(x);
        return floatValue;
    }
    function contains(list,item){
        if (list.indexOf(item) >= 0) {
            return true
        }else{
            return false
        }
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
                            if (market[marketList[0]]["price"] && USDtoETH) {
                                return(
                                    <View key={key} style={{flexDirection:'row',position:'absolute',top:height_from_top,justifyContent:'center',alignItems:'center',alignContent:'center',alignSelf:'center',paddingVertical:30,marginBottom:100}} >
                                        {
                                            Hor.map((il,key1)=>{
                                                num_index +=1
                                                
                                                if (num_index < marketList.length) {
                                                    let num_A = marketList[num_index]
                                                    let price
                                                    let price_dlr
                                                    try {
                                                        price_dlr = market[num_A]["price"]
                                                        price = (convert(price_dlr)/USDtoETH).toString().split(".")[0]+'.'+(convert(price_dlr)/USDtoETH).toString().split(".")[1].slice(0,3)
                                                    } catch{
                                                        price_dlr = 'loading...'
                                                        price = "lodaing..."
                                                    }
                                                    
                                                    return(
                                                        <View key={key1} style={{marginBottom:30}}>
                                                            <View style={{justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',borderRadius:20,width:230,height:230,alignItems:'center'}} >
                                                                <Pressable disabled={contains(number,num_A)} onPress={()=>{navigation.navigate('offer',{number:num_A})}} style={{height:'100%',width:'100%',position:'absolute',overflow:'hidden',justifyContent:'center',alignItems:'center',alignContent:'center'}}  >
                                                                    {({hovered})=>(
                                                                        <View style={{justifyContent:'center',alignContent:'center',width:'100%',height:'100%'}} >
                                                                            <Image source={hovered?require('../imgs/layerdTicket1.png'):contains(number,num_A)?require('../imgs/layerdTicket2.png'):require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                                                            <Text style={{fontFamily:'BB',fontSize:35,color:'white',position:'absolute',alignSelf:'center'}} >{num_A}</Text>
                                                                            {
                                                                                contains(number,num_A)?
                                                                                <View style={{position:'absolute',left:60,transform: [{ rotate: '-90deg' }]}} >
                                                                                    <Text style={{fontFamily:'BB',fontSize:35,color:hovered?'#1ea2ff':'#7ff341',position:'absolute',alignSelf:'center',bottom:0}} >owned</Text>
                                                                                </View>:null
                                                                            }
                                                                            
                                                                        </View>

                                                                    )}
                                                                </Pressable>
                                                                {/* <View style={{position:'absolute',bottom:-35}} >
                                                                    <Text style={{fontFamily:'JL',fontSize:19,color:'white'}} >{market[num_A]["price"]}$</Text>
                                                                </View> */}
                                                                <Pressable style={{position:'absolute',bottom:-35,flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center',alignSelf:'center'}} >
                                                                    {({hovered})=>{
                                                                        if (!hovered) {
                                                                            return(
                                                                                <View style={{flexDirection:'row'}} >
                                                                                    <Text style={{fontFamily:'JL',fontSize:19,color:'white'}} >{price}</Text>
                                                                                    <Image style={{height:20,width:20,tintColor:'white'}} source={require('../imgs/eth.png')} />
                                                                                </View>
                                                                            )   
                                                                        }else{
                                                                            return(
                                                                                <Text style={{fontFamily:'JL',fontSize:19,color:'white'}} >{price_dlr}$</Text>
                                                                            )
                                                                        }
                                                                    }}
                                                                </Pressable>
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
                            }else{
                                return null
                            }
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
// (convert(price)/USDtoETH).toString().split(".")[0]+'.'+(convert(price)/USDtoETH).toString().split(".")[1].slice(0,2)