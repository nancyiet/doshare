import React , {createContext, useContext, useReducer} from "react"; 

export const StateContext = createContext();
export const FolderContext = createContext();

export const StateProvider = ({reducer,initialState , children})=>{
   
    return(
        <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
  </StateContext.Provider>
    )

}

export const FolderProvider = ({reducer,initialState,children})=>{
    return(
        <FolderContext.Provider value={useReducer(reducer,initialState)}>
           {children}
        </FolderContext.Provider>
    )
}


export const useStateValue = () => useContext(StateContext);
export const useFolderValue = ()=> useContext(FolderContext);