import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userDetails:{},
    isLoggedIn:false
}

const LoginSlice = createSlice({
    name:"Login slice",
    initialState,
    reducers:{
        updateIsLoggedIn:(state,action)=>{
            state.isLoggedIn=action.payload
        },
        updateUserDetails:(state,action)=>{
            state.userDetails=action.payload
        }
    }
})

export const {updateIsLoggedIn,updateUserDetails} = LoginSlice.actions;

export default LoginSlice.reducer;