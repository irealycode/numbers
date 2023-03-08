import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View,Image,TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
var jwt = require('jsonwebtoken');
import { Hoverable, Pressable } from 'react-native-web-hover'
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'



const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB
let i = 0;
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

let counting = false;
let selected = false;
let verified = false;
let code = 0
export default function Verify_Email({route, navigation}){

    const { email } = route.params;
    const [ver_code,setCode] = React.useState('')
    const [wrong,setWrong] = React.useState(' ')
    const [number,setNumber] = React.useState(0)
    const [num,setNum] = React.useState('')

    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) {
        return null;
      }
      

      const verify = () =>{
        axios({
            method:'POST',
            url:'http://192.168.1.3:4242/markit_verify_api',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
            data: JSON.stringify({'email':email,'code':ver_code})
        })
        .then(res=>{
            console.log(res.data)
            let response =  res.data
            setWrong(response)
            if (response != 'wrong code.') {
                verified = true
                code = ver_code
                setCode('')
                setNum(response)
            }
            console.log(response)
            })
      }
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }


      const registerNumber = (num) =>{
        let data1 = JSON.stringify({'email':email,'number':num,'code':code})
        let data2 = jwt.sign(data1,private_key,{ algorithm: 'RS256'})
        axios({
            method:'POST',
            url:'http://192.168.1.3:4242/markit_number_api',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
            data: {'num_id':data2}
        })
        .then(res=>{
            let response =  res.data
                
        })
      }
      
      if (i<100 && counting) {
        wait(80).then(()=>{
          i += 1
          setNumber(getRandomInt(10000))
        })
      }else if(i >= 80 && counting && !selected) {
          selected = true
          setNumber(num)
      }
      
    if (!verified) {
    return(
        <View style={{height:'100%',width:'100%',backgroundColor:'black',justifyContent:'center',alignContent:'center',alignItems:'center'}} >

                <Image style={{tintColor:'white',height:125,marginBottom:30,width:125,alignSelf:'center'}} source={require('../imgs/logo.png')} />
                <Text style={{fontFamily:'JL',fontSize:24,color:'white',marginBottom:14}} >Please verify your email</Text>
                <TextInput value={ver_code} onChangeText={(text)=>setCode(text)} keyboardType='number-pad' maxLength={5} style={{width:200,fontFamily:'JL',fontSize:24,paddingHorizontal:20,paddingVertical:14,marginBottom:14,color:'white',borderWidth:2,borderRadius:7,borderColor:wrong != ' '? '#ff3a3a':'white'}}  placeholderTextColor='white' placeholder='code...' />
                <Pressable onPress={()=>verify()} style={{backgroundColor:'white',borderRadius:7,paddingHorizontal:20,paddingVertical:7}} >
                    <Text style={{fontSize:24,color:'black',fontFamily:'JL'}} >verify</Text>
                </Pressable>
                
        </View>
    )}else{
        return(
            <View style={{backgroundColor:'black',height:'100%',width:'100%',justifyContent:'center',alignContent:'center'}} >
                <View style={{alignSelf:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',borderRadius:20,width:350,height:350,alignItems:'center'}}>
                    <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%',position:'absolute'}} />
                {
                    counting?<View>
                                <Text style={{fontFamily:'BB',fontSize:45,color:'white'}} >{number}</Text>
                            </View>:
                    <TouchableOpacity onPress={()=>{counting=true;setNumber(53)}} style={{alignSelf:'center',borderRadius:7,paddingVertical:11}} >  
                    <Text style={{fontFamily:'LG',color:'white',fontSize:35}} >number?</Text>
                </TouchableOpacity>
                }
                </View>
            </View>
        )
    }
}