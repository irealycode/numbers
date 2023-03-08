import React from 'react';
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Image, Platform, Button } from 'react-native';
import { useFonts } from 'expo-font';
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'
let jwt = require('jsonwebtoken')
import axios from 'axios';
import { Hoverable, Pressable} from 'react-native-web-hover'

const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB
export default function Pay({navigation,route}){
    const {data} = route.params;
    const [amount,setAmount] = React.useState()
    const [email,setEmail] = React.useState()
    const [offer,setOffer] = React.useState({"price":""})
    const [confirmed,setConfirmed] = React.useState(false)



    React.useEffect(()=>{
        (async()=>{
            const user_data = await jwt.verify(data, public_key,{algorithm:"RS256"})
                setOffer(user_data)
                axios({
                    method:'POST',
                    url:'http://127.0.0.1:4242/numbers_api',
                    headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                        },
                    data: {"data":jwt.sign({'id':user_data.id},private_key,{algorithm:"RS256"})}
                  })
                  .then(res=>{
                    let response =  res.data
                    if (response.prf.balance) {
                        if (convert(response.prf.balance) >= convert(user_data.price)) {
                            setConfirmed(true)
                        }
                        setAmount(response.prf.balance)
                        setEmail(response.prf.email)
                    }
                  })
              
        })()
    },[])
    const checkOffer = async()=>{
        let istrue = false
          await axios({
            method:'GET',
            url:'http://127.0.0.1:4242/market_api',
            timeout: 5000
          })
          .then(res=>{
            let response = res.data
            try {
                response[offer.number]
                istrue = true
            } catch {
                istrue = false
            }
          })
          return istrue
    }
    const buy = async()=>{
        const check = await checkOffer()
        if (check) {
                if (true) {
                    axios({
                        method:'POST',
                        url:'http://127.0.0.1:4242/buying_w_number_done',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        data: {"data":jwt.sign(offer,private_key,{algorithm:"RS256"})}
                    })
                    .then(res=>{
                        let response = res.data
                        if (response == 'done') {
                            window.opener.postMessage({'status':'done'}, '*')
                            window.close()
                        }else{
                            window.opener.postMessage({'status':'rejected'}, '*')
                        }
                        //   setBuyPrice(response[number].price)
                    })
                    
                }
        }
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
    return(
        <View style={{maxWidth:430,maxHeight:650,width:'100%',height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:'black',borderWidth:2,borderColor:'white'}} >
            <Image style={{tintColor:'white',position:"absolute",height:70,top:20,width:70,alignSelf:'center'}} source={require('../imgs/logo.png')} />
            {/* <Button title='pay' onPress={()=>window.opener.postMessage({'name':data}, '*')} /> */}
            <Text style={{fontFamily:'BB',fontSize:30,color:'white',marginBottom:20}} >wallet</Text>
            <Text style={{fontFamily:'JL',fontSize:20,color:'white'}} >{email}</Text>
            
            <Text style={{fontFamily:'BB',fontSize:25,color:'white',marginTop:15}} >balance: {amount}$</Text>
            {/* <Text style={{fontFamily:'BB',fontSize:25,color:'white'}} >-</Text> */}
            <Text style={{fontFamily:'BB',fontSize:25,color:'white'}} >number price: {offer.price}$</Text>
            <View style={{width:'100%',justifyContent:'center',position:'absolute',bottom:15,flexDirection:'row'}} >
                <Pressable onPress={()=>{window.opener.postMessage({'status':'rejected'}, '*');window.close()}} style={{width:'45%'}}>
                {({hovered})=>(
                    <View  style={{backgroundColor:hovered?'#DF2935':'black',paddingHorizontal:20,paddingVertical:7,borderRadius:11,borderWidth:2,borderColor:'#DF2935'}}>
                        <Text style={{fontFamily:'BB',fontSize:25,color:!hovered?'#DF2935':'black',alignSelf:'center'}} >Reject</Text>
                    </View>
                )}
                </Pressable>
                <View style={{width:15}} ></View>
                <Pressable onPress={()=>buy()} disabled={!confirmed} style={{width:'45%'}}>
                {({hovered})=>(
                    <View   style={{backgroundColor:hovered?'#7FF341':'black',paddingHorizontal:20,paddingVertical:7,borderRadius:11,borderWidth:2,borderColor:confirmed?'#7FF341':'#bdfd9b'}}>
                        <Text style={{fontFamily:'BB',fontSize:25,color:confirmed?!hovered?'#7FF341':'black':'#bdfd9b',alignSelf:'center'}} >confirm</Text>
                    </View>
                )}
                </Pressable>
                
                
            </View>
            
        </View>
    )
}