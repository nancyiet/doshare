export async function GetFolders(user,dispatch)
{ 
   
    dispatch({
        type:"SET_LOADING",
        isLoading:true,
    })
    try{
        await fetch(`http://192.168.43.108:3000/folder/${user._id}`)
        .then(res=>res.json())
        .then(folders=> {
            dispatch({
            type:"SET_FOLDERS",
            folders:folders.data,
        }) ;
       
    }   
        )
       }
    
    catch(err)
    {
        console.log(err)
    }
}
export async function GetFiles(user,dispatch)
{
    dispatch({
        type:"SET_LOADING",
        isLoading:true,
    })
    try{
        await fetch(`http://192.168.43.108:3000/file/${user.homeId}`)
        .then(res=>res.json())
        .then(files=>  {
            dispatch({
            type:"SET_FILES",
            files:files.data,
        }) ;   }    )
       }
       catch(err)
       {
        console.log(err)
       }
}

export async function GetAllFiles(user,dispatch)
{
    dispatch({
        type:"SET_LOADING",
        isLoading:true,
    })
    try{
        await fetch(`http://192.168.43.108:3000/file/all/${user._id}`)
        .then(res=>res.json())
        .then(files=>  {
            try{
                 fetch(`http://192.168.43.108:3000/share/${user._id}`)
                .then(res=>res.json())
                .then(sharefiles=>  {
                    var allfiles = [...files.data,...sharefiles.data];
                    dispatch({
                        type:"SET_ALLFILES",
                        allfiles:allfiles,
                    }) ; 
                   
               })
            }
               catch(err)
               {   
                console.log(err);
               }
            }    )
       }
       catch(err)
       {
        console.log(err)
       }
}


//local notification
import PushNotification from "react-native-push-notification";
import {CLIENTID} from "../secret";
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'

export function Notify(title,message)
{
    
     PushNotification.localNotification({
        title:title,
        message:message,
        channelId:CLIENTID,
    });
}

//download file
 var RNFS = require('react-native-fs');
 import RNBackgroundDownloader from 'react-native-background-downloader';
 import OpenFile from 'react-native-doc-viewer';
 import {Alert} from "react-native";
export function handleDownload(id,url,name)
{
   
   
    let task = RNBackgroundDownloader.download({
        id: `${id}`,
        url: `${url}`,
        destination: `${RNFS.ExternalStorageDirectoryPath}/Download/${name}`
       
    }).begin((expectedBytes) => {
        Notify(name,`Going to download ${Math.round((expectedBytes/1000000)*100+Number.EPSILON)/100} MB!`);
        
        console.log(`Going to download ${expectedBytes} bytes!`);
    }).progress((percent) => {
       // setpercent(percent * 100);
       alert(`Downloaded: ${percent * 100}%`);
        console.log(`Downloaded: ${percent * 100}%`);
    }).done(() => {
        Notify(name,"Download is done!");
        console.log('Download is done!');
        //setpercent(0);
       // Alert.alert("info",`${name} downloaded!`)
        
    }).error((error) => {
        console.log('Download canceled due to error: ', error);
        Notify(name,"Download canceled due to some error");
        //Alert.alert("info","Download canceled due to some error");
    });
   
     
}

// view file
export  function fileView(url,name,type)
{
   const arr = type.split('/');
   const len = arr.length;
   type = arr[len-1];
   
   OpenFile.openDoc([{
        url:url,
        fileName:name,
        cache:false,
        fileType:type
      }], (error, url) => {
         if (error) {
         alert(error);
           console.error(error);
         } else {
        // alert('successful')
           console.log(url)
         }
       })
}

export function handleSocialShare(item){
       
    RNFetchBlob.fetch('GET', `${item.url}`, {
    Authorization : 'Bearer access-token...',
// more headers  ..
})
.then((res) => {
let status = res.info().status;
// console.log(status);
if(status == 200) {
   
  // the conversion is done in native code
  let base64Str = res.base64()
  base64Str = `data:${item.type};base64,${base64Str}`;
  //console.log(base64Str);
  Share.open({
    message:"",  
    url:base64Str,
})
 .then((res) => {
   console.log(res);
 })
.catch((err) => {
  err && console.log(err);
     });

  // the following conversions are done in js, it's SYNC
 
} else {
  // handle other status codes
}
})
// Something went wrong:
.catch((errorMessage, statusCode) => {
// error handling
console.log(statusCode);
})
}