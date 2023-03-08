import React, { useEffect } from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
var jwt = require('jsonwebtoken')
import { useFonts } from 'expo-font';
import { Hoverable, Pressable } from 'react-native-web-hover'
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'
import { ethers } from 'ethers';


const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB
export default function OffersMade({navigation}){
    const [offers,setOffers] = React.useState([])
    const isInitialMount = React.useRef(true)
    // const [number,setNumber] = React.useState()
    const [number,setNumber] = React.useState('')
    const [offerShowConfirm,setOfferShowConfirm] = React.useState(false)
    const [trade_offer,setTradeOffer] = React.useState({})
    const [USDtoETH,setUSDtoETH] = React.useState()
    const [trade_offer_id,setTradeOfferId] = React.useState({})
    const [user_id,setUserId] = React.useState('')
    const [inValid,setInValidShow] = React.useState(false)
    const [Valid,setValidShow] = React.useState({SS:false,TXT:''})
    const [isChoosing,setChoosing] = React.useState(false)

    const contains = (list,item)=>{
        if (list.indexOf(item) >=0){
            return true
        }else{
            return false
        }
    }

    useEffect(()=>{
        (async()=>{
            if (isInitialMount.current) {
                isInitialMount.current = false
                if (sessionStorage.getItem('number_id')) {
                    let data = sessionStorage.getItem('number_id')
                    jwt.verify(data, public_key, function(err, decoded) {
                        setUserId(decoded.id)
                        axios({
                            method:'POST',
                            url:'http://127.0.0.1:4242/number_offers_made_api',
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
            console.log(response)
        })
        // console.log(offer_accepted.offer_id)
    }
    const checkOffer = async()=>{
        let istrue = true
        await axios({
            method:'POST',
            url:'http://127.0.0.1:4242/numbers_api',
            headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
            data: {"data":jwt.sign({'id':user_id},private_key,{algorithm:"RS256"})}
          })
          .then(res=>{
            let response = res.data
            let all_numbers = response.prf.number
            let selected_numbers = trade_offer.nums_offerd
            for (let uael = 0; uael < selected_numbers.length; uael++) {
                istrue *= contains(all_numbers,selected_numbers[uael])
            }
          })
          await axios({
            method:'GET',
            url:'http://127.0.0.1:4242/market_api',
            timeout: 5000
          })
          .then(res=>{
            let response = res.data
            try {
                response[trade_offer]
                istrue *= true
            } catch {
                istrue *= false
            }
          })
          return istrue
    }
    const buy = async(ether_string)=>{
        const exists = await checkOffer()
        console.log(exists)
        if (exists) {
            if (ether_string != "") {
                
                let ether = (convert(ether_string)/USDtoETH).toString()
                try {
                    if (!window.ethereum)
                        throw new Error("No crypto wallet found. Please install it.");
                    let addr = '0x4c10a1add6340f02708d735B7B3Ad311D5DF4dB4'
                    await window.ethereum.send("eth_requestAccounts");
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    ethers.utils.getAddress(addr);
                    const tx = await signer.sendTransaction({
                        to: addr,
                        value: ethers.utils.parseEther(ether)
                    });
                    // console.log(tx)
                    let data = {"number":number,"id":user_id,"price":ether_string,"nums_offerd":trade_offer.nums_offerd}
                    let trans_price = parseInt(tx.value._hex,16)/10**18
                    let init_price = trans_price.toString().split('.')[0]+'.'+trans_price.toString().split('.')[1].slice(0,3)
                    let number_price = ether.split('.')[0]+'.'+ether.split('.')[1].slice(0,3)
                
                    if (init_price == number_price) {
                        // console.log('successful')
                        axios({
                            method:'POST',
                            url:'http://127.0.0.1:4242/offer_buy_done',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            data: {"data":jwt.sign(data,private_key,{algorithm:"RS256"})}
                        })
                        .then(res=>{
                            let response = res.data
                            if (response == 'done') {
                                // navigation.navigate('market')
                                location.reload()
                                setValidShow({SS:true,TXT:'trade complete.'})
                            }
                            console.log(response)
                            //   setBuyPrice(response[number].price)
                        })
                        console.log(tx)
                        console.log({ ether, addr });
                    }else{
                        console.log('no1')
                    }
            
            } catch (error){
            console.log('rejected')
            console.error(error);
            }
        }else{
            try {
                let data = {"number":number,"id":user_id,"price":"","nums_offerd":trade_offer.nums_offerd}
                console.log('ok',data)
                axios({
                    method:'POST',
                    url:'http://127.0.0.1:4242/offer_buy_done',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    data: {"data":jwt.sign(data,private_key,{algorithm:"RS256"})}
                })
                .then(res=>{
                    let response = res.data
                    if (response == 'ok') {
                        location.reload()
                    }
                    console.log(response)
                    //   setBuyPrice(response[number].price)
                })
            } catch{

            }
        }
    }else{
        setInValidShow(true)
    }
}



const pay_with_nuber = async() => {
    const user_data = await jwt.sign({"number":number,"id":user_id,"price":trade_offer.price,"nums_offerd":trade_offer.nums_offerd},private_key,{algorithm:"RS256"})
    window.open('http://127.0.0.1:19006/payoffer?data='+user_data,'_child','popup,width=320,height=580')
    window.onmessage = function (e) {
        if (e.data) {
            if (e.data.status) {
                console.log(e.data.status)
                if (e.data.status == 'done') {
                    setChoosing(false)
                    setOfferShowConfirm(false)
                    location.reload()
                }else{
                    setChoosing(false)
                    setOfferShowConfirm(false)
                    setInValidShow(true)
                    console.log(e.data.status)
                }
            }
        }
    };
}

    return(
        <View style={{height:'100%',width:'100%',backgroundColor:'black',justifyContent:'center'}} >
            
            {/* <ScrollView horizontal style={{alignSelf:'center'}}  > */}
                <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row'}} >
                    {
                        offers[0]?
                            offers.map((offer,i)=>{
                                let offer_available = false
                                for (let uaal = 0; uaal < offer[Object.keys(offer)[0]].nums_offerd.length; uaal++) {
                                    
                                    
                                }
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
                                <Text style={{textAlignVertical:"center",fontSize:35,color:'white',marginLeft:25,fontFamily:'BB'}} >no offers made.</Text>
                            </View>
                            
                        }
                </View>
            {/* </ScrollView> */}
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
                            <TouchableOpacity disabled={trade_offer.status != 'accepted'} onPress={()=>{if(trade_offer.price == ''){buy(trade_offer.price)}else{setChoosing(true)}}} style={{marginLeft:20,paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:trade_offer.status != 'accepted'?'#1ea2ff':'#7FF341',position:'absolute',right:20,bottom:20}}>
                                <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >{trade_offer.status != 'accepted'?'pending':'buy'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setOfferShowConfirm(false)} style={{marginLeft:20,paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'white',position:'absolute',left:20,bottom:20}}>
                                <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >cancel</Text>
                            </TouchableOpacity>
                        </View>
                        
                </View>:null
            }
            {
                inValid?
                <View style={{position:'absolute',height:'100%',flexDirection:'row',width:'100%',backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'center',alignItems:'center'}} >
                    <View style={{paddingHorizontal:45,height:200,flexDirection:'row',backgroundColor:'black',borderWidth:2,borderColor:'#DF2935',justifyContent:'center',alignItems:'center',borderRadius:7}} >
                        <Text style={{textAlignVertical:"center",fontSize:35,color:'#DF2935',fontFamily:'BB'}} >deal is no longer valid.</Text>
                        <TouchableOpacity onPress={()=>setInValidShow(false)} style={{marginLeft:20,paddingHorizontal:20,paddingVertical:7,borderWidth:2,borderColor:'white',borderRadius:7,position:'absolute',right:10,bottom:10}}>
                            <Text style={{fontFamily:'BB',fontSize:25,color:'white'}} >cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>:null
            }
            {
                Valid.SS?
                <View style={{position:'absolute',height:'100%',flexDirection:'row',width:'100%',backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'center',alignItems:'center'}} >
                    <View style={{paddingHorizontal:45,minWidth:360,height:200,flexDirection:'row',backgroundColor:'black',borderWidth:2,borderColor:'#7FF341',justifyContent:'center',alignItems:'center',borderRadius:7}} >
                        <Text style={{textAlignVertical:"center",fontSize:35,color:'#7FF341',fontFamily:'BB'}} >{Valid.TXT}</Text>
                        <TouchableOpacity onPress={()=>setValidShow({SS:false,TXT:''})} style={{marginLeft:20,paddingHorizontal:20,paddingVertical:7,borderWidth:2,borderColor:'white',borderRadius:7,position:'absolute',right:10,bottom:10}}>
                            <Text style={{fontFamily:'BB',fontSize:25,color:'white'}} >ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>:null
            }
            {
                isChoosing?
                <View style={{position:'absolute',height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}} >
                   <Text style={{textAlignVertical:"center",fontSize:35,color:'#7FF341',fontFamily:'BB'}} >paying choice?</Text>
                   <View style={{justifyContent:'center',alignContent:'center',height:100,width:430,alignSelf:'center',flexDirection:'row'}} >
                        <Pressable onPress={()=>buy(trade_offer.price)} style={{padding:20,borderColor:'white',borderRadius:7,borderWidth:2,alignSelf:'center',marginRight:20,backgroundColor:'black',width:80,height:80,alignContent:'center',justifyContent:'center',alignItems:'center'}} >
                            {({hovered})=>(
                                <Image source={require('../imgs/wallet.png')} style={{height:40,width:40,tintColor:hovered?'#7FF341':'white'}}  />
                            )}
                        </Pressable>
                        <Pressable onPress={()=>pay_with_nuber()} style={{padding:20,borderColor:'white',borderRadius:7,borderWidth:2,alignSelf:'center',backgroundColor:'black',width:80,height:80,alignContent:'center',justifyContent:'center',alignItems:'center'}} >
                            {({hovered})=>(
                                <Image source={require('../imgs/numberwallet.png')} style={{height:40,width:40,tintColor:hovered?'#7FF341':'white'}}  />
                            )}
                        </Pressable>
                    </View>
                    <TouchableOpacity onPress={()=>{setOfferShowConfirm(false);setChoosing(false)}} style={{paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'white',marginTop:20}}>
                        <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >cancel</Text>
                    </TouchableOpacity>
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