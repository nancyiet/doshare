import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import React from "react";
import Home from "../Screens/Home";
import Shared from "../Screens/Shared"
import {Icon} from "react-native-elements";
import CreateFolder from "../Components/CreateFolder";
import Login from "../Screens/Login";
import {initialState} from "../Context/Reducer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Folder from "../Screens/Folder";
import storage from '@react-native-firebase/storage';
import { Alert } from "react-native";
import DocumentPicker from 'react-native-document-picker';
   

async function sendDocument(navigation){
    try{
        var user = await AsyncStorage.getItem('user')
       user =  JSON.parse(user);
       var homeId = user.homeId;
       console.log(user)
    }
    catch(err)
    {
        console.log(err);
    }
       
    try{
          const file = await DocumentPicker.pick({
              type:[DocumentPicker.types.allFiles],
          })
   
        
                if(file && homeId)
                {
                    const uploaduri = file.uri;
                    let filename = uploaduri.substring(uploaduri.lastIndexOf('/')+1);
                    const extention = filename.split('.').pop();
                    const name = filename.split('.').slice(0,-1).join('.');
                    filename = name+Date.now()+'.'+extention;
                    const task = storage().ref(filename).putFile(uploaduri);
                    task.on('state_changed', taskSnapshot => {
                     console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
                     const percentage = Math.round(taskSnapshot.bytesTransferred/taskSnapshot.totalBytes)*100;
                     Alert.alert(percentage+"% of file uploaded");
      
                    });
          
           try{
                await task;
                Alert.alert('file uploaded!' ,'Your file has been uploaded to firebase successfully! ')
                const url = await storage()
                .ref(filename)
                .getDownloadURL();
                alert(url);
           
       
          try{
            await fetch("http://10.0.2.2:3000/store/file",{
              method:"POST",
             headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
              url:url,
              name:file.name,
              type:extention,
              id:homeId
          }),
          }).then(res=>res.json())
            .then(data=>{console.log(data.data.files);
                 
                   navigation.navigate('Home',{files:data.data.files});
             });
          }
          catch(err)
          {
                 console.log("Error",err);
          }
        }
        catch(err)
        {
           alert(err.message);
        }
            
   
}
}
catch(err)
{
    if(DocumentPicker.isCancel(err))
    {
        alert(err.message);
    }
    else{
        alert(err.message);
    }
    
}


 }
      
       
    
    



const BottomTab = createMaterialBottomTabNavigator({
   
    Home : {screen:Home ,
        navigationOptions:{
           
            tabBarIcon:()=><Icon
           reverse
            size={12}
            color="#00BFFF"
            name='home'
            type='font-awesome'/>,
           tabBarAccessibilityLabel:"Home"
        }  
    },
    Add:{screen:()=>null, 
        

        navigationOptions:{
            
            tabBarIcon:()=><Icon
            reverse
            size={12}
            color="#00BFFF"
            name='plus'
            type='font-awesome'/>,
            tabBarOnPress:({navigation})=>{console.log("pressed");
             navigation.navigate("Modal")
        }
        }},
    Shared:{screen:Shared,
        navigationOptions:{
           
            tabBarIcon:()=><Icon

            reverse
            color="#00BFFF"
            size={12}
            name='users'
            type='font-awesome'/>,
           
        }
    },
    Upload:{screen:()=>null,
        navigationOptions:{
           
            tabBarIcon:()=><Icon
            reverse
            color="#00BFFF"
            size={12}
            name='upload'
            type='font-awesome'/>,
            tabBarOnPress:({navigation})=>{console.log("pressed");
                                 sendDocument(navigation);  }
        }
    },
   
},{
    initialRouteName: 'Home',
    activeColor:"#f0edf6",
  inactiveColor:"#3e2465",
    barStyle: { backgroundColor: '#fff',padding:15 },
    labeled:false,
    backBehavior:"history",

  }
)
const StackNavigator = createStackNavigator({
    nav:{
        screen :BottomTab,
        navigationOptions:{
            headerShown:false
        }
    },
    Modal:{
        screen:CreateFolder,
        navigationOptions:{
            headerShown:false,
            animationEnabled:true
        }
    },
    Login:{
        screen:Login,
        navigationOptions:{
            headerShown:false,
            animationEnabled:true,
            
        } ,
        
        
    },
    Folder:{
       screen:Folder,
           
    }
},{
    mode:"modal",
    
})

export default createAppContainer(StackNavigator) ;

