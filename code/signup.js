import React from 'react';
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Image, Platform, Pressable } from 'react-native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import md5 from 'md5';
var jwt = require('jsonwebtoken');
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'



const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB


const windowWidth = Dimensions.get('screen').width;
const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };
const checkForChrInStr = (word,string) =>{
  let check = false
  if (string.indexOf(word) > -1) {
      check = true
  }
  return check
}

export default function SignUp({navigation}){

    const [email,setEmail] = React.useState('')
    const [frstName,setFrstName] = React.useState('')
    const [lstName,setLstName] = React.useState('')
    const [password,setPassword] = React.useState('')
    const [cpassword,setCPassword] = React.useState('')
    const [cantSee,setCantSee] = React.useState(true)
    const [cantSee2,setCantSee2] = React.useState(true)
    const [wrong,setWrong] = React.useState({id:'none',status:" "})
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

      let overCal = (((windowWidth*4.5/10)*9.5/10)*7.5/10)-77
      let nameInW = ((((windowWidth*4.5/10)*9.5/10)*7.5/10)/2)-8
      if (sessionStorage.getItem('number_id')) {
        navigation.navigate('home')
        }
      
      const Post_Data = () =>{
        if (checkForChrInStr('@',email) && !checkForChrInStr(' ',email) && !checkForChrInStr(' ',lstName) && !checkForChrInStr(' ',frstName) && email != '' && lstName != '' && frstName != '' && password != '' && !checkForChrInStr(' ',password)) {
          if (password == cpassword) {
            if (password.length >= 9) {
              axios({
                  method:'POST',
                  url:'http://192.168.1.3:4242/markit_hands_api',
                  headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                  data: JSON.stringify({"firstName":frstName,"lastName":lstName,"email":email,"password":md5(cpassword)})
                })
                .then(res=>{
                  console.log(res.data)
                  let response =  res.data
                  // console.log(base64.encode(response))
                  
                  jwt.verify(response, public_key, function(err, decoded) {
                    console.log(decoded)
                    if (decoded.status == 'redirecting...') {
                      setFrstName('')
                      setCPassword('')
                      setEmail('')
                      setLstName('')
                      setPassword('')
                      navigation.navigate('verify',{email:email})
                    }
                    // setWrong(decoded)
                  });
                  
                  // setCPasswordd(base64.decode(res.data))
                })

        }else{
          setWrong({id:'none',status:"password must be longer than 9 characters"})
        }
      }else{
          setWrong({id:'none',status:"passwords don't match"})
        }
      }else{
        setWrong({id:'none',status:"you left something empty"})
      }
      }
    //   console.log(windowWidth*4.5/10)
    return(
        <View style={{backgroundColor:'black',height:'100%',width:'100%',justifyContent:'center'}}>
            <View style={{backgroundColor:'black',width:'45%',alignSelf:'center',alignItems:'center',borderWidth:2,borderRadius:7,borderColor:'white',overflow:'hidden'}} >
                <View style={{width:'95%',alignItems:'center',backgroundColor:'black'}} >
                  <Text style={{color:wrong.id == 'none'?'#ff3a3a':'white',fontSize:18,fontFamily:'JL',marginTop:15}} >{wrong.status}</Text>
                <Image style={{tintColor:'white',height:125,marginTop:30,width:125,alignSelf:'center'}} source={require('../imgs/logo.png')} />
                    <Text style={{alignSelf:'center',fontSize:30,marginTop:14,fontFamily:'LG',color:'white'}} >Sign up on number</Text>
                    <TextInput value={email} onChangeText={(text)=>setEmail(text)} placeholder='email...' placeholderTextColor='white' style={{outlineStyle:'none',paddingHorizontal:20,width:'75%',height:55,borderWidth:2,alignSelf:'center',borderColor:wrong.status == 'email already exists'?'#ff3a3a':'white',marginTop:35,borderRadius:7,fontFamily:'JL',fontSize:20,backgroundColor:'rgba(0,0,0,0)',color:'white'}} />
                    <View style={{borderColor:'white',height:7,width:0,borderWidth:.8,borderRadius:10,alignSelf:'center',marginTop:3}}></View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} >
                        <TextInput value={frstName} onChangeText={(text)=>setFrstName(text)} placeholder='first name...' placeholderTextColor='white' style={{outlineStyle:'none',paddingHorizontal:20,width:nameInW,height:55,borderWidth:2,borderColor:'white',marginTop:3,borderRadius:7,fontFamily:'JL',fontSize:20,backgroundColor:'rgba(0,0,0,0)',color:'white'}} />
                        <View style={{borderColor:'white',height:20,width:0,marginHorizontal:6,borderWidth:.8,borderRadius:10,alignSelf:'center',marginTop:3}}></View>
                        <TextInput value={lstName} onChangeText={(text)=>setLstName(text)} placeholder='last name...' placeholderTextColor='white' style={{outlineStyle:'none',paddingHorizontal:20,width:nameInW,height:55,borderWidth:2,borderColor:'white',marginTop:3,borderRadius:7,fontFamily:'JL',fontSize:20,backgroundColor:'rgba(0,0,0,0)',color:'white'}} />
                    </View>
                    <View style={{borderColor:'white',height:7,width:0,borderWidth:.8,borderRadius:10,alignSelf:'center',marginTop:3}}></View>
                    <View style={{flexDirection:'row',alignSelf:'center',marginTop:3,borderWidth:2,borderRadius:7,borderColor:wrong.status == "password must be longer than 9 characters"|| wrong.status == "passwords don't match"?'#ff3a3a':'white',backgroundColor:'rgba(0,0,0,0)',width:'75%',height:55}} >
                        <TextInput value={password} style={Platform.select({web:{width:overCal,marginLeft:20,outlineStyle:'none',color:'white',backgroundColor:'rgba(0,0,0,0)',borderWidth:0,fontSize:20,fontFamily:'JL',}})} onChangeText={(text)=>setPassword(text)} secureTextEntry={cantSee}  placeholderTextColor='white' placeholder='password...' />
                        <TouchableOpacity style={{justifyContent:'center',paddingHorizontal:14}} onPress={()=>setCantSee(!cantSee)}>
                            <Image source={cantSee? require('../imgs/closed.png'):require('../imgs/openeye.png')} style={{tintColor:'white',height:25,width:25}} />
                        </TouchableOpacity>
                    </View>
                    <View style={{borderColor:'white',height:7,width:0,borderWidth:.8,borderRadius:10,alignSelf:'center',marginTop:3}}></View>
                    <View style={{flexDirection:'row',alignSelf:'center',marginTop:3,borderWidth:2,borderRadius:7,borderColor:wrong.status == "passwords don't match"?'#ff3a3a':'white',backgroundColor:'rgba(0,0,0,0)',width:'75%',height:55}} >
                        <TextInput value={cpassword} style={Platform.select({web:{width:overCal,marginLeft:20,outlineStyle:'none',color:'white',backgroundColor:'rgba(0,0,0,0)',borderWidth:0,fontSize:20,fontFamily:'JL',}})} onChangeText={(text)=>setCPassword(text)} secureTextEntry={cantSee2}  placeholderTextColor='white' placeholder='confirm password...' />
                        <TouchableOpacity style={{justifyContent:'center',paddingHorizontal:14}} onPress={()=>setCantSee2(!cantSee2)}>
                            <Image source={cantSee2? require('../imgs/closed.png'):require('../imgs/openeye.png')} style={{tintColor:'white',height:25,width:25}} />
                        </TouchableOpacity>
                    </View>
                    <View style={{borderColor:'white',height:7,width:0,borderWidth:.8,borderRadius:10,alignSelf:'center',marginTop:3}}></View>
                    <TouchableOpacity style={{marginTop:3,alignSelf:'center',paddingHorizontal:30,borderRadius:7,height:50,justifyContent:'center',backgroundColor:'white'}} onPress={()=>Post_Data()}  >
                        <Text style={{color:'black',fontFamily:'JL',fontSize:20}} >signup</Text>
                    </TouchableOpacity>
                    
                    <Pressable onPress={()=>navigation.navigate('login')} onHoverIn={()=>setHover('underline')} onHoverOut={()=>setHover('none')} style={{marginVertical:14,alignSelf:'center'}}>
                        <Text style={{color:'white',fontSize:18,fontFamily:'JL',textDecorationLine:hover}} >Already got a number?</Text>
                    </Pressable>
                </View>
                
            </View>
        </View>
    )
}