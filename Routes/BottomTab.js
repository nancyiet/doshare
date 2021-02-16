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
import { Alert,View,Text } from "react-native";
import DocumentPicker from 'react-native-document-picker';
import ShareFile from '../Components/ShareFile'; 
import Search from "../Screens/Search";
import {Notify} from "../Context/Action";

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
    
            // console.log(file,file.size/1000000);
                if(file && homeId && file.size<=100000000)
                {
                    Notify(file.name,"uploading! please wait.")
                    const uploaduri = file.uri;
                    let filename = file.name;
                    const array = filename.split('.');
                    const len = array.length;
                    const extention = array[len-1];
                    const name = array[0]; 
                    filename = name+Date.now()+'.'+extention;
                    const task = storage().ref(filename).putFile(uploaduri);
                    task.on('state_changed', taskSnapshot => {
                        const percentage = Math.round((taskSnapshot.bytesTransferred/taskSnapshot.totalBytes)* 100 + Number.EPSILON );
                        console.log(percentage,taskSnapshot.bytesTransferred/taskSnapshot.totalBytes);
                        const Size = Math.round((file.size/1000000)*100+Number.EPSILON);
                        Alert.alert(file.name,percentage+`% of ${Size/100} MB uploaded!`);
         
                    });
          
           try{
                await task;
               // Alert.alert('file uploaded!' ,'Your file has been uploaded to firebase successfully! ')
                const url = await storage()
                .ref(filename)
                .getDownloadURL();
               // alert(url);
           
       
          try{
            await fetch("http://192.168.43.108:3000/file",{
              method:"POST",
             headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
              url:url,
              name:file.name,
              type:file.type,
              folderId:homeId,
              userId: user._id,
              filename,
          }),
          }).then(res=>res.json())
            .then(data=>{console.log(data.data);
                 Notify(file.name,"Uploaded successfully!")
                   navigation.navigate('Home',{file:data.data});
             });
          }
          catch(err)
          {
                 console.log("Error",err);
                 Notify(`Error while uploading ${file.name}`,err.message)
          }
        }
        catch(err)
        {
           console.log(err.message);
           Notify(`Error while uploading ${file.name}`,"Something went wrong!")
        }
            
   
}
else{
    Notify(file.name,"size must not exceed 100mb!");
}
}
catch(err)
{
    if(DocumentPicker.isCancel(err))
    {
        console.log(err.message);
    }
    else{
        console.log(err.message);
    }
    
}


 }
      
       
    
    



const BottomTab = createMaterialBottomTabNavigator({
   
    Home : {screen:Home ,
        navigationOptions:{
           // tabBarLabel:"Home",
            tabBarIcon:({tintColor})=>
                <Icon
          
            size={22}
            color={tintColor}
            name='home'
            type='font-awesome'/>,
           
        }  
    },
    Add:{screen:()=>null, 
        

        navigationOptions:{
           // tabBarLabel:"Create Folder",
            tabBarIcon:({tintColor})=>
            
             <Icon
            size={22}
            color={tintColor}
            name='folder-plus'
            type='font-awesome-5'/>,
            tabBarOnPress:({navigation})=>{
             navigation.navigate("Modal")
        }
        }},
        Search:{
            screen:Search,
            navigationOptions:{
                // tabBarLabel:"Create Folder",
                 tabBarIcon:({tintColor})=>
                 
                  <Icon
                 size={22}
                 color={tintColor}
                 name='search'
                 type='font-awesome-5'/>,
             }
        }
        ,
    Shared:{screen:()=>null,
        navigationOptions:{
            //tabBarLabel:"Shared",
            tabBarIcon:({tintColor})=>
           
             <Icon
           
            color={tintColor}
            size={22}
            name='users'
            type='font-awesome'/> ,
            tabBarOnPress:({navigation})=>{
                navigation.navigate("SharedFiles")
           }
        }
    },
    Upload:{screen:()=>null,
        navigationOptions:{
          // tabBarLabel:"Upload",
            tabBarIcon:({tintColor})=>
           
              <Icon
           
            color={tintColor}
            size={22}
            name='upload'
            type='font-awesome'/> 
            ,
            tabBarOnPress:({navigation})=>{console.log("pressed");
                                 sendDocument(navigation);  }
        }
    },
   
},{
    initialRouteName: 'Home',
    activeColor:"#f0edf6",
    inactiveColor:"#3e2465",
    barStyle: { backgroundColor: '#694fad'},
   

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
            navigationOptions:({navigation})=>({
             title:`${navigation.state.params.name}`
            }),
            path:'folder/:name' ,  
         },
         ShareFile:{
            screen:ShareFile,
            navigationOptions:{
                headerShown:false,
                animationEnabled:true
            }
        },
        SharedFiles:{
            screen:Shared,
            navigationOptions:{
                animationEnabled:true,
                title:"Shared"
            }
        }
   
    
},{
    mode:"modal",

    
})


export default createAppContainer(StackNavigator) ;

/*

   
*/ 
