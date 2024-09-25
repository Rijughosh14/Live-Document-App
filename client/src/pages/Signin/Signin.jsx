import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignIn } from '../../Service/UserService'
import { useDispatch } from 'react-redux'
import { SetUser } from '../../features/user/UserSlice'





const Signin = () => {



  const [name, Setname] = useState('')
  const [pass, Setpass] = useState('')
  const navigate = useNavigate()

  const dispatch=useDispatch()

  const Submit = async () => {
    if (name === '' || pass === '') return
    try {
      const response = await SignIn(name, pass)
      dispatch(SetUser(response))
      navigate('/home')
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='flex flex-col h-64 w-96 bg-white px-6 py-6 rounded-b-2xl gap-10'>
      <div>
        <input type="text" className='focus:outline-none  border-b border-black border-opacity-30  w-full p-2 focus:border-opacity-60' placeholder='Name' value={name} onChange={(e) => Setname(e.target.value)} />
      </div>
      <div>
        <input type="password" className='focus:outline-none  border-b border-black border-opacity-30 w-full p-2 focus:border-opacity-60' placeholder='Password' value={pass} onChange={(e) => Setpass(e.target.value)} />
      </div>
      <div className='mx-auto'>
        <button className='bg-blue-300 border border-gray-100 py-2 px-4 rounded-lg font-bold' onClick={Submit}>
          Sign In
        </button>
      </div>
    </div>
  )
}

export default Signin