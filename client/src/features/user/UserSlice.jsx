import { createSlice} from "@reduxjs/toolkit";


const initialState={
    _id:'',
    Name:''
}

export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{

        //setting subtitle
        SetUser:(state,action)=>{
            return{
                _id:action.payload._id,
                Name:action.payload.Name
            }

        }
        
    }
})


export default userSlice.reducer

export const {SetUser}=userSlice.actions