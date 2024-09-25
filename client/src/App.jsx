import './App.css'
import axios from 'axios'
import { Routes, Route } from "react-router-dom";
import Index from './pages/index/Index';
import { Privatelogin, PrivateRoute } from '../components/PrivateRoute';
import Home from './pages/Home/Home';
import Component from './pages/Document/Document';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { GetDocuments, getUserDetails, getUserSession } from './Service/UserService';
import { SetUser } from './features/user/UserSlice';
import { socket_io } from './Socket/Socket';



axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


function App() {

  const dispatch = useDispatch()
  var response

  const id = useSelector((state) => {
    const data = state?.user._id
    if (data !== '') {
      return data
    }
    return false
  })

  const storedId = getUserSession()

  const GetData = async () => {
    response = await getUserDetails(storedId)
    dispatch(SetUser(response))
  }

  const SetUserToSocket = async () => {
    socket_io.emit('user_connection', storedId)
    // const result=await GetDocuments(storedId)
    // socket_io.emit('GroupConnection',result,response)
  }


  useEffect(() => {
    if (id) return
    if (storedId) {
      GetData()
    }
  }, [])

  useEffect(() => {
    if (storedId) {
      SetUserToSocket()
    }
  }, [storedId])

  return (
    <>
      <Routes>
        <Route index element={<Privatelogin><Index /></Privatelogin>} />
        <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/document' element={<PrivateRoute><Component /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App
