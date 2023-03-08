import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Image, Platform, Pressable } from 'react-native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import md5 from 'md5';
import axios from 'axios';
import CryptoJS from 'crypto-js';
var jwt = require('jsonwebtoken');


const windowWidth = Dimensions.get('screen').width;
const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };
export default function Login({navigation}){
    
    const [email,setEmail] = React.useState('')
    const [password,setPassword] = React.useState('')
    const [cantSee,setCantSee] = React.useState(true)
    const [wrong,setWrong] = React.useState(' ')
    const [titleH,setTitleH] = React.useState(50)
    const [hover,setHover] = React.useState(false)

    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) {
        return null;
      }

      let overCal = (((windowWidth*6/10)*4/10)*7.5/10)-77


      if (sessionStorage.getItem('number_id')) {
        navigation.navigate('home')
        }
        
      const login_post = () =>{
        axios({
            method:'POST',
            url:'http://127.0.0.1:4242/markit_ears_api',
            headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
            data: JSON.stringify({'email':email,'password':md5(password)})
          })
          .then(res=>{
            let response =  res.data
            if (response != 'wrong email or password'){
                sessionStorage.setItem('number_id',response)
                navigation.navigate('home')
            }else{
                setWrong(response)
            }
            console.log(response)
            setPassword('')
            setEmail('')
            // setCPasswordd(base64.decode(res.data))
          })
      }
      
   
    // setCircle(circleW+.2)
    return(
        <View style={{backgroundColor:'black',height:'100%',width:'100%',justifyContent:'center'}}>
            <View style={{backgroundColor:'white',flexDirection:'row',height:'70%',width:'60%',alignSelf:'center',borderWidth:2,borderRadius:7,borderColor:'white',overflow:'hidden'}} >
                <View style={{width:'40%',height:'100%',justifyContent:'center',backgroundColor:'black'}} >
                    <Text style={{alignSelf:'center',fontSize:30,fontFamily:'LG',color:'white'}} >Log in</Text>
                    <TextInput value={email} onChangeText={(text)=>setEmail(text)} placeholder='email...' placeholderTextColor='white' style={{outlineStyle:'none',paddingHorizontal:20,width:'75%',height:55,borderWidth:2,alignSelf:'center',borderColor:wrong == 'wrong email or password'?'#ff3a3a':'white',marginTop:35,borderRadius:7,fontFamily:'JL',fontSize:20,backgroundColor:'rgba(0,0,0,0)',color:'white'}} />
                    <View style={{borderColor:'white',height:7,width:0,borderWidth:.8,borderRadius:10,alignSelf:'center',marginTop:3}}></View>
                    <View style={{flexDirection:'row',alignSelf:'center',marginTop:3,borderWidth:2,borderRadius:7,borderColor:wrong == 'wrong email or password'?'#ff3a3a':'white',backgroundColor:'rgba(0,0,0,0)',width:'75%',height:55}} >
                        <TextInput value={password} returnKeyType='done' onSubmitEditing={()=>login_post()} style={Platform.select({web:{width:overCal,marginLeft:20,outlineStyle:'none',color:'white',backgroundColor:'rgba(0,0,0,0)',borderWidth:0,fontSize:20,fontFamily:'JL',}})} onChangeText={(text)=>setPassword(text)} secureTextEntry={cantSee}  placeholderTextColor='white' placeholder='password...' />
                        <TouchableOpacity style={{justifyContent:'center',paddingHorizontal:14}} onPress={()=>setCantSee(!cantSee)}>
                            <Image source={cantSee? require('../imgs/closed.png'):require('../imgs/openeye.png')} style={{tintColor:'white',height:25,width:25}} />
                        </TouchableOpacity>
                    </View>
                    <View style={{borderColor:'white',height:7,width:0,borderWidth:.8,borderRadius:10,alignSelf:'center',marginTop:3}}></View>
                    <TouchableOpacity style={{marginTop:3,alignSelf:'center',paddingHorizontal:30,borderRadius:7,height:50,justifyContent:'center',backgroundColor:'white'}} onPress={()=>login_post()}  >
                        <Text style={{color:'black',fontFamily:'JL',fontSize:20}} >login</Text>
                    </TouchableOpacity>
                    
                    <Pressable onHoverIn={()=>setHover('underline')} onHoverOut={()=>setHover('none')} style={{marginTop:14,alignSelf:'center'}} onPress={()=>navigation.navigate('signup')}>
                        <Text style={{color:'white',fontSize:18,fontFamily:'JL',textDecorationLine:hover}} >New to number?</Text>
                    </Pressable>
                </View>
                <View style={{width:'60%',height:'100%',justifyContent:'center',backgroundColor:'black'}} >
                <View style={{position:'absolute',height:'150%',width:'150%',backgroundColor:'white',borderRadius:1000}} ></View>
                    <Image style={{tintColor:'black',position:"absolute",height:125,top:55,width:125,alignSelf:'center'}} source={require('../imgs/logo.png')} />
                    {/* <Text style={{alignSelf:'center',marginTop:20,fontFamily:'LG',fontSize:70,top:50,position:'absolute',color:'black'}} >pim</Text> */}
                    <View style={{position:'absolute',width:'75%',alignSelf:'center'}}>
                        <Text style={{fontSize:37,fontFamily:'LG',color:'black',alignSelf:'center',textAlign:'center'}} >Your trading journey starts here</Text>
                        <Text style={{fontSize:20,fontFamily:'JL',color:'black',marginTop:7,alignSelf:'center'}} >trade your lucky number</Text>
                    </View>
                    
                    {/* <Text style={{width:'75%',position:'absolute',fontSize:20,fontFamily:'JL',color:'black',alignSelf:'center'}} >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum varius duis at consectetur lorem. A cras semper auctor neque vitae. Imperdiet dui accumsan sit amet.</Text> */}
                    
                </View>
            </View>
        </View>
    )
}