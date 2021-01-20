import React from "react";
import {Text,StyleSheet,View} from "react-native";
import Util from "../globalStylesheet/Util";
export const About = ()=>{

    return(
    <View style={Util.container}>
   <Text>About container</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:40,
    }
})
export default About;