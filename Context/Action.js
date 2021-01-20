export async function GetFolders(user,dispatch)
{ 
    console.log(user,user._id);
    dispatch({
        type:"SET_LOADING",
        isLoading:true,
    })
    try{
        await fetch(`http://10.0.2.2:3000/store/folder/${user._id}`)
        .then(res=>res.json())
        .then(folders=> {
            dispatch({
            type:"SET_FOLDERS",
            folders,
        }) ;
        console.log('2',folders);
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
        await fetch(`http://10.0.2.2:3000/store/${user.homeId}/file`)
        .then(res=>res.json())
        .then(files=>  {console.log(files)
            dispatch({
            type:"SET_FILES",
            files,
        }) ; console.log('3',files);  }    )
       }
       catch(err)
       {
        console.log(err)
       }
}