import React from "react";
import {Text,StyleSheet,View,TouchableOpacity,FlatList,ActivityIndicator} from "react-native";
import Util from "../globalStylesheet/Util";
import {SearchBar,ListItem,Icon,List} from "react-native-elements";
import {useFolderValue} from "../Context/Usercontext";
import _ from "lodash";
import {fileView} from "../Context/Action";

export const Search = ({navigation})=>{
 
    const [query,setValue]=React.useState("");
    const [{allfiles,folders,isLoading,files},dispatch1]=useFolderValue();
    
    const [data,setData]=React.useState([]);
    const [list,setList]=React.useState([]);
   

    React.useEffect(()=>{
     
         setData([...folders,...allfiles]);
    
},[folders,allfiles]);

    const updateSearch=(text)=>{
     console.log(data.length);
    
      if(text.length)
      {
        const formattedquery = text.toLowerCase();
        console.log(formattedquery);
        const searchdata = _.filter(data,item=>{
          let {name}=item;
          name = name.toLowerCase();
          if(name.includes(formattedquery))
          {
            
            return true;
          }
          else{
           
            return false;
          }
          
        })
             setList(searchdata);
      }else{
        setList([]);
      }
      
            setValue(text);
    }
    
    return(
    <View style={Util.container}>
        <View style={{ marginHorizontal:-25,marginTop:5}}>
        <SearchBar
        placeholder="Search Here..."
        onChangeText={(text)=>updateSearch(text)}
        value={query}
        lightTheme
        round

      />
         </View>
       



<View style={styles.list}>
  
   {isLoading?
    <View style={{
      flex:1,
      alignItems:"center",
      justifyContent:"center",
      top:"50%"
      
  }}><ActivityIndicator size="large" color="#694fad"/></View>
   :
  (!isLoading && list.length)?
    <FlatList keyExtractor={(item)=>item._id}
     data={list}
     renderItem={({item})=>{
      const arr = item.name.split('.');
      const len = arr.length;
      const type = arr[len-1];
       return(
        <TouchableOpacity 
        onPress={()=>item.type=='folder'?navigation.navigate('Folder',{id:item._id,name:item.name}):fileView(item.url,item.name,item.type)}
        >
      <ListItem  bottomDivider>
        {
        item.type==='folder'?<Icon  solid color="#694fad" size={15} name="folder" type="font-awesome-5"/>
        :(type==='png'||type==='jpg'||type==='jpeg'||type==='svg')?<Icon solid color="#694fad" size={15} name="image" type="font-awesome-5"/>
        :type==='mp3'?<Icon color="#694fad" solid size={15} name="music" type="font-awesome-5"/>
        :type==='mp4'?<Icon color="#694fad" solid size={15} name="video" type="font-awesome-5"/>
        :<Icon color="#694fad" solid size={15} name="file" type="font-awesome-5"/>
    }

        <ListItem.Content>
          <ListItem.Title numberOfLines={1} style={styles.textStyle}>{item.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      </TouchableOpacity>)
     }}
     
    /> :<View>
     
      </View>
    }
</View>
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
      
    },
    list:{
        marginHorizontal:-20,
        flex:1,
    },
    textStyle:{
      flex:1,
      fontFamily:"Lora-Regular",
      fontSize:15,
      marginLeft:5,
      flexWrap:"wrap"
  },
})
export default Search;