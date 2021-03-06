import {StyleSheet} from 'react-native';

const Util = StyleSheet.create({
    container:{
        flex:1,
        padding:20,

    },
    textStyle:{
        fontFamily:"caveat-bold",
        fontSize:20,
        
    },
    input:{
      
        borderWidth:1,
        width:280,
        padding:10,
        borderColor:"#ddd",
        borderRadius:6,
        alignSelf:"center",
        fontSize:18,
        fontFamily:"caveat-bold"

    },
    errorText:{
        color:"crimson",
        fontFamily:"caveat-bold",
        marginTop:6,
        marginBottom:10,
        textAlign:"center",
    },
    loading:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"black",
        opacity:0.5,
        }
})
export default Util;