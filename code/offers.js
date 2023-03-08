import React, { useEffect } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
var jwt = require('jsonwebtoken')
import { useFonts } from 'expo-font';
import { Hoverable, Pressable } from 'react-native-web-hover'
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'



const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB
export default function Offers({navigation}){
    const [offers,setOffers] = React.useState([])
    const isInitialMount = React.useRef(true)
    const [number,setNumber] = React.useState('')
    const [offerShowConfirm,setOfferShowConfirm] = React.useState(false)
    const [trade_offer,setTradeOffer] = React.useState({})
    const [USDtoETH,setUSDtoETH] = React.useState()
    const [trade_offer_id,setTradeOfferId] = React.useState({})


    useEffect(()=>{
        (async()=>{
            if (isInitialMount.current) {
                isInitialMount.current = false
                if (sessionStorage.getItem('number_id')) {
                    let data = sessionStorage.getItem('number_id')
                    jwt.verify(data, public_key, function(err, decoded) {
                        axios({
                            method:'POST',
                            url:'http://127.0.0.1:4242/number_offers_api',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                },
                            data: {"data":jwt.sign({'id':decoded.id},private_key,{ algorithm: 'RS256'})}
                        })
                        .then(res=>{
                            let response =  res.data
                            if (response.offers) {
                                setOffers(response.offers)
                            }
                            console.log(response)
                        })
                        axios({
                            method:'GET',
                            url:'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=75e74f8b4589e03d22517b822652d52b6fc5d58da38021b11500973b4f4d0778',
                            timeout:1000
                          })
                          .then(res=>{
                            setUSDtoETH(res.data.USD)
                          })
                    
                    });
                    
                }else{
                    navigation.navigate('login')
                }
            }
        })()
        
    })
    function convert(x) {
        var floatValue = +(x);
        return floatValue;
    }

    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) {
        return null;
      }

    const accept = async(offer_accepted) =>{
        axios({
            method:'POST',
            url:'http://127.0.0.1:4242/accept_offer',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
            data: {"data":jwt.sign({'id':offer_accepted.offer_id,'number':Object.keys(offer_accepted)[0]},private_key,{ algorithm: 'RS256'})}
        })
        .then(res=>{
            let response =  res.data
            setOfferShowConfirm(false)
            location.reload()
            console.log(response)
        })
        // console.log(offer_accepted.offer_id)
    }
    const deny = async(offer_accepted) =>{
        axios({
            method:'POST',
            url:'http://127.0.0.1:4242/deny_offer',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
            data: {"data":jwt.sign({'id':offer_accepted.offer_id,'number':Object.keys(offer_accepted)[0]},private_key,{ algorithm: 'RS256'})}
        })
        .then(res=>{
            let response =  res.data
            setOfferShowConfirm(false)
            location.reload()
            console.log(response)
        })
        // console.log(offer_accepted.offer_id)
    }

    return(
        <View style={{height:'100%',width:'100%',backgroundColor:'black',justifyContent:'center'}} >
            
            <ScrollView horizontal style={{alignSelf:'center'}}  >
                <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row'}} >
                    {
                        offers[0]?
                            offers.map((offer,i)=>{
                                return(
                                <Pressable key={i} onPress={()=>{setTradeOffer(offer[Object.keys(offer)[0]]);setTradeOfferId(offer);setNumber(Object.keys(offer)[0]);setOfferShowConfirm(true)}} style={{height:230,width:230,justifyContent:'center',alignItems:'center',alignContent:'center'}}  >
                                    {({hovered})=>(
                                        <View style={{justifyContent:'center',alignContent:'center',width:'100%',height:'100%'}} >
                                            <Image source={hovered?require('../imgs/layerdTicket1.png'):offer[Object.keys(offer)[0]].status == 'accepted'?require('../imgs/layerdTicket2.png'):require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                            <Text style={{fontFamily:'BB',fontSize:35,color:'white',position:'absolute',alignSelf:'center'}} >{Object.keys(offer)[0]}</Text>
                                            <View style={{position:'absolute',left:60,transform: [{ rotate: '-90deg' }]}} >
                                                <Text style={{fontFamily:'BB',fontSize:35,color:hovered?'#1ea2ff':offer[Object.keys(offer)[0]].status == 'accepted'?'#7ff341':'white',position:'absolute',alignSelf:'center',bottom:0}} >{offer[Object.keys(offer)[0]].status}</Text>
                                            </View>
                                            
                                        </View>
        
                                    )}
                                </Pressable>
                                )
                            }):
                            <View style={{alignContent:'center',alignSelf:'center',alignItems:'center',justifyContent:'center'}} >
                                <Text style={{textAlignVertical:"center",fontSize:35,color:'white',marginLeft:25,fontFamily:'BB'}} >no offers taken.</Text>
                            </View>
                            
                        }
                </View>
            </ScrollView>
            {
                offerShowConfirm?
                <View style={{position:'absolute',height:'100%',flexDirection:'row',width:'100%',backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'center',alignItems:'center'}} >
                        <View style={{paddingHorizontal:30,height:450,flexDirection:'row',backgroundColor:'black',borderWidth:2,borderColor:'white',justifyContent:'center',alignItems:'center',borderRadius:7}} >
                            <View style={{height:200,width:160,justifyContent:'center',alignItems:'center'}} >
                                <View style={{height:'100%',width:'100%',position:'absolute',overflow:'hidden'}}  >
                                    <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                </View>
                                <View>
                                    <Text style={{fontFamily:'BB',fontSize:35,color:'white'}} >{number}</Text>
                                </View>
                            </View>
                            
                            <Image style={{height:55,width:55,tintColor:'white'}} source={require('../imgs/arrow1.png')} />
                            {
                                trade_offer.nums_offerd.map((num,key)=>{
                                    return(
                                        <View key={key} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                            {
                                            key != 0? <Text style={{textAlign:'center',textAlignVertical:'center',fontFamily:'JL',fontSize:35,color:'white'}} >+</Text>:null
                                            }
                                            <View  style={{height:200,width:160,justifyContent:'center',alignItems:'center'}} >
                                                
                                                <View style={{height:'100%',width:'100%',position:'absolute',overflow:'hidden'}}  >
                                                    <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                                </View>
                                                <View>
                                                    <Text style={{fontFamily:'BB',fontSize:35,color:'white'}} >{num}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                            {
                                trade_offer.price != '' && trade_offer.nums_offerd.length != 0?
                                <Text style={{textAlign:'center',fontFamily:'JL',fontSize:35,color:'white'}} >+</Text>:null
                            }
                            {
                                trade_offer.price != ''?
                                <Pressable>
                                    {({hovered})=>{
                                        if (hovered) {
                                            return(
                                                <Text style={{textAlign:'center',fontFamily:'JL',fontSize:35,color:'white',marginLeft:20}} >{trade_offer.price}$</Text>
                                            )
                                        }else{
                                            return(
                                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginLeft:20}} >
                                                    <Text style={{textAlign:'center',fontFamily:'JL',fontSize:35,color:'white'}} >{(convert(trade_offer.price)/USDtoETH).toString().split(".")[0]+'.'+(convert(trade_offer.price)/USDtoETH).toString().split(".")[1].slice(0,2)}</Text>
                                                    <Image style={{height:30,width:30,tintColor:'white'}} source={require('../imgs/eth.png')} />
                                                </View>
                                            )
                                        }
                                    }}
                                </Pressable>
                                    :null
                            }
                            <View style={{flexDirection:'row',position:'absolute',alignSelf:'center',bottom:20}} >
                                <TouchableOpacity onPress={()=>deny(trade_offer_id)} style={{width:100,paddingVertical:7,borderRadius:11,marginRight:10,backgroundColor:'#DF2935'}}>
                                    <Text style={{fontFamily:'BB',fontSize:25,color:'black',alignSelf:'center'}} >Deny</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>accept(trade_offer_id)} style={{width:100,paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'#7FF341'}}>
                                    <Text style={{fontFamily:'BB',fontSize:25,color:'black',alignSelf:'center'}} >Accept</Text>
                                </TouchableOpacity>

                            </View>
                            
                            <TouchableOpacity onPress={()=>setOfferShowConfirm(false)} style={{paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'white',position:'absolute',alignSelf:'center',bottom:-55}}>
                                <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >cancel</Text>
                            </TouchableOpacity>
                        </View>
                        
                </View>:null
            }
            <View  style={{justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'black',height:70,width:'100%',top:0,position:"absolute"}} >
                <Pressable onPress={()=>navigation.navigate('profile')} style={{position:'absolute',left:100}} >
                    <Image  style={{tintColor:'white',height:70,width:70,alignSelf:'center'}} source={require('../imgs/logo.png')} />
                </Pressable>
            </View>
        </View>
    )
}