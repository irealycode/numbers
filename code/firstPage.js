import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, Image, Platform, ScrollView, SafeAreaView } from 'react-native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';

import { Linking } from 'react-native';


let width = Dimensions.get('window').width
export default function First({navigation}){
    const [loaded] = useFonts({
        
        LG: require('../fonts/league-gothic.regular.ttf'),
        JL: require('../fonts/JosefinSans-Light.ttf'),
        BB: require('../fonts/bebas-neue.regular.ttf'),
      });
      if (!loaded) {
        return null;
      }
    //   console.log('ok')
     if (sessionStorage.getItem('number_id')) {
        navigation.navigate('home')
    }
    Linking.getInitialURL().then((url) => {
        console.log(url)
    });
    return(
        <View style={{backgroundColor:'white',flex:1}} >
            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'white'}} >
                <View style={{width:'100%',backgroundColor:'white'}} >
                    
                    {/* Body start */}
                    <View style={{marginTop:70}} >
                        <View style={{backgroundColor:'black',height:600,alignContent:'center',justifyContent:'center',shadowColor: "#000"}} >
                        {/* <View style={{position:'absolute',bottom:'0',alignSelf:'center',width:'200%',height:100,
                                shadowOffset: {
                                    width: 0,
                                    height: 40,
                                },
                                shadowOpacity: 2,
                                shadowRadius: 40.00,
                                shadowColor:'black',
                                elevation: 0,}} ></View> */}
                            <Text style={{fontFamily:'LG',color:'white',fontSize:50,textAlign:'center',}} >Your trading journey starts here</Text>
                            <Text style={{fontFamily:'JL',color:'white',marginTop:15,fontSize:20,textAlign:'center',}} >trade your lucky number</Text>
                            <TouchableOpacity onPress={()=>navigation.navigate('signup')} style={{paddingHorizontal:14,paddingVertical:10,backgroundColor:'white',alignSelf:'center',borderRadius:5,marginTop:20}} >
                                <Text style={{textAlignVertical:"center",fontSize:25,color:'black',fontFamily:'BB'}} >get a number</Text>
                            </TouchableOpacity>
                            {/* <View style={{width:500,height:500,backgroundColor:'black',position:'absolute',bottom:-250,left:-250,borderRadius:500}} ></View> */}
                            
                        </View>
                    </View>
                    <View style={{flexDirection:'row', paddingHorizontal:25,paddingVertical:45,backgroundColor:'black',borderRadius:20,alignSelf:'center',alignItems:'center',justifyContent:'center',alignContent:'center',marginTop:80,}} >
                        <View style={{height:230,width:230,overflow:'hidden',justifyContent:'center',alignItems:'center',alignContent:'center'}}  >
                            <View style={{justifyContent:'center',alignContent:'center',width:'100%',height:'100%'}} >
                                <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                <Text style={{fontFamily:'BB',fontSize:35,color:'white',position:'absolute',alignSelf:'center'}} >69</Text>
                            </View>
                        </View>
                        <Image style={{height:55,width:55,tintColor:'white'}} source={require('../imgs/arrow1.png')} />
                        <View style={{height:230,width:230,overflow:'hidden',justifyContent:'center',alignItems:'center',alignContent:'center'}}  >
                            <View style={{justifyContent:'center',alignContent:'center',width:'100%',height:'100%'}} >
                                <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                <Text style={{fontFamily:'BB',fontSize:35,color:'white',position:'absolute',alignSelf:'center'}} >420</Text>
                            </View>
                        </View>
                        <View style={{position:'absolute',left:20,transform: [{ rotate: '-90deg' }]}} >
                            <Text style={{fontFamily:'BB',fontSize:60,color:'black',position:'absolute',alignSelf:'center',bottom:0}} >trade</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', paddingHorizontal:25,paddingVertical:45,backgroundColor:'black',borderRadius:20,alignSelf:'center',alignItems:'center',justifyContent:'center',alignContent:'center',marginTop:50}} >
                        <View style={{height:230,width:230,overflow:'hidden',justifyContent:'center',alignItems:'center',alignContent:'center'}}  >
                            <View style={{justifyContent:'center',alignContent:'center',width:'100%',height:'100%'}} >
                                <Image source={require('../imgs/layerdTicket.png')} style={{height:'100%',width:'100%'}} />
                                <Text style={{fontFamily:'BB',fontSize:35,color:'white',position:'absolute',alignSelf:'center'}} >420</Text>
                            </View>
                        </View>
                        <Image style={{height:55,width:55,tintColor:'white'}} source={require('../imgs/arrow1.png')} />
                        <View style={{height:230,width:230,overflow:'hidden',justifyContent:'center',alignItems:'center',alignContent:'center'}}  >
                            <Text style={{fontFamily:'JL',color:'white',marginTop:15,fontSize:35,textAlign:'center'}}>7878$</Text>
                        </View>
                        <View style={{position:'absolute',left:20,transform: [{ rotate: '-90deg' }]}} >
                            <Text style={{fontFamily:'BB',fontSize:60,color:'black',position:'absolute',alignSelf:'center',bottom:0}} >buy/sell</Text>
                        </View>
                    </View>
                
                </View>
                <View style={{marginTop:30,marginBottom:7,alignItems:'center',justifyContent:'center',alignSelf:'center'}} >
                    <Text style={{textAlign:'center',fontFamily:'BB',fontSize:20,color:'black'}} >pika ©</Text>
                </View>
        </ScrollView>
        {/* header start */}
        <View style={{backgroundColor:'black',position:'absolute',justifyContent:'center',top:0,width:'100%',height:70}} >
                <Image style={{height:70,width:70,position:'absolute',left:100,tintColor:'white'}} source={require('../imgs/logo.png')} />
                <View style={{position:'absolute',left:220,flexDirection:'row'}} >
                    <Text style={{textAlignVertical:"center",fontSize:25,color:'white',fontFamily:'LG',}} >Market</Text>
                    <Text style={{textAlignVertical:"center",fontSize:25,color:'white',marginLeft:25,fontFamily:'LG'}} >List</Text>
                </View>
                <View style={{flexDirection:'row',position:'absolute',right:100}} >
                    <TouchableOpacity style={{justifyContent:'center',marginRight:17,backgroundColor:'black',borderRadius:5}} onPress={()=>navigation.navigate('login')} >
                        <Text style={{textAlignVertical:"center",fontSize:25,color:'white',fontFamily:'LG'}} >Log in</Text>
                        
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate('signup')} style={{paddingHorizontal:14,paddingVertical:10,backgroundColor:'white',borderRadius:5}} >
                        <Text style={{textAlignVertical:"center",fontSize:25,color:'black',fontFamily:'BB'}} >get a number</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* header end */}
        </View>
    )
}