import React from "react";
import {Text,StyleSheet,View,Button,Image, PermissionsAndroid} from "react-native";
import Util from "../globalStylesheet/Util";
import CustomBtn from "../Components/CustomBtn";
import {useStateValue} from "../Context/Usercontext";
import {ANDROIDCLIENTID,CLIENTID} from "../secret.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin,GoogleSigninButton,statusCodes} from "@react-native-community/google-signin";
import {Notify} from "../Context/Action";
import {Icon} from "react-native-elements";

GoogleSignin.configure({
  webClientId:CLIENTID,
  offlineAccess:true,
  androidClientId:ANDROIDCLIENTID,
 
})
export default function Login({navigation}){
    
    const [{user},dispatch]=useStateValue();
      
   
    const saveUserToDB= async(user)=>{
       
      try{
        await fetch("http://192.168.43.108:3000/user",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(user),
        }).then(res=>res.json())
        .then(data=>{

          dispatch({
            type:"SET_USER",
            user:data,
        })
      
        try{

           AsyncStorage.setItem('user',JSON.stringify(data));
          
        }
        catch(err)
        {
           alert(err);
        }
      });
      }
      catch(err)
      {
        alert(err);
      }
     
    }
    const signOut = async () => {
      try {
       
        await GoogleSignin.signOut();
        // Remember to remove the user from your app's state as well
      } catch (error) {
        console.error(error);
      }
    };
    async function signIn()
    { 
     
       try{
           await GoogleSignin.hasPlayServices();
           const userInfo = await GoogleSignin.signIn();
           Notify("DoShare",`welcome ${userInfo.user.name}`);
          saveUserToDB(userInfo.user);
          
       }
       catch(error)
       {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
           alert("sign in cancelled")
        } else if (error.code === statusCodes.IN_PROGRESS) {
          alert("in progress")
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          alert("play services not available")
        } else {
          alert(error)
        }
       } 
    }
    return(
    <View style={styles.container}>
     <View style={styles.subContainer}>
       <Icon reverse type="feather" name="share-2" color="#694fad" size={40}/>
         <View >
         <Text style={styles.textStyle}>DoShare</Text>
         </View>
        
         <CustomBtn title="SIGN IN WITH GOOGLE" onPress={signIn} disable={false}/>
        
       
   
    </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#fff",
        flexDirection:"column",
        
    },
    subContainer:{
        alignItems:"center",
        justifyContent:"center",
        
        width:"100%",
       
    },
    textStyle:{
        fontFamily:"Lora-Bold",
        fontSize:30,
        color:"#694fad",
        marginVertical:20,
          
    },
    
})