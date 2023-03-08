import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Animated,StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Image, Button } from 'react-native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { Linking } from 'react-native';
var jwt = require('jsonwebtoken');
import axios from 'axios';
import { Hoverable, Pressable, } from 'react-native-web-hover'
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'



const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB
const windowWidth = Dimensions.get('window').width;
let i = 0;
const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
let data = ''
let data101 = {}

let press = false;
export default function Home({navigation}){
    const [number,setNumber] = React.useState([])
    const [numberSelected,setNumberSelected] = React.useState('')
    const [userData,setUserdata] = React.useState()
    const Mout = React.useRef(new Animated.Value(250)).current;
    const [price,setPrice] = React.useState('')
    const [zIndex,setZIndex] = React.useState('')
    const [notification,setNotification] = React.useState(false)
    const [USDtoETH,setUSDtoETH] = React.useState()
    const [inputWIdth,setInputWidth] = React.useState({txtWidth:50})

    function convert(x) {
      var floatValue = +(x);
      return floatValue;
  }
    const isInitialMount = React.useRef(true);
    // const [counting,setCounting] = React.useState(false)
    var data101
    React.useEffect(()=>{
      if (isInitialMount.current) {
        
        if (sessionStorage.getItem('number_id')) {
          data = sessionStorage.getItem('number_id')
          jwt.verify(data, public_key, function(err, decoded) {
            setUserdata(decoded.id)
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


    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) {
        return null;
      }
      
    //   Linking.getInitialURL().then((url) => {
    //     // console.log(url)
    //     const subd = url.split('.markit.na');
    //     console.log(subd[0].split('http://')[1]);
    // });
    const pullOut = () => {
      // Will change Mout value to 1 in 5 seconds
      Animated.timing(Mout, {
        toValue: 50,
        duration: 500,
      }).start();
      wait(550).then(()=>{
        setZIndex(-1)
      })
    };
  
    const pullIn = () => {
      // Will change Mout value to 0 in 3 seconds
      setZIndex(0)
      Animated.timing(Mout, {
        toValue: 250,
        duration: 500,
      }).start();
    };


    const sellNotif = async() =>{
      if (price != '' && price != '.'&& convert(price) >= 5) {
        let ok = price.split('.')
        if (ok.length <= 2 && ok[1] != '') {
          setNotification(true)
        }
      }
    }
    const selll = async() => {
      let data1  = {"id":userData,"number":numberSelected,"price":price}
      let data2 = jwt.sign(data1,private_key,{ algorithm: 'RS256'})
      axios({
        method:'POST',
        url:'http://127.0.0.1:4242/register_number',
        headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
        data: JSON.stringify({"sale":data2})
      })
      .then(res=>{
        let response =  res.data
        setNotification(false)
        
      })
    }
    
    return(
        <View style={{height:'100%',width:'100%',backgroundColor:'black',alignItems:'center',justifyContent:'center',flexDirection:'row'}} >
          <View style={{height:70,backgroundColor:'black',justifyContent:'center',position:'absolute',top:0,width:'100%'}} >
            <Image style={{tintColor:'white',height:70,width:70,alignSelf:'center',position:"absolute",left:100}} source={require('../imgs/logo.png')} />
            <Pressable onPress={()=>navigation.navigate('profile')} style={{position:'absolute',right:30}} >
              <Image style={{tintColor:'white',height:35,width:35,alignSelf:'center'}} source={require('../imgs/profile.png')} />
            </Pressable>
            <View style={{position:'absolute',left:250,flexDirection:'row'}} >
              <Pressable onPress={()=>navigation.navigate('list')} >
                    <Text style={{fontSize:30,color:'white',fontFamily:'BB',}} >list</Text>
              </Pressable>
              <Pressable onPress={()=>navigation.navigate('market')} >
                    <Text style={{fontSize:30,color:'white',marginLeft:30,fontFamily:'BB',}} >market</Text>
              </Pressable>
                </View>
          </View>
          {
            number[0]?
                number.map((num,key)=>{
                  
                    return(
                      
                      <Pressable key={key} style={{justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',borderRadius:20,width:150,height:250,alignItems:'center',marginRight:45}} >
                          {({hovered})=>{
                            if (hovered) {
                              setNumberSelected(num)
                            } 
                          return(
                            <View style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}} >
                                <View style={{height:'100%',width:'100%',position:'absolute',zIndex:zIndex,overflow:'hidden'}} onPress={()=>{if(press){press=!press;pullIn()}else{press=!press;pullOut()}}} >
                                  <Image source={hovered?require('../imgs/layerdTicket1.png'):require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                </View>
                                <View>
                                  <Text style={{fontFamily:'BB',fontSize:45,color:'white'}} >{num}</Text>
                                </View>
                                {
                                  hovered?
                                  <View style={{flexDirection:'row',justifyContent:'center',paddingHorizontal:20,outlineWidth:0,borderRadius:11,backgroundColor:'#1ea2ff',paddingVertical:7,position:'absolute',bottom:-70}} >
                                    <TextInput autoFocus onChangeText={(text)=>{setPrice(text.replace(/[^.^0-9]+/g, ""))}} value={price} placeholder='Price' placeholderTextColor='black' keyboardType='number-pad' returnKeyType='done' onSubmitEditing={()=>sellNotif()} style={{outlineWidth:0,minWidth:50,fontFamily:'BB',color:'black',fontSize:25,width:inputWIdth.txtWidth}} maxLength={12} />
                                    <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >$</Text>
                                    <Text style={{position: 'absolute', right: 100000,fontFamily:'BB',fontSize:25}}onLayout={e=>setInputWidth({txtWidth:e.nativeEvent.layout.width})}>{price}</Text>
                                  </View>:null
                                }
                                
                            </View>
                          )}}
                      </Pressable>
                    )
                }):
                <View style={{alignContent:'center',alignSelf:'center',alignItems:'center',justifyContent:'center'}} >
                    <Text style={{textAlignVertical:"center",fontSize:35,color:'white',marginLeft:25,fontFamily:'BB'}} >no numbers?</Text>
                </View>
              }
            
          {/* <View style={{justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',borderRadius:20,width:350,height:350,alignItems:'center'}} >
          <Animated.View style={{position:'absolute',top:60,right:Mout}} >
              <TouchableOpacity onPress={()=>sellNotif()} style={{paddingHorizontal:20,position:'absolute',paddingVertical:7,borderRadius:11,backgroundColor:'#7FF341'}}>
                  <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >Sell</Text>
              </TouchableOpacity>
              <View style={{flexDirection:'row',justifyContent:'center',position:'absolute',top:40,height:60}} >
                <TextInput onChangeText={(text)=>{setPrice(text.replace(/[^.^0-9]+/g, ""))}} value={price} placeholder='price..' placeholderTextColor='white' keyboardType='number-pad' style={{border:0,backgroundColor:'black',fontFamily:'JL',color:'white',fontSize:25,marginTop:14,width:price.length!=0? price.length*14.5:70}} maxLength={20} />
                <Text style={{fontFamily:'JL',fontSize:25,color:'white',marginTop:24}} >$</Text>
              </View>
          </Animated.View>
            <Pressable style={{height:'100%',width:'100%',position:'absolute',zIndex:zIndex,overflow:'hidden'}} onPress={()=>{if(press){press=!press;pullIn()}else{press=!press;pullOut()}}} >
              <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
            </Pressable>
            <View>
              <Text style={{fontFamily:'BB',fontSize:45,color:'white'}} >{number}</Text>
            </View>
          </View> */}
          {
            notification?
            <View style={{position:"absolute",backgroundColor:'rgba(0,0,0,0.3)',height:'100%',width:'100%',alignContent:'center',justifyContent:'center'}} >
                <View style={{justifyContent:'center',alignContent:'center',height:260,width:430,backgroundColor:'black',borderRadius:13,borderWidth:2,borderColor:'white',alignSelf:'center'}} >
                    <Text style={{position:'absolute',top:40,fontFamily:'JL',paddingHorizontal:40,alignSelf:'center',fontSize:25,color:'white',textAlign:'center'}} >selling number {numberSelected} for</Text>
                    <Text style={{position:'absolute',top:85,alignSelf:'center',fontFamily:'JL',fontSize:25,color:'white',textAlign:'center'}}>{convert(price)}$ ~ {(convert(price)/USDtoETH).toString().split(".")[0]+'.'+(convert(price)/USDtoETH).toString().split(".")[1].slice(0,2)}ETH</Text>
                    <TouchableOpacity onPress={()=>selll()} style={{paddingHorizontal:25,position:'absolute',paddingVertical:7,borderRadius:11,backgroundColor:'#7FF341',bottom:25,right:40}}>
                        <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >Sell</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setNotification(false)} style={{paddingHorizontal:20,position:'absolute',paddingVertical:7,borderRadius:11,backgroundColor:'black',borderColor:'white',borderWidth:2,bottom:25,left:40}}>
                        <Text style={{fontFamily:'BB',fontSize:25,color:'white'}} >Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>:null
          }
        </View>
    )
    
}

// ok.toString().split(".")[0]+'.'+ok.toString().split(".")[1].slice(0,2)