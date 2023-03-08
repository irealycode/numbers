import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Animated,StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Image, Button } from 'react-native';
import axios from 'axios';
var jwt = require('jsonwebtoken');
import { useFonts } from 'expo-font';
import { Hoverable, Pressable, ScrollView, } from 'react-native-web-hover'
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'
import { Dimensions } from 'react-native';
import { ethers } from 'ethers';

const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB


let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
let number_of_D_H = Math.trunc(width/230)
let Hor = []
let Ver = []
let number_of_D_V
let open = false
export default function Profile({navigation}){
    const [number,setNumber] = React.useState()
    const [userData,setUserdata] = React.useState()
    const [USDtoETH,setUSDtoETH] = React.useState()
    const [refresh,setRefresh] = React.useState(false)
    const [price1,setPrice1] = React.useState('')
    const [inputWIdth,setInputWidth] = React.useState({txtWidth:65})
    const [showLoad,setLoadShow] = React.useState(false)
    const [user_id,setId] = React.useState('')
    const Mout = React.useRef(new Animated.Value(-120)).current;
    const isInitialMount = React.useRef(true);


    React.useEffect(()=>{
        if (isInitialMount.current) {
            if (sessionStorage.getItem('number_id')) {
                let data = sessionStorage.getItem('number_id')
                jwt.verify(data, public_key, function(err, decoded) {
                  setId(decoded.id)
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
                        number_of_D_V = response.prf.number.length/number_of_D_H
                        for (let iees = 0; iees < Math.trunc(number_of_D_V); iees++) {
                            Ver.push(iees)
                        }
                        if (number_of_D_V != Math.trunc(number_of_D_V)) {
                            Ver.push(0)
                        }
                        for (let ieesh = 0; ieesh < number_of_D_H; ieesh++) {
                            Hor.push(ieesh)
                        }
                        setNumber(response.prf.number)
                        setUserdata(response)
                        console.log(response.prf.number)
                      })
                      
                });
              }else{
                navigation.navigate('login')
              }
              axios({
                method:'GET',
                url:'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=75e74f8b4589e03d22517b822652d52b6fc5d58da38021b11500973b4f4d0778',
                timeout:1000
              })
              .then(res=>{
                setUSDtoETH(res.data.USD)
              })
            isInitialMount.current = false
        }
    },[])

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
                    setUserdata(response)
                    console.log(response.prf.number)
                  })
                  
            });
          }else{
            navigation.navigate('login')
          }
          axios({
            method:'GET',
            url:'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=75e74f8b4589e03d22517b822652d52b6fc5d58da38021b11500973b4f4d0778',
            timeout:1000
          })
          .then(res=>{
            setUSDtoETH(res.data.USD)
          })
    }

    function convert(x) {
        var floatValue = +(x);
        return floatValue;
    }
    const pullOut = () => {
      // Will change Mout value to 1 in 5 seconds
      Animated.timing(Mout, {
        toValue: 70,
        duration: 500,
      }).start();
      
    };
  
    const pullIn = () => {
      // Will change Mout value to 0 in 3 seconds
      Animated.timing(Mout, {
        toValue: -120,
        duration: 500,
      }).start();
    };

    const load = async() =>{
      if (price1 != "") {
      if (convert(price1) >=5) {
      let ether_string = price1
      let ether = (convert(ether_string)/USDtoETH).toString()
            try {
              if (!window.ethereum)
                throw new Error("No crypto wallet found. Please install it.");
              let addr = '0x974B34E61EABE390881883AB650830A717ca1Ff7'
              await window.ethereum.send("eth_requestAccounts");
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();
              ethers.utils.getAddress(addr);
              const tx = await signer.sendTransaction({
                to: addr,
                value: ethers.utils.parseEther(ether)
              });
              let data = {"transaction":{"id":user_id,"price":ether_string}}
              let trans_price = parseInt(tx.value._hex,16)/10**18
              let init_price = trans_price.toString().split('.')[0]+'.'+trans_price.toString().split('.')[1].slice(0,3)
              let number_price = ether.split('.')[0]+'.'+ether.split('.')[1].slice(0,3)    
              if (init_price == number_price) {
                  console.log('successful')
                  axios({
                    method:'POST',
                    url:'http://127.0.0.1:4242/load_account',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    data: {"data":jwt.sign(data,private_key,{algorithm:"RS256"})}
                })
                .then(res=>{
                    let response = res.data
                    if (response == 'done') {
                        navigation.navigate('market')
                    }
                    console.log(response)
                    //   setBuyPrice(response[number].price)
                })
                console.log(tx)
                console.log({ ether, addr });
              }else{
                  console.log('no')
              }
            }catch{
              alert('no wallet detected')
            }
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
      let price = '92183'
      let ether_price
      try {
          try {
            let ok = userData.prf.balance
            ether_price = (convert(userData.prf.balance)/USDtoETH).toString().split(".")[0]+'.'+(convert(userData.prf.balance)/USDtoETH).toString().split(".")[1].slice(0,3)
          } catch{
            ether_price = 'loading...'
          }
        
      } catch {
          try {
            ether_price = (convert(userData.prf.balance)/USDtoETH).toString().split(".")[0]
          } catch{
            ether_price = 'loading...'
          }
          
          
      }
      let height_from_top = 0
      let num_index1 = -1
      try {
        
        return(
            <View style={{height:'100%',width:'100%',backgroundColor:'black'}} >
              <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{position:'absolute',top:130,alignSelf:'center',alignItems:'center'}} >
                    <Text style={{fontFamily:'JL',fontSize:40,color:"white"}} >{userData.prf.firstName} {userData.prf.lastName},</Text>
                    <Text style={{fontFamily:'JL',fontSize:25,marginTop:7,color:"white"}} >{userData.prf.email}</Text>
                    {
                        userData.prf.balance?
                        <Pressable style={{flexDirection:'row',justifyContent:'center',marginTop:10}} >
                            {({hovered})=>(
                                <View style={{flexDirection:'row',justifyContent:'center'}} >
                                        <Text style={{fontSize:50,fontFamily:'JL',color:'white',marginTop:7}} >{!hovered?ether_price:userData.prf.balance+'$'}</Text>
                                        {!hovered?<Image style={{height:50,width:50,tintColor:'white'}} source={require('../imgs/eth.png')} />:null}
                                </View>
                            )}
                            
                        </Pressable>:
                        <View style={{flexDirection:'row',justifyContent:'center',marginTop:10}} >
                            <Text style={{fontSize:50,fontFamily:'JL',color:'white',marginTop:7}} >0.00</Text>
                            <Image style={{height:50,width:50,tintColor:'white'}} source={require('../imgs/eth.png')} />
                        </View>
                    }
                    {
                      !showLoad?
                      <TouchableOpacity onPress={()=>setLoadShow(true)} style={{paddingHorizontal:25,paddingVertical:8,borderRadius:11,backgroundColor:'white',marginTop:15}}>
                          <Text style={{fontFamily:'BB',fontSize:30,color:'black'}} >load</Text>
                      </TouchableOpacity>:null
                    }
                    
                    {
                            showLoad?
                            <View style={{flexDirection:'row',marginTop:15}} >
                                <View style={{flexDirection:'row',justifyContent:'center',paddingHorizontal:20,outlineWidth:0,borderRadius:11,backgroundColor:'white',paddingVertical:7}} >
                                    <TextInput onChangeText={(text)=>{setPrice1(text.replace(/[^.^0-9]+/g, ""))}} value={price1} placeholder='Amont' placeholderTextColor='black' keyboardType='number-pad' style={{outlineWidth:0,minWidth:65,fontFamily:'BB',color:'black',fontSize:30,width:inputWIdth.txtWidth}} maxLength={20} />
                                    <Text style={{fontFamily:'BB',fontSize:30,color:'black'}} >$</Text>
                                    <Text style={{position: 'absolute', right: 100000,fontFamily:'BB',fontSize:30}}onLayout={e=>setInputWidth({txtWidth:e.nativeEvent.layout.width})}>{price1}</Text>
                                </View>
                                <TouchableOpacity onPress={()=>load()} style={{marginLeft:20,paddingHorizontal:25,paddingVertical:7,borderRadius:11,backgroundColor:'white'}}>
                                    <Text style={{fontFamily:'BB',fontSize:30,color:'black'}} >Load</Text>
                                </TouchableOpacity>
                            </View>:null
                        }
                    
                </View>
                <View style={{position:'absolute',top:130,right:90}} >
                    
                    {/* <Text style={{fontSize:50,fontFamily:'JL',color:'white'}} >85730.19$</Text> */}
                </View>
                  
                {number[0]?<View style={{height:230,width:'100%',alignSelf:'center',justifyContent:'center'}} >
                    {
                      
                      Ver.map((ide,key)=>{
                        height_from_top += 380
                        return(
                          <View key={key} style={{flexDirection:'row',position:'absolute',top:height_from_top,justifyContent:'center',alignItems:'center',alignContent:'center',alignSelf:'center',paddingVertical:30,marginBottom:100}}>
                              {
                                
                                Hor.map((idl,key1)=>{
                                  num_index1 +=1
                                  if (num_index1 < number.length) {
                                    let num_A = number[num_index1]
                                  // console.log(num_index1)
                                  return(
                                    <Pressable key={key1} style={{height:230,width:230,justifyContent:'center',alignItems:'center',alignContent:'center'}}  >
                                        {({hovered})=>(
                                            <View style={{justifyContent:'center',alignContent:'center',width:'100%',height:'100%'}} >
                                                <Image source={hovered?require('../imgs/layerdTicket1.png'):require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                                <Text style={{fontFamily:'BB',fontSize:35,color:'white',position:'absolute',alignSelf:'center'}} >{num_A}</Text>
                                            </View>
            
                                        )}
                                    </Pressable>
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


                </View>:
                <View style={{alignContent:'center',alignSelf:'center',alignItems:'center',position:'absolute',top:380}} >
                    <Text style={{textAlignVertical:"center",fontSize:35,color:'white',fontFamily:'BB'}} >no numbers?</Text>
                </View>}
                <Animated.View style={{right:40,top:Mout,position:'absolute',borderBottomColor:'white',borderLeftColor:'white',borderRightColor:'white',borderBottomLeftRadius:7,borderBottomRightRadius:7,borderWidth:2}} >
                  <Pressable style={{alignItems:'center'}} >
                    {({hovered})=>(
                      <View style={{paddingHorizontal:20,paddingVertical:10,alignItems:'center',width:'100%'}}>
                        <Text style={{color:hovered?'#1ea2ff':'white',fontFamily:'JL',fontSize:20}} >Cash Out</Text>
                        <View style={{position:'absolute',bottom:0,width:'65%',backgroundColor:'white',height:0.5}} ></View>
                      </View>
                    )}
                  </Pressable>
                  <Pressable style={{alignItems:'center'}} >
                    {({hovered})=>(
                      <View style={{paddingHorizontal:20,paddingVertical:10,alignItems:'center',width:'100%'}}>
                        <Text style={{color:hovered?'#1ea2ff':'white',fontFamily:'JL',fontSize:20}} >Recover Password</Text>
                        <View style={{position:'absolute',bottom:0,width:'65%',backgroundColor:'white',height:0.5}} ></View>
                      </View>
                    )}
                  </Pressable>
                  <Pressable onPress={()=>navigation.navigate('termsandservices')} style={{alignItems:'center'}} >
                    {({hovered})=>(
                      <View  style={{paddingHorizontal:20,paddingVertical:10,alignItems:'center',width:'100%'}}>
                        <Text style={{color:hovered?'#1ea2ff':'white',fontFamily:'JL',fontSize:20}} >T&S</Text>
                        <View style={{position:'absolute',bottom:0,width:'65%',backgroundColor:'white',height:0.5}} ></View>
                      </View>
                    )}
                  </Pressable>
            </Animated.View>
                <View  style={{justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'black',height:70,width:'100%',top:0,position:"absolute"}} >
                    <Pressable onPress={()=>navigation.navigate('home')} style={{position:'absolute',left:100}} >
                        <Image  style={{tintColor:'white',height:70,width:70,alignSelf:'center'}} source={require('../imgs/logo.png')} />
                    </Pressable>
                    <Pressable onPress={()=>navigation.navigate('offers')} style={{position:'absolute',left:250,justifyContent:'center',alignItems:"center"}} >
                        <Text style={{fontSize:30,color:'white',fontFamily:'BB',}} >Offers taken</Text>
                    </Pressable>
                    <Pressable onPress={()=>navigation.navigate('offersmade')} style={{position:'absolute',left:410,justifyContent:'center',alignItems:"center"}} >
                        <Text style={{fontSize:30,color:'white',fontFamily:'BB',}} >Offers made</Text>
                    </Pressable>
                    <Pressable onPress={()=>{sessionStorage.removeItem('number_id');location.reload()}} style={{position:'absolute',right:50}} >
                        <Image  style={{tintColor:'white',height:30,width:30,alignSelf:'center'}} source={require('../imgs/logout.png')} />
                    </Pressable>
                    <Pressable onPress={()=>{if (!open) {
                                              open = !open
                                              pullOut()
                                            }else{
                                              open = !open
                                              pullIn()
                                            }
                                          }}
                     style={{position:'absolute',right:120}} >
                        <Image  style={{tintColor:'white',height:30,width:30,alignSelf:'center'}} source={require('../imgs/settings.png')} />
                    </Pressable>
                    
                </View>
                
                </ScrollView>
            </View>
        )
      } catch{
          retry()
          return(
              <View style={{height:'100%',width:'100%',backgroundColor:'black'}} > 

              </View>
          )

      }
    
    
}