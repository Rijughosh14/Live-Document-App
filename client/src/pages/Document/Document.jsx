import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUserSession, SaveDocument, GetDocumentDetails } from '../../Service/UserService'
import Access from './component/Access'
import Invite from './component/Invite'
import Page from './component/Page'
import { socket_io } from '../../Socket/Socket'
import { FiSave, FiFileText, FiUserPlus, FiShield } from "react-icons/fi";

const Component = () => {
    const userid = getUserSession();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const docid = urlParams.get('id');

    const [Active, SetActive] = useState('file');
    const [DocumentName, SetDocumentName] = useState('');
    const [Content, SetContent] = useState('');
    const [Invites, SetInvites] = useState([]);
    const [Online, SetOnline] = useState([]);
    const [Group, SetGroup] = useState([]);
    const [DocumentId, SetDocumentId] = useState(null);
    const [DocumentAdminId, SetDocumentAdminId] = useState(null);

    const navigate = useNavigate();

    const Name = useSelector((state) => state?.user.Name);

    const handleContentChange = (d) => {
        SetContent(d);
        socket_io.emit('datachange', d, docid);
    };

    const HandleSave = async () => {
        if (DocumentName === '') return;
        const obj = {
            DocumentName,
            DocumentAdminId: userid,
            DocumentFile: Content,
        };
        await SaveDocument(obj, Invites);
        navigate('/home');
    };

    const getDocumentDetails = async () => {
        try {
            const response = await GetDocumentDetails(docid, userid);
            SetDocumentName(response.DocumentName);
            SetContent(response.DocumentFile);
            SetGroup(response.Group);
            SetDocumentId(response._id);
            SetDocumentAdminId(response.DocumentAdminId);
        } catch (error) {
            console.log(error);
            navigate('/home');
        }
    };

    useEffect(() => {
        if (docid) {
            socket_io.emit('activemembers', docid);
            socket_io.on('receivedactivemembers', (response) => {
                SetOnline(response);
            });
        }
    }, []);

    useEffect(() => {
        if (docid) {
            if (Name) {
                socket_io.emit('JoinGroup', docid, Name);
                window.addEventListener('beforeunload', () => {
                    socket_io.emit('LeaveGroup', docid, Name);
                });
            }
            return () => {
                window.removeEventListener('beforeunload', () => {
                    socket_io.emit('LeaveGroup', docid, Name);
                });
                socket_io.emit('LeaveGroup', docid, Name);
            };
        }
    }, [Name]);

    useEffect(() => {
        if (docid) {
            getDocumentDetails();
        }
    }, [docid]);

    useEffect(() => {
        if (docid) {
            socket_io.on('datachanged', (response) => {
                SetContent(response);
            });
        }
    }, []);

    return (
        <div className="flex bg-gray-300 min-h-screen h-fit">
            <div className="hidden sm:flex sm:flex-col w-16 sm:w-64">
                <a href="/home" className="inline-flex items-center justify-center h-20 w-full bg-blue-600/50 hover:bg-blue-500/50 text-white font-bold text-xl sm:text-2xl">
                    {Name}
                </a>
                <div className="flex-grow flex flex-col justify-between text-white bg-gray-800">
                    <nav className="flex flex-col mx-4 my-6 space-y-4">
                        <p className={`inline-flex items-center space-x-2 px-2 py-3 ${Active === 'file' ? 'bg-gray-200 text-black' : 'hover:text-gray-400 hover:bg-gray-700'} rounded-lg cursor-pointer`} onClick={() => SetActive('file')}>
                            <FiFileText size={20} /><span>File</span>
                        </p>
                        <p className={`inline-flex items-center space-x-2 px-2 py-3 ${Active === 'Invite' ? 'bg-gray-200 text-black' : 'hover:text-gray-400 hover:bg-gray-700'} rounded-lg cursor-pointer`} onClick={() => SetActive('Invite')}>
                            <FiUserPlus size={20} /><span>Invite</span>
                        </p>
                        {userid === DocumentAdminId && (
                            <p className={`inline-flex items-center space-x-2 px-2 py-3 ${Active === 'Access' ? 'bg-gray-200 text-black' : 'hover:text-gray-400 hover:bg-gray-700'} rounded-lg cursor-pointer`} onClick={() => SetActive('Access')}>
                                <FiShield size={20} /><span>Access</span>
                            </p>
                        )}
                    </nav>
                </div>
            </div>
            <div className="w-full flex flex-col">
                <div className="flex items-center h-20 px-6 sm:px-10 bg-white gap-2 text-gray-800">
                    <div className="relative w-2/3">
                        <input className="w-64 text-lg font-semibold py-3 px-4 rounded-lg border border-gray-300" placeholder='Document name'
                            value={DocumentName}
                            onChange={(e) => SetDocumentName(e.target.value)}
                            readOnly={docid !== null}
                        />
                    </div>
                    <div className='flex flex-row'>
                        {docid ? Online.length > 5 && <div className='h-fit w-fit rounded-full bg-black text-white p-2'>
                            +{Online.length - 5}
                        </div> : Invites.length > 5 && <div className='h-fit w-fit rounded-full bg-black text-white p-2'>
                            +{Invites.length - 5}
                        </div>}
                        {
                            docid ? Online.slice(0, 5).map((data, index) => (
                                <div className='h-fit w-fit rounded-full bg-black text-white p-2' key={index}>
                                    {data}
                                </div>
                            )) : Invites.slice(0, 5).map((data, index) => (
                                <div className='h-fit w-fit rounded-full bg-black text-white p-2' key={index}>
                                    {data.Name}
                                </div>
                            ))
                        }
                    </div>
                    <div className="ml-auto">
                        <button className='text-xl font-semibold h-fit bg-green-500/50 py-2 px-4 rounded-xl shadow-lg hover:bg-green-500 flex items-center space-x-2'
                            onClick={HandleSave}
                        >
                            <FiSave size={20} />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
                {
                    Active === 'file' && <Page Content={Content} handleContentChange={handleContentChange} />
                }
                {
                    Active === 'Invite' && <Invite SetInvites={SetInvites} docid={docid} />
                }
                {
                    Active === 'Access' && <Access Group={Group} DocumentId={DocumentId} SetGroup={SetGroup} />
                }
            </div>
        </div>
    )
}

export default Component
