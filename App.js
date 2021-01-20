/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';


import React from 'react';
import { StyleSheet,Text, View,FlatList,TouchableOpacity,Alert,Keyboard,TouchableWithoutFeedback } from 'react-native';
import Navigator from './Routes/BottomTab';
import {StateProvider,useStateValue,FolderProvider,useFolderValue} from "./Context/Usercontext"
import {reducer,initialState} from "./Context/Reducer";
import {folder,initialState as folderState} from "./Context/Folder";
import {GetFolders,GetFiles} from "./Context/Action";
import Login from './Screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';



 function App() {
  
  
   const [{user},dispatch] = useStateValue();
   const [{folders,files},dispatch1]=useFolderValue();
  
   React.useEffect(()=>{

    async function getUser()
    {
      try{
        const user =  await AsyncStorage.getItem('user');
      
        if(user!=null)
        {
          dispatch({
           type:"SET_USER",
           user:JSON.parse(user),
          })
           GetFolders(JSON.parse(user),dispatch1);
          GetFiles(JSON.parse(user),dispatch1)
          console.log('1',folders,files);
        }
       }
       catch(err)
       {
          console.log(err);
       }
    }
    getUser();
    
   },[])
  
        
        return user?<Navigator/>:<Login/>
     
       
      
    
    

 
}

export default ()=>{
    return(
     <StateProvider reducer={reducer} initialState={initialState}>
     <FolderProvider reducer={folder} initialState={folderState}>
     <App/>
     </FolderProvider>
    </StateProvider>
    );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
  }

});
