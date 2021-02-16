import React from "react";
import {Text,StyleSheet,View,Modal,ActivityIndicator,Alert,TouchableWithoutFeedback,Keyboard,TextInput} from "react-native";
import CustomBtn from "../Components/CustomBtn";
import {useStateValue} from "../Context/Usercontext";
import Util from "../globalStylesheet/Util";
import {Notify} from "../Context/Action";

const ShareFile = ({navigation})=>{
     
    const [open , setOpen]=React.useState(true);
    const [email,setEmail]=React.useState("");
    const [{user},dispatch] = useStateValue();
    const [loading,setLoading]= React.useState(false);
    const [file,setFile]=React.useState({});
     
    React.useEffect(()=>{
        if(navigation.getParam('file'))
        {
            console.log(navigation.getParam('file'));
            setFile(navigation.getParam('file'));
        }
    },[])
    const handleShare=async()=>{
      
         setLoading(true);
            try{
                await fetch("http://192.168.43.108:3000/share",{
                  method:"POST",
                  headers:{"Content-Type":"application/json"},
                  body:JSON.stringify({
                     email:email,
                     name:file.name,
                     type:file.type,
                     url:file.url,
                  }),
                }).then(res=>res.json())
                .then(data=>{console.log('data',data.name);
                        if(data)
                        {
                            setLoading(false);
                            Notify('info',`${data.name} shared`)
                            //Alert.alert(`${data.name} shared`);
                            navigation.goBack();
                        }
                 }).catch((err)=>{
                    Notify('info',`user not found!`)
                    setLoading(false);
                     console.log(err)});
              }
              catch(err)
              {
                Notify('info',`user not found!`)
                setLoading(false);
                     console.log(err);
              }
            
             setEmail("");
    }
    const handleCancel=()=>{
        navigation.goBack();
    }
    return(
        <View style={styles.container}>
   <Modal visible={open} animationType="slide" >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modal}>
         <Text style={styles.textStyle}>Share</Text>
         <Text style={styles.substyle}>Enter an email of a user to whom you want to share.</Text>
         <TextInput 
         style={styles.input}
         onChangeText={text=>setEmail(text)}
         value={email}
         placeholder="demo@gmail.com"
         
         />
         <View style={styles.btnGroup}>
             <CustomBtn title="Cancel" onPress={handleCancel} disable={false}/>
             <CustomBtn title="Share" onPress={handleShare} disable={email?false:true}/>
         </View>
        { loading?<View style={Util.loading}>
             <ActivityIndicator size="large" color="#694fad"/>
            </View>:<View></View>}
        </View>
        </TouchableWithoutFeedback>
        </Modal>
    </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        margin:"auto",
       backgroundColor:"#ffffff00",
      
    },
    input:{
      
        borderWidth:1,
        width:280,
        padding:10,
        borderColor:"#ddd",
        borderRadius:6,
        alignSelf:"center",
        fontSize:16,
        fontFamily:"Lora-Regular",
        margin:20,

    },
    modal:{
        flex:1,
        margin:"auto",
        alignItems:"center",
        justifyContent:"center",
       
    },
    textStyle:{
        fontFamily:"Lora-Bold",
        fontSize:24,
        marginVertical:10,
        color:"#3e2465"
    },
    btnGroup:{

        flexDirection:"row",
        justifyContent:"space-between",
        width:280,
    },
    substyle:{

        fontFamily:"Lora-regular",
        fontSize:12,
        marginVertical:10,
        color:"grey"
    }
    
})

export default ShareFile;