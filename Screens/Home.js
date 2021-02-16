import React from "react";
import {Text,StyleSheet,View,FlatList,TouchableOpacity,Image,ActivityIndicator} from "react-native";
import {Icon, ListItem} from "react-native-elements";
import {Header,Avatar,BottomSheet} from "react-native-elements";
//import {BottomSheet} from "react-native-btr"
import {useStateValue,useFolderValue} from "../Context/Usercontext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GetFolders,GetFiles,Notify,handleDownload,fileView,handleSocialShare,GetAllFiles} from "../Context/Action";
import {GoogleSignin} from "@react-native-community/google-signin";
import Util from "../globalStylesheet/Util";
import { Alert } from "react-native";


const Home = ({navigation})=>{
     
  const[{user},dispatch]=useStateValue();
  var RNFS = require('react-native-fs');
    const [{folders,files,isLoading},dispatch1]=useFolderValue();
  
    const [list,setlist]=React.useState([]);
    const [toggleMenu , setMenu]=React.useState({});
    const [loading,setLoading]=React.useState(false);
   const [open,setOpen]=React.useState(false);
  
  
    const vertBottomSheet = [
        {
            title:"LogOut",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:()=>{console.log('logout');
                logOut();}
        },
        {
            title:"Cancel",
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2 , },
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            onPress:()=>{setOpen(false);}
            
        },
        
    ]
    const bottomlistforfolder = [
        {
            title:"Remove",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:(item)=>{console.log(item.type,item._id);
                handleRemove(item.type,item._id)}
        },
        {
            title:"Cancel",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:(item)=>{handleMenu(item._id)}
            
        }
    ]
    const bottomlist = [
        {
            title:"Share",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:(item)=>{console.log(item._id);
            handleShare(item);}
        },
        {
            title:"Send a copy",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:(item)=>{console.log(item._id);
                handleMenu(item._id);
            handleSocialShare(item);}
        },
        {
            title:"Remove",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:(item)=>{console.log(item.type,item._id);
                handleRemove(item.type,item._id)}
        },
        {
            title:"Download",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:(item)=>{console.log(item._id);
                handleMenu(item._id);
                  handleDownload(item._id,item.url,item.name)}
        },
        {
            title:"Cancel",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:(item)=>{handleMenu(item._id)}
            
        }
    ]

   
        
   
    function handleShare(item)
    {
        handleMenu(item._id);
        navigation.navigate('ShareFile',{file:item});
    }
    
    const logOut=async()=>{
        setOpen(false);
        dispatch({
            type:"SET_USER",
            user:null
        })
        try{
            await AsyncStorage.removeItem('user');
            await GoogleSignin.signOut();
            
         }
         catch(err)
         {
            console.log(err);
         }
       
    }
   
   React.useEffect(()=>{
       var ismounted = true;

       if(ismounted && navigation.getParam('folder'))
       { 
          // console.log('folder')
           setlist(prev=>[navigation.getParam('folder'),...prev]);
           navigation.setParams({'folder':null});
           GetFolders(user,dispatch1);
       }
       if( ismounted && navigation.getParam('file'))
       { 
         
          GetFiles(user,dispatch1);
          GetAllFiles(user,dispatch1);
            
       }
       return ()=>{
           ismounted=false;
       }

   },[navigation])

  
   React.useEffect(()=>{
    var ismounted = true;
    function merge()
    {
       
        setlist([...folders,...files]);
        
    }
   ismounted && merge();
   return ()=>{
    ismounted=false;
}
   
   },[folders,files])
   
    function handleMenu(id){
          setMenu(prev=>({...prev,[id]:!prev[id]}));
         // console.log(id,toggleMenu[id])
    }
    function handleRemove(type,id)
    {
        handleMenu(id);
        console.log(type);
        setlist(prev=>{return prev.filter((item)=>{return item._id!=id})});
        if(type==='folder')
        {
            fetch(`http://192.168.43.108:3000/folder/${id}`,{
                method:"DELETE"
            })
            .then(res=>res.json())
            .then(folders=>{
                GetFolders(user,dispatch1);
                //console.log(folders.data)
            }
                )
            .catch(err=>console.log(err));
        }
        else
        {
            console.log(type);
            fetch(`http://192.168.43.108:3000/file/${id}`,{
                method:"DELETE"
            })
            .then(res=>res.json())
            .then(file=>{
                GetFiles(user,dispatch1);
                GetAllFiles(user,dispatch1);
               // console.log(file.data)
            }
                )
            .catch(err=>console.log(err));
        }
       
    }
   
    return(
    <View style={styles.container}>
    
    <Header  
    rightComponent={<Icon type="feather"  name="more-vertical" onPress={()=>setOpen(true)} size={24} color="#3e2465"/>}
    leftComponent={  <Avatar
       
        rounded
        source={{
          uri:
           user?user.photoUrl:"jewwww",
        }}
               />} 
         centerComponent={{text:" DoShare" , style:{color:"#694fad", fontFamily:"Lora-Bold",
         fontSize:20,}}}
         
         containerStyle={styles.header}
         leftContainerStyle={{marginLeft:10,}}
         rightContainerStyle={{marginRight:10 }}
         
    />
   <BottomSheet isVisible={open} containerStyle={{
                 backgroundColor:'rgba(0.5,0.25,0,0.2)'
             }}>
                 {
                    vertBottomSheet.map((l,i)=>(
                        <ListItem key={i} containerStyle={l.containerStyle} onPress={()=>l.onPress()}>
                        <ListItem.Content >
                        
                            <ListItem.Title style={l.titleStyle} >
                                {l.title}
                            </ListItem.Title>
                        </ListItem.Content>
                        </ListItem>
                    )) 
                 }
             </BottomSheet>

    {
    isLoading?
      <View style={{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        
    }}><ActivityIndicator size="large" color="#694fad"/></View>
     :
    (!isLoading && list.length)?
          <View style={styles.listContainer}>
       <FlatList 
      keyExtractor={item=>item._id}
       data={list}
       numColumns={2}
       renderItem={({item})=>{
        
        const arr = item.name.split('.');
        const len = arr.length;
        const type = arr[len-1];
        
           return(
           <View  style={styles.list}>
           {
               item.type==='folder'?
               <TouchableOpacity onPress={()=>navigation.navigate('Folder',{id:item._id,name:item.name})}>
                   <Image source={require('../assets/folder.png')} style={styles.file}/> 
               </TouchableOpacity>
               :(type==='png'||type==='jpg'||type==='jpeg'||type==='svg')?
               <TouchableOpacity style={styles.imgthu} onPress={()=> fileView(item.url,item.name,item.type)}>
              <Image source={{uri:item.url}} style={styles.img} /> 
           </TouchableOpacity>:
            type==='mp3'?<TouchableOpacity style={styles.imgthu} onPress={()=> fileView(item.url,item.name,item.type)}>
            <Image source={require('../assets/mp3.png')} style={styles.img}/>
      </TouchableOpacity>:
       type==='mp4'?<TouchableOpacity style={styles.imgthu} onPress={()=> fileView(item.url,item.name,item.type)}>
     <Image source={require('../assets/mp4.png')} style={styles.img}/> 
  </TouchableOpacity>
           :<TouchableOpacity style={styles.imgthu} onPress={ ()=>fileView(item.url,item.name,item.type)}>
               <Image source={require('../assets/file.jpg')} style={styles.img}/>
            
           </TouchableOpacity>
           }
           

                 <View style={styles.setting}>
              <Text numberOfLines={1} style={styles.textStyle}>{item.name}</Text>
               
             <TouchableOpacity onPress={()=>handleMenu(item._id)}>
             <Icon
            size={15}
            color="black"
            name='dots-three-vertical'
            type='entypo'/>
             </TouchableOpacity>
                 
             
             <BottomSheet isVisible={toggleMenu[item._id]} containerStyle={{
                 backgroundColor:'rgba(0.5,0.25,0,0.2)'
             }}>
               {
                   item.type=='folder'?  bottomlistforfolder.map((l,i)=>(
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={()=>l.onPress(item)}>
                    <ListItem.Content>
                        <ListItem.Title style={l.titleStyle} >
                            {l.title}
                        </ListItem.Title>
                    </ListItem.Content>
                    </ListItem>
                ))
                   :
                   bottomlist.map((l,i)=>(
                       <ListItem key={i} containerStyle={l.containerStyle} onPress={()=>l.onPress(item)}>
                       <ListItem.Content>
                           <ListItem.Title style={l.titleStyle} >
                               {l.title}
                           </ListItem.Title>
                       </ListItem.Content>
                       </ListItem>
                   ))
               }
             </BottomSheet>
            
             </View>
             </View>
       )}}
       /> 
          
      </View>:
      <View style={{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        top:"40%"
        
    }} >
         <Text style={styles.textStyle}>No Items</Text>
         </View>
}

  </View> 
      
      
    );
}

const styles = StyleSheet.create({
    container:{
       flex:1,
       padding:10,
       width:"100%",
       height:"100%",
       backgroundColor:"#fff",
    },
    listContainer:{
       flex:0.90,
       marginVertical:30,
      
    
    },
    list:{

        
        flexDirection:"column",
        marginHorizontal:30,
        justifyContent:"space-evenly",
        marginVertical:10,
        flexGrow:1,
       
    },
    file:{
        width:100,
        height:100,
    },
    img:{
        width:80,
        height:80,
      
        
    },
    setting:{
        flex:1,
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      paddingVertical:15,
      width:110,
      
    },
    textStyle:{
        flex:1,
        fontFamily:"Lora-Bold",
        fontSize:12,
        marginLeft:5,
        flexWrap:"wrap",
        
    },
    BottomSheet:{
        backgroundColor:"#fff",
        width:"100%",
        height:200,
        alignItems:"center"
    },
    bottomlist:{
       
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        padding:20,
        width:"100%"
       
    },
    header:{
        backgroundColor:"#FFF",       
        shadowColor:"#fff",
      overflow: 'hidden',
      shadowOpacity: 0.5,
    borderRadius:6,
      borderWidth:1,
   borderColor:"#fff",
     shadowOffset:{width:0,height:1},
     shadowRadius:3,
      elevation:5,
       
   flexDirection:"row",
  justifyContent:"center",
    alignItems:"center",
  
   
   
    },
    imgthu:{
        width:100,
        height:100,
        borderRadius:5,
        borderColor:"#ddd",
        borderWidth:1,
        alignItems:"center",
        justifyContent:"center"
        
    },
   
   
})

export default Home;