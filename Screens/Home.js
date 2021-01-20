import React from "react";
import {Text,StyleSheet,View,FlatList,TouchableOpacity,Image,ActivityIndicator} from "react-native";
import {Icon, ListItem} from "react-native-elements";
import {Header,Avatar,BottomSheet} from "react-native-elements";
//import {BottomSheet} from "react-native-btr"
import {useStateValue,useFolderValue} from "../Context/Usercontext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GetFolders,GetFiles} from "../Context/Action";
//import OpenFile from 'react-native-doc-viewer';
import {GoogleSignin} from "@react-native-community/google-signin";
const Home = ({navigation})=>{
     
  const[{user},dispatch]=useStateValue();
 
    const [{folders,files,isLoading},dispatch1]=useFolderValue();
  
    const [list,setlist]=React.useState([]);
    const [toggleMenu , setMenu]=React.useState({});
    const [loading,setLoading]=React.useState(false);
    const bottomlist = [
        {
            title:"Share",
            titleStyle:{color:"#00BFFF"}
        },
        {
            title:"Remove",
            titleStyle:{color:"#00BFFF"},
            onPress:(id)=>{handleRemove(id)}
        },
        {
            title:"Download",
            titleStyle:{color:"#00BFFF"}
        },
        {
            title:"Cancel",
            containerStyle:{backgroundColor:"00BFFF"},
            titleStyle:{color:"#fff"},
            onPress:(id)=>{handleMenu(id)}
            
        }
    ]
    const logOut=async()=>{
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
    function fileView(url,name,type)
    {
       
       
       /* OpenFile.openDoc([{
            url:url,
            fileName:name,
            cache:false,
            fileType:type
          }], (error, url) => {
             if (error) {
             alert(error);
               console.error(error);
             } else {
             alert('successful')
               console.log(url)
             }
           })*/
    }
   React.useEffect(()=>{
       if(navigation.getParam('folder'))
       { 
           console.log('folder')
           setlist(prev=>[navigation.getParam('folder'),...prev]);
           navigation.setParams({'folder':null});
           GetFolders(user,dispatch1);
       }
       if(navigation.getParam('files'))
       { 
          GetFiles(user,dispatch1);
       }

   },[navigation])

  
   React.useEffect(()=>{
   
    function merge()
    {
       
        setlist([...folders,...files]);
        console.log('home',files);
    }
   merge();
   
   },[folders,files])
   
    function handleMenu(id){
          setMenu(prev=>({...prev,[id]:!prev[id]}));
    }
    function handleRemove(type,id)
    {
        console.log(type);
        setlist(prev=>{return prev.filter((item)=>{return item._id!=id})});
        if(type==='folder')
        {
            fetch(`http://10.0.2.2:3000/store/folder/${id}`,{
                method:"DELETE"
            })
            .then(res=>res.json())
            .then(folders=>{
                GetFolders(user,dispatch1);
                console.log(folders.data)}
                )
            .catch(err=>console.log(err));
        }
        else
        {
            console.log(type);
            fetch(`http://10.0.2.2:3000/store/file/${user.homeId}/${id}`,{
                method:"DELETE"
            })
            .then(res=>res.json())
            .then(files=>{
                GetFiles(user,dispatch1);
                console.log(files.data)}
                )
            .catch(err=>console.log(err));
        }
       
    }
   
    return(
    <View style={styles.container}>
    
    <Header
    leftComponent={  <Avatar
        rounded
        source={{
          uri:
           user?user.photoUrl:"jewwww",
        }}
         />} 
         centerComponent={{text:" DoShare" , style:{color:"#00BFFF", fontFamily:"caveat-bold",
         fontSize:20}}}
         rightComponent={<Icon type="feather" name="log-out" onPress={logOut} size={20} color="#00BFFF"/>}
         containerStyle={styles.header}
         leftContainerStyle={{marginLeft:10,paddingVertical:15}}
         rightContainerStyle={{marginRight:10 , paddingVertical:15}}
         
    />
  

    {!isLoading?
          <View style={styles.listContainer}>
       <FlatList 
      keyExtractor={item=>item._id}
       data={list}
       numColumns={2}
       renderItem={({item})=>{
        
       
        
           return(
           <View  style={styles.list}>
           
           <TouchableOpacity   onPress={()=>
            { console.log('start');
                fileView(item.url,item.name,item.type)
           }}>
              {
                 
                  item.type==='folder'?
                  <Image source={require('../assets/folder.png')} style={styles.img}/>
            :item.type==='png'?<Image source={{uri:item.url}} style={styles.img}/>
            :item.type==='jpg'?<Image source={{uri:item.url}} style={styles.img}/>
            :item.type==='jpeg'?<Image source={{uri:item.url}} style={styles.img}/> 
             : 
             <Image source={require('../assets/file.jpg')} style={styles.img}/>
            
              }
              
           </TouchableOpacity>

                 <View style={styles.setting}>
              <Text style={styles.textStyle}>{item.name}</Text>
               
              <Icon
              onPress={()=>handleMenu(item._id)}
            size={14}
            color="black"
            name='dots-three-vertical'
            type='entypo'/>
             
             <BottomSheet isVisible={toggleMenu[item._id]} containerStyle={{
                 backgroundColor:'rgba(0.5,0.25,0,0.2)'
             }}>
               {
                   bottomlist.map((l,i)=>{
                       <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
                       <ListItem.Content>
                           <ListItem.Title style={l.titleStyle} >
                               {l.title}
                           </ListItem.Title>
                       </ListItem.Content>
                       </ListItem>
                   })
               }
             </BottomSheet>
             </View>
             </View>
       )}}
       /> 
           
      </View>:<View style={{
          alignItems:"center",
          justifyContent:"center"
      }}><ActivityIndicator size="large"/></View>}
      
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
       flex:1,
       padding:10,
       width:"100%",
       height:"100%",
      
       
    },
    listContainer:{
       flex:1,
       marginVertical:30,
      
    
    },
    list:{

        
        flexDirection:"column",
        marginHorizontal:35,
        justifyContent:"space-evenly",
        marginVertical:10,
        flexGrow:1,
       
    },
    img:{
        width:100,
        height:100,
       
        
    },
    setting:{
        flex:1,
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      paddingVertical:15,
      width:100,
      
    },
    textStyle:{
        flex:1,
        fontFamily:"caveat-bold",
        fontSize:15,
        marginLeft:5,
        flexWrap:"wrap"
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
marginTop:30,
flexDirection:"row",
justifyContent:"space-around",
alignItems:"center",
paddingVertical:15,
height:60,

    }
   
})

export default Home;