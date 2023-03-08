import React from 'react';
import { Animated,StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Image, Button, ScrollView, SafeAreaView } from 'react-native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
var jwt = require('jsonwebtoken')
import { Hoverable, Pressable} from 'react-native-web-hover'
import { ethers } from 'ethers';
import {PRIVATE_KEY_WEB,PUBLIC_KEY_WEB} from '@env'



const public_key = PUBLIC_KEY_WEB
const private_key = PRIVATE_KEY_WEB
let width = Dimensions.get('screen').width
// let Num_selected = []
export default function Offer({navigation,route}){
    const {number} = route.params;
    const [price,setPrice] = React.useState('')
    const [buyPrice,setBuyPrice] = React.useState('')
    const [inputWIdth,setInputWidth] = React.useState({txtWidth:50})
    const isInitialMount = React.useRef(true);
    const [USDtoETH,setUSDtoETH] = React.useState()
    const [userData,setUserdata] = React.useState()
    const [numberList,setNumber] = React.useState([])
    const [user_id,setId] = React.useState('')
    const [Num_selected,setNumSelected] = React.useState({})
    const [Num_selected2,setNumSelected2] = React.useState([])
    const [Num_selected1,setNumSelected1] = React.useState(false)
    const [showOffer,setOfferShow] = React.useState(false)
    const [offerShowConfirm,setOfferShowConfirm] = React.useState(false)
    const [buyShowConfirm,setBuyShowConfirm] = React.useState(false)
    const [offerId,setOfferId] = React.useState('')
    const [inValid,setInValidShow] = React.useState({SS:false,TXT:''})
    const [Valid,setValidShow] = React.useState({SS:false,TXT:''})
    const [isChoosing,setChoosing] = React.useState(false)

    React.useEffect(()=>{
        // if (isInitialMount.current) {
            // isInitialMount.current = false
            (async()=>{
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
                            setUserdata(response)
                            console.log(response)
                            let Num_selected_NA = {}
                            for (let lame = 0; lame < response.prf.number.length; lame++) {
                                Num_selected_NA[response.prf.number[lame]] = false
                            }
                            setNumSelected(Num_selected_NA)
                            // console.log(Num_selected_NA)
                            setNumber(response.prf.number)
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
                axios({
                    method:'GET',
                    url:'http://127.0.0.1:4242/market_api',
                    timeout:1000
                })
                .then(res=>{
                    let response = res.data
                    setOfferId(response[number].id)
                    setBuyPrice(response[number].price)
                })
            })()

    },[])

    const update = () => {
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
                    setUserdata(response)
                    console.log(response)
                    let Num_selected_NA = {}
                    for (let lame = 0; lame < response.prf.number.length; lame++) {
                        Num_selected_NA[response.prf.number[lame]] = false
                    }
                    setNumSelected(Num_selected_NA)
                    // console.log(Num_selected_NA)
                    setNumber(response.prf.number)
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
        axios({
            method:'GET',
            url:'http://127.0.0.1:4242/market_api',
            timeout:1000
        })
        .then(res=>{
            let response = res.data
            setOfferId(response[number].id)
            setBuyPrice(response[number].price)
        })
    }

    function convert(x) {
        var floatValue = +(x);
        return floatValue;
    }

    const send_offer = async() =>{
        let number_selected = []
            let Num_selected_NA = Object.values(Num_selected)
            let Num_selected_NA1 = Object.keys(Num_selected)
            for (let index = 0; index < Num_selected_NA1.length; index++) {
                if(Num_selected_NA[index]){
                    number_selected.push(Num_selected_NA1[index])
                }
            }
        // console.log(number_selected)
        let data = {"offer":{"number":number,"id":user_id,"price":price,"nums_offered":number_selected}}
        axios({
            method:'POST',
            url:'http://127.0.0.1:4242/offer_api',
            headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
            data: {"data":jwt.sign(data,private_key,{algorithm:"RS256"})}
          })
          .then(res=>{
            let response =  res.data
            if (response != 'success') {
                setOfferShowConfirm(false)
                setInValidShow({SS:true,TXT:'offer send failed.'})
            }else{
                setOfferShowConfirm(false)
                setValidShow({SS:true,TXT:'offer sent.'})
            }
          })
    }
    const showOfferConfirm = async() =>{
        let number_selected = []
            let Num_selected_NA = Object.values(Num_selected)
            let Num_selected_NA1 = Object.keys(Num_selected)
            for (let index = 0; index < Num_selected_NA1.length; index++) {
                if(Num_selected_NA[index]){
                    number_selected.push(Num_selected_NA1[index])
                }
            }
        if (price != '' && convert(price) >=5) {
            
            setNumSelected2(number_selected)
            setOfferShowConfirm(true)
        }else if(number_selected.length > 0){
            setNumSelected2(number_selected)
            setOfferShowConfirm(true)
        }
        
    }
    const contains = (list,item)=>{
        if (list.indexOf(item) >=0){
            return true
        }else{
            return false
        }
    }
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
                response[number]
                istrue = true
            } catch {
                istrue = false
            }
          })
          return istrue
    }

    const buy = async(ether_string)=>{
        const check = await checkOffer()
        if (check) {
            let ether = (convert(ether_string)/USDtoETH).toString()
            try {
              if (!window.ethereum)
                throw new Error("No crypto wallet found. Please install it.");
              let addr = '0x800766D42C08D31F2Dca0434eF2A9f9574e66027'
              await window.ethereum.send("eth_requestAccounts");
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const chainId = await window.ethereum.send("eth_chainId");
              const signer = provider.getSigner();
              ethers.utils.getAddress(addr);
              let chain = parseInt(chainId.result,16).toString()
              if (chain == "1337") {
                const tx = await signer.sendTransaction({
                    to: addr,
                    value: ethers.utils.parseEther(ether)
                });
                console.log(tx)
                let data = {"transaction":{"number":number,"offer_id":offerId,"id":user_id,"price":ether_string}}
                let trans_price = parseInt(tx.value._hex,16)/10**18
                let init_price = trans_price.toString().split('.')[0]+'.'+trans_price.toString().split('.')[1].slice(0,3)
                let number_price = ether.split('.')[0]+'.'+ether.split('.')[1].slice(0,3)
                console.log(chainId.result.toString())
                if (init_price == number_price) {
                    console.log('successful')
                    axios({
                        method:'POST',
                        url:'http://127.0.0.1:4242/buying_done',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        data: {"data":jwt.sign(data,private_key,{algorithm:"RS256"})}
                    })
                    .then(res=>{
                        let response = res.data
                        if (response == 'done') {
                            setChoosing(false)
                            setBuyShowConfirm(false)
                            setValidShow({SS:true})
                            navigation.navigate('market')
                        }else{
                            console.log(response)
                        }
                        //   setBuyPrice(response[number].price)
                    })
                    console.log(tx)
                    console.log({ ether, addr });
                }else{
                    setChoosing(false)
                    setBuyShowConfirm(false)
                    setInValidShow({SS:true,TXT:'wrong network.'})
                }
              
              }else{
                  setChoosing(false)
                  setBuyShowConfirm(false)
                  setInValidShow({SS:true,TXT:'wrong network.'})
              }
            
            } catch{
              setChoosing(false)
              setBuyShowConfirm(false)
              setInValidShow({SS:true,TXT:'rejected.'})
            }
        }else{
            setInValidShow({SS:true,TXT:'deal is no long valid.'})
        }
    }
    const pay_with_nuber = async() => {
        const user_data = await jwt.sign({"number":number,"offer_id":offerId,"id":user_id,"price":buyPrice},private_key,{algorithm:"RS256"})
        window.open('http://127.0.0.1:19006/pay?data='+user_data,'_child','popup,width=320,height=580')
        window.onmessage = function (e) {
            if (e.data) {
                if (e.data.status) {
                    console.log(e.data.status)
                    if (e.data.status == 'done') {
                        setChoosing(false)
                        setBuyShowConfirm(false)
                        setValidShow({SS:true,TXT:'trade complete.'})
                    }else{
                        setChoosing(false)
                        setBuyShowConfirm(false)
                        setInValidShow({SS:true,TXT:'rejected.'})
                    }
                }
            }
        };
    }

    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) {
        return null;
      }

    return(
        <View style={{height:'100%',width:'100%',maxWidth:'100%',overflow:'hidden',backgroundColor:'black',justifyContent:'center'}} >
            <View style={{justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',borderRadius:20,width:350,height:350,alignItems:'center',alignSelf:'center'}} >
                <View style={{height:'100%',width:'100%',position:'absolute',overflow:'hidden'}}  >
                    <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                </View>
                <View>
                    <Text style={{fontFamily:'BB',fontSize:45,color:'white'}} >{number}</Text>
                </View>
                <View style={{position:'absolute',top:60,right:50,height:'100%'}} >
                    <TouchableOpacity onPress={()=>{update();setBuyShowConfirm(true)}} style={{paddingHorizontal:20,position:'absolute',paddingVertical:7,borderRadius:11,backgroundColor:'#7FF341',top:0}}>
                        <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >Buy</Text>
                    </TouchableOpacity>
                    {/* setBuyShowConfirm(true) */}
                    {
                        !showOffer?
                        <TouchableOpacity onPress={()=>setOfferShow(true)} style={{paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'#1ea2ff',position:'absolute',top:60}}>
                            <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >Offer</Text>
                        </TouchableOpacity>:null
                    }
                        
                        {
                            showOffer?
                            <View style={{flexDirection:'row',position:'absolute',top:60}} >
                                <View style={{flexDirection:'row',justifyContent:'center',paddingHorizontal:20,outlineWidth:0,borderRadius:11,backgroundColor:'#1ea2ff',paddingVertical:7}} >
                                    <TextInput onChangeText={(text)=>{setPrice(text.replace(/[^.^0-9]+/g, ""))}} value={price} placeholder='Price' placeholderTextColor='black' keyboardType='number-pad' style={{outlineWidth:0,minWidth:50,fontFamily:'BB',color:'black',fontSize:25,width:inputWIdth.txtWidth}} maxLength={20} />
                                    <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >$</Text>
                                    <Text style={{position: 'absolute', right: 100000,fontFamily:'BB',fontSize:25}}onLayout={e=>setInputWidth({txtWidth:e.nativeEvent.layout.width})}>{price}</Text>
                                </View>
                                <TouchableOpacity onPress={()=>showOfferConfirm()} style={{marginLeft:20,paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'#1ea2ff'}}>
                                    <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >Offer</Text>
                                </TouchableOpacity>
                            </View>:null
                        }
                    {
                        showOffer?
                        // <ScrollView horizontal style={{height:190}} >
                        <View style={{position:'absolute',height:230,overflow:'hidden',maxWidth:((width-350)/2),marginRight:15,flex:1,top:130}} >
                            <ScrollView horizontal indicatorStyle='white' stickyHeaderHiddenOnScroll style={{width:'100%'}} >
                                {
                                    
                                        numberList.map((num,key)=>{
                                            // console.log('ok',Num_selected)
                                            return(
                                            <Pressable key={key} style={{height:190,width:111,overflow:'hidden',justifyContent:'center',marginRight:20}} onPress={()=>{
                                                let Num_selected_NA = Num_selected
                                                Num_selected_NA[num] = !Num_selected_NA[num]
                                                setNumSelected(Num_selected_NA)
                                                setNumSelected1(!Num_selected1)
                                                
                                                
                                                console.log(Num_selected)
                                            }} >
                                                <Image source={require('../imgs/layerdTicket.png')} style={{position:'absolute',height:'100%',width:'100%'}} />
                                                <View style={{alignSelf:'center',}} >
                                                    <Text style={{fontFamily:'BB',fontSize:25,color:'white'}} >{num}</Text>
                                                </View>
                                                <View style={{position:'absolute',top:17,left:10,height:10,width:10,borderRadius:40,borderWidth:2,borderColor:Num_selected[num]?'#1ea2ff':'white',backgroundColor:Num_selected[num]?'#1ea2ff':'black'}} ></View>
                                            </Pressable>
                                            )
                                        })
                                }
                                
                            </ScrollView>
                        </View>:null
                    }
                    
                </View>
          </View>
            
            
            <Pressable onPress={()=>navigation.navigate('market')} style={{backgroundColor:'black',height:70,width:'100%',top:0,position:"absolute"}} >
                <Image style={{tintColor:'white',height:70,width:70,alignSelf:'center'}} source={require('../imgs/logo.png')} />
            </Pressable>
            {
                buyShowConfirm?
                <View style={{position:"absolute",backgroundColor:'rgba(0,0,0,0.3)',height:'100%',width:'100%',alignContent:'center',justifyContent:'center'}} >
                    <View style={{justifyContent:'center',alignContent:'center',height:260,width:430,backgroundColor:'black',borderRadius:13,borderWidth:2,borderColor:'white',alignSelf:'center'}} >
                        <Text style={{position:'absolute',top:40,fontFamily:'JL',paddingHorizontal:40,alignSelf:'center',fontSize:25,color:'white',textAlign:'center'}} >buying number {number} for</Text>
                        <Pressable style={{justifyContent:'center',alignItems:'center',alignSelf:'center',position:'absolute',top:100,}} >
                            {({hovered})=>(
                                <View style={{flexDirection:'row',position:'absolute'}} >
                                    <Text style={{alignSelf:'center',fontFamily:'JL',fontSize:25,color:'white',textAlign:'center'}}>{!hovered?(convert(buyPrice)/USDtoETH).toString().split(".")[0]+'.'+(convert(buyPrice)/USDtoETH).toString().split(".")[1].slice(0,2):buyPrice+"$"}</Text>
                                    <Image style={{height:30,width:!hovered?30:null,tintColor:'white'}} source={!hovered?require('../imgs/eth.png'):null} />
                                </View>
                            )}
                        </Pressable>
                        <TouchableOpacity onPress={()=>setChoosing(true)} style={{paddingHorizontal:25,position:'absolute',paddingVertical:7,borderRadius:11,backgroundColor:'#7FF341',bottom:25,right:40}}>
                            <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >buy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setBuyShowConfirm(false)} style={{paddingHorizontal:20,position:'absolute',paddingVertical:7,borderRadius:11,backgroundColor:'black',borderColor:'white',borderWidth:2,bottom:25,left:40}}>
                            <Text style={{fontFamily:'BB',fontSize:25,color:'white'}} >Cancel</Text>
                        </TouchableOpacity>
                </View>
            </View>:null
            }
            {/* buy(buyPrice) */}
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
                                Num_selected2.map((num,key)=>{
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
                                price != '' && Num_selected2.length >0?
                                <Text style={{textAlign:'center',fontFamily:'JL',fontSize:35,color:'white'}} >+  </Text>:null
                            }
                            {
                                price != ''?
                                <Text style={{textAlign:'center',fontFamily:'JL',fontSize:35,color:'white',marginLeft:price != '' && Num_selected2.length?0:20}} >{price}$</Text>:null
                            }
                            <TouchableOpacity onPress={()=>send_offer()} style={{marginLeft:20,paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'#1ea2ff',position:'absolute',right:20,bottom:20}}>
                                <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >Offer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setOfferShowConfirm(false)} style={{marginLeft:20,paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'white',position:'absolute',left:20,bottom:20}}>
                                <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >cancel</Text>
                            </TouchableOpacity>
                        </View>
                        
                </View>:null
            }
            {
                inValid.SS?
                <View style={{position:'absolute',height:'100%',flexDirection:'row',width:'100%',backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'center',alignItems:'center'}} >
                    <View style={{paddingHorizontal:45,minWidth:360,height:200,flexDirection:'row',backgroundColor:'black',borderWidth:2,borderColor:'#DF2935',justifyContent:'center',alignItems:'center',borderRadius:7}} >
                        <Text style={{textAlignVertical:"center",fontSize:35,color:'#DF2935',fontFamily:'BB'}} >{inValid.TXT}</Text>
                        <TouchableOpacity onPress={()=>setInValidShow({SS:false,TXT:''})} style={{marginLeft:20,paddingHorizontal:20,paddingVertical:7,borderWidth:2,borderColor:'white',borderRadius:7,position:'absolute',right:10,bottom:10}}>
                            <Text style={{fontFamily:'BB',fontSize:25,color:'white'}} >ok</Text>
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
                        <Pressable onPress={()=>buy(buyPrice)} style={{padding:20,borderColor:'white',borderRadius:7,borderWidth:2,alignSelf:'center',marginRight:20,backgroundColor:'black',width:80,height:80,alignContent:'center',justifyContent:'center',alignItems:'center'}} >
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
                    <TouchableOpacity onPress={()=>{setOfferShowConfirm(false);setInValidShow({SS:false,TXT:''});setChoosing(false);setBuyShowConfirm(false)}} style={{paddingHorizontal:20,paddingVertical:7,borderRadius:11,backgroundColor:'white',marginTop:20}}>
                        <Text style={{fontFamily:'BB',fontSize:25,color:'black'}} >cancel</Text>
                    </TouchableOpacity>
                </View>:null
            }
            
            
        </View>
    )
}