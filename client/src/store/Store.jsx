import {configureStore} from '@reduxjs/toolkit'
import userslicereducer from '../features/user/UserSlice'

export const store=configureStore({
    reducer:{
        user:userslicereducer,
    },
})