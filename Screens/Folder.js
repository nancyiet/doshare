import React from "react";
import {Text,StyleSheet,View,FlatList,TouchableOpacity,Alert,Image,Modal,TouchableWithoutFeedback,Keyboard,ActivityIndicator} from "react-native";
import {Icon,BottomSheet,ListItem} from "react-native-elements";
import DocumentPicker from 'react-native-document-picker';
import {useStateValue,useFolderValue} from "../Context/Usercontext";
import OpenFile from 'react-native-doc-viewer';
import storage from '@react-native-firebase/storage';
import RNBackgroundDownloader from 'react-native-background-downloader';
import Util from "../globalStylesheet/Util";
import {Notify,handleDownload,fileView,handleSocialShare,GetAllFiles} from "../Context/Action";

const Folder = ({navigation})=>{

    const [{user},dispatch]=useStateValue();
    const [files,setFiles] = React.useState([]);
    const [toggleMenu , setMenu]=React.useState({});
    const [loading,setLoading]=React.useState(false);
    const [{allfiles,folders,isLoading},dispatch1]=useFolderValue();
   
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
                handleRemove(item._id);}
        },
        {
            title:"Download",
            titleStyle:{color:"#fff",textAlign:"center",alignSelf:"center",fontFamily:"Lora-Bold"},
            containerStyle:{backgroundColor:"#3e2465",borderRadius:60,marginTop:2},
            onPress:(item)=>{console.log(item._id);
                handleMenu(item._id)
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
   
    function handleMenu(id){
        setMenu(prev=>({...prev,[id]:!prev[id]}));
       // console.log(id,toggleMenu[id])
  }
  function handleRemove(id)
  {
     handleMenu(id);
      setFiles(prev=>{return prev.filter((item)=>{return item._id!==id})});
     
         
          fetch(`http://192.168.43.108:3000/file/${id}`,{
              method:"DELETE"
          })
          .then(res=>res.json())
          .then(file=>{
            GetAllFiles(user,dispatch1);
            //  console.log(file.data)
        }
              )
          .catch(err=>console.log(err));
      
     
  }
 
    
    React.useEffect(()=>{
     var ismounted = true;
       async function dogetFile(){
          setLoading(true);
        try{
            await fetch(`http://192.168.43.108:3000/file/${navigation.getParam('id')}`)
            .then(res=>res.json())
            .then(files=>  {
                //console.log(files);
                setLoading(false);
                setFiles(files.data);
                GetAllFiles(user,dispatch1);
            
                 })
           }
           catch(err)
           {
            console.log(err)
           }
        }
        ismounted && dogetFile();
        return ()=>{
            ismounted=false;
        }
    },[])
    async function uploadFile()
    {
       
           
        try{
              const file = await DocumentPicker.pick({
                  type:[DocumentPicker.types.allFiles],
              })
       
                 
                    if(file && navigation.getParam('id') && file.size<=100000000)
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
                         console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
                        
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
                  folderId:navigation.getParam('id'),
                  userId:user._id,
                  filename,
              }),
              }).then(res=>res.json())
                .then(data=>{console.log(data.data);
                    Notify(file.name,"Uploaded successfully!")
                    setFiles((prev)=>[data.data,...prev]);  
                    GetAllFiles(user,dispatch1);        
                 });
              }
              catch(err)
              {
                Notify(`Error while uploading ${file.name}`,err.message)
                     console.log("Error",err);
              }
            }
            catch(err)
            {
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
           // alert(err.message);
        }
        else{
           // alert(err.message);
        }
        
    }
    
    

    }
    return(
    <View style={styles.container}>
        <View  style={styles.icon}>
        <Icon
        reverse
        raised
       name='upload' 
       type="feather"
       color="#694fad"
       size={23}
       onPress={uploadFile}
       />
        </View>
      

     {loading?
      <View style={{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
       
    }}><ActivityIndicator size="large" color="#694fad"/></View>
     :
     (!loading && files.length)?
    
        <View style={styles.listContainer}>
       <FlatList 
      keyExtractor={item=>item._id}
       data={files}
       numColumns={2}
       renderItem={({item})=>{
        
        const arr = item.name.split('.');
        const len = arr.length;
        const type = arr[len-1];
        
           return(
           <View  style={styles.list}>
           {
               (type==='png'||type==='jpg'||type==='jpeg'||type==='svg')?
               <TouchableOpacity style={styles.imgthu} onPress={()=> fileView(item.url,item.name,item.type)}>
              <Image source={{uri:item.url}} style={styles.img}/> 
           </TouchableOpacity>:
           type==='mp3'?<TouchableOpacity style={styles.imgthu} onPress={()=> fileView(item.url,item.name,item.type)}>
             <Image source={require('../assets/mp3.png')} style={styles.img}/>
       </TouchableOpacity>:
        type==='mp4'?<TouchableOpacity style={styles.imgthu} onPress={()=> fileView(item.url,item.name,item.type)}>
      <Image source={require('../assets/mp4.png')} style={styles.img}/> 
   </TouchableOpacity>
           :<TouchableOpacity style={styles.imgthu} onPress={()=> fileView(item.url,item.name,item.type)}>
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
        top:"50%"
    }} >
         <Text style={styles.textStyle}>No Items</Text>
         </View>
}
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        position:"relative",
        flex:1,
        padding:10,
        width:"100%",
        height:"100%",
        backgroundColor:"#fff",
    },
    icon:{
       bottom:10,
       right:10,
       position:"absolute",
       alignSelf:"flex-end",
   },
   listContainer:{
    flex:1,
    marginVertical:30,
   
 
 },
 list:{

     
     flexDirection:"column",
     marginHorizontal:30,
     justifyContent:"space-evenly",
     marginVertical:10,
     flexGrow:1,
    
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

export default Folder;