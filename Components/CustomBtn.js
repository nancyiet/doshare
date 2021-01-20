import React from "react";
import {Text,StyleSheet,View,TouchableOpacity} from "react-native";
//import Util from "../globalStylesheet/Util";
export const CustomBtn = ({onPress,title,disable})=>{

    return(
    <TouchableOpacity onPress={onPress} style={disable&&(title=="Create")? styles.disableContainer : styles.btnContainer} disabled={disable}>
         <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btnContainer:{
        elevation: 8,
        backgroundColor: "#00BFFF",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        
    },
    btnText:{
     fontSize: 20,
    color: "#fff",
    alignSelf: "center",
    textTransform: "uppercase",
    fontFamily:"caveat-bold",
    },
    disableContainer:{
        elevation: 8,
        backgroundColor: "#A9A9A9",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        
    }
})
export default CustomBtn;