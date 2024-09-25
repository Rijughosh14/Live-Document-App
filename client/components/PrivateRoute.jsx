import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUserSession } from '../src/Service/UserService'


export const PrivateRoute = ({children}) => {
   
  const data=getUserSession()

  return (
    data?children:<Navigate to='/' replace/>
  );
}

export const Privatelogin=({children})=>{

  const data=getUserSession()
  
    return(
      data?<Navigate to='/home' replace/>:children
    )
}



