import React from "react";
import {Text,StyleSheet,View,FlatList,TouchableOpacity,Modal,TouchableWithoutFeedback,Keyboard} from "react-native";

const Folder = ()=>{

    return(
    <View style={Util.container}>
       
    </View>
    );
}

const styles = StyleSheet.create({
    toggleBtn:{
        borderWidth:1,
        borderColor:"skyblue",
        borderRadius:10,
        alignSelf:"center",
        padding:10,
        marginBottom:10,
        shadowOffset:{width:1,height:1},
        shadowColor:"#333",
        backgroundColor:"lightblue",
        color:"#fff",
        elevation:2,
        
    },
    btnClose:{
        
        marginTop:20,
        marginBottom:0,
    }
    ,
    modal:{
        flex:1,
    }
})

export default Folder;