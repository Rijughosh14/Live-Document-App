import React, { useState, useEffect } from 'react'
import { DeleteDocument, GetDocuments, getUserSession, LogOut } from '../../Service/UserService'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Requests from '../Requests'

const Home = () => {
  const userId = getUserSession()
  const [Request, SetRequest] = useState(false)
  const [DocumentData, SetDocumentData] = useState([])
  const [Delete, SetDelete] = useState(null)
  const navigate = useNavigate()

  const Name = useSelector((state) => state?.user?.Name || '')

  const handleLogout = () => {
    LogOut()
    navigate('/')
  }

  const getDocumentData = async () => {
    const response = await GetDocuments(userId)
    SetDocumentData(response)
  }

  const deleteDocument = async (event, id) => {
    event.stopPropagation()
    await DeleteDocument(id)
    const updatedList = DocumentData.filter((document) => document._id !== id)
    SetDocumentData(updatedList)
  }

  useEffect(() => {
    getDocumentData()
  }, [])

  return (
    <>
      <div className="bg-gradient-to-r from-blue-300 to-indigo-300 min-h-screen flex items-center justify-center relative">
        <div className='absolute top-2 flex flex-row w-full h-fit justify-between px-4'>
          <p className='text-3xl font-bold text-white'>Welcome, {Name}!</p>
          <div className='flex flex-row gap-4'>
            <button className='text-lg font-semibold bg-white/80 text-blue-600 py-2 px-4 rounded-xl shadow-lg hover:bg-white hover:shadow-2xl'
              onClick={() => SetRequest(true)}>
              <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M3 8l7.89 5.26a2 2 0 002.22 0L21 8M21 16v-1a1 1 0 00-1-1h-1.2M3 8l7.89 5.26a2 2 0 002.22 0L21 8z"></path>
              </svg>
              Requests
            </button>
            <button className='text-lg font-semibold bg-white/80 text-red-600 py-2 px-4 rounded-xl shadow-lg hover:bg-white hover:shadow-2xl' onClick={handleLogout}>
              <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-2xl p-6 max-w-6xl w-full flex flex-col lg:flex-row lg:space-x-8">
          <div className="flex-1">
            <h3 className="text-3xl font-light text-gray-100 mb-6">Your Documents</h3>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {/* Document Card for Creating New Document */}
              <div className="group bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 transition py-12 px-6 rounded-md flex flex-col items-center justify-center cursor-pointer"
                onClick={() => navigate('/document')}>
                <svg className="w-10 h-10 text-white group-hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
                <p className="mt-4 text-lg text-white group-hover:text-gray-900">Create New Document</p>
              </div>

              {/* Mapping through the document data */}
              {DocumentData.map((data, index) => (
                <div key={index} className="relative group bg-blue-100 hover:bg-blue-200 transition py-12 px-6 rounded-md flex flex-col items-center cursor-pointer"
                  onMouseOver={() => SetDelete(index)}
                  onMouseOut={() => SetDelete(null)}
                  onClick={() => navigate(`/document?id=${data._id}`)}>
                  {userId === data.DocumentAdminId && Delete === index && (
                    <div className='absolute top-2 right-2'>
                      <svg onClick={(e) => deleteDocument(e, data._id)} className="w-6 h-6 text-red-600 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </div>
                  )}
                  <h4 className="text-xl text-blue-800 font-bold group-hover:text-blue-900">{data.DocumentName}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {Request && <Requests SetRequest={SetRequest} />}
    </>
  )
}

export default Home
