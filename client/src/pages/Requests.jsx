import React, { useState, useEffect } from 'react'
import { AcceptRequest, DeleteRequest, GetRequest, getUserSession } from '../Service/UserService'

const Requests = ({ SetRequest }) => {
  const [Incoming, SetIncoming] = useState([])

  const getdata = async () => {
    const response = await GetRequest(getUserSession())
    SetIncoming(response)
  }

  const filterSearchlist = (id) => {
    const list = Incoming.filter((incoming) => incoming._id !== id)
    SetIncoming(list)
  }

  const acceptRequest = async (id, userid, docid) => {
    try {
      await DeleteRequest(id)
      await AcceptRequest(userid, docid)
      filterSearchlist(id)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteRequest = async (id) => {
    try {
      await DeleteRequest(id)
      filterSearchlist(id)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getdata()
  }, [])

  return (
    <div className='fixed inset-0 z-10 bg-gray-900 bg-opacity-60 flex flex-col'>
      {/* Close Button */}
      <div className='flex justify-end p-3'>
        <button className='text-3xl text-white font-bold hover:text-red-400 transition-colors' onClick={() => SetRequest(false)}>
          &times;
        </button>
      </div>
      
      {/* Request List */}
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white rounded-xl shadow-xl max-w-lg w-full p-6 overflow-y-auto max-h-[70vh]'>
          <h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>Incoming Requests</h2>
          
          {/* Render Requests */}
          {Incoming.length === 0 ? (
            <p className='text-center text-gray-600'>No requests available.</p>
          ) : (
            Incoming.map((data, index) => (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm' key={index}>
                <p className='text-lg text-gray-700'>
                  <span className='font-bold'>{data.senderId.Name}</span> has sent a request for "<span className='font-semibold'>{data.documentId.DocumentName}</span>"
                </p>
                <div className='flex justify-end space-x-4 mt-4'>
                  {/* Accept Button */}
                  <button 
                    className='px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition' 
                    onClick={() => acceptRequest(data._id, data.receiverId, data.documentId._id)}>
                    Accept
                  </button>
                  
                  {/* Cancel Button */}
                  <button 
                    className='px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition' 
                    onClick={() => deleteRequest(data._id)}>
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Requests
