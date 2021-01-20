export const initialState = {
   folders:[],
   files:[],
   isLoading:true,
};

export const Action_Types = {
     
    SET_FOLDERS : "SET_FOLDERS",
    SET_FILES : "SET_FILES",
    SET_LOADING:"SET_LOADING",
};

export const folder = (state,action)=>
{
    switch (action.type) {
        case Action_Types.SET_FOLDERS : 
        return {
            ...state , 
            folders : action.folders,
            isLoading:false,
        }
        case Action_Types.SET_FILES:
            return{
                ...state,
                files : action.files,
                isLoading:false,
            }
        case Action_Types.SET_LOADING:
            return {...state, isLoading:action.isLoading}
        default: return state;
    }

}