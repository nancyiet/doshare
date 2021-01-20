import React from "react";
import {Text,StyleSheet,View,Modal,TouchableWithoutFeedback,Keyboard,TextInput} from "react-native";
import CustomBtn from "../Components/CustomBtn";
import {useStateValue} from "../Context/Usercontext";

export const CreateFolder = ({navigation})=>{
     const [open , setOpen]=React.useState(true);
   
     const [folder,setFolder]=React.useState("untitled folder");
   const [{user},dispatch] = useStateValue();
    const handleCancel=()=>{
        navigation.navigate('nav');
     }
     const handleCreate= async()=>{
        console.log(folder +"in modal");
        try{
            await fetch("http://10.0.2.2:3000/store/folder",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({
                  user:user._id,
                  folder
              }),
            }).then(res=>res.json())
            .then(data=>{console.log('data',data);
                    if(data)
                    {
                        navigation.navigate('Home',{folder:data});
                    }       
               
             });
          }
          catch(err)
          {
                 console.log(err);
          }
        
         setFolder("");
     }
    return(
    <View style={styles.container}>
   <Modal visible={open} animationType="slide" >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modal}>
         <Text style={styles.textStyle}>Create Folder</Text>
         <TextInput 
         style={styles.input}
         onChangeText={text=>setFolder(text)}
         value={folder}
         />
         <View style={styles.btnGroup}>
             <CustomBtn title="Cancel" onPress={handleCancel} disable={false}/>
             <CustomBtn title="Create" onPress={handleCreate} disable={folder?false:true}/>
         </View>
        </View>
        </TouchableWithoutFeedback>
        </Modal>
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        margin:"auto",
       backgroundColor:"#ffffff00"
    },
    input:{
      
        borderWidth:1,
        width:280,
        padding:10,
        borderColor:"#ddd",
        borderRadius:6,
        alignSelf:"center",
        fontSize:16,
        fontFamily:"caveat-regular",
        margin:20,

    },
    modal:{
        flex:1,
        margin:"auto",
        alignItems:"center",
        justifyContent:"center",
       
    },
    textStyle:{
        fontFamily:"caveat-bold",
        fontSize:24,
        marginVertical:10,
    },
    btnGroup:{

        flexDirection:"row",
        justifyContent:"space-between",
        width:280,
    }
})
export default CreateFolder;