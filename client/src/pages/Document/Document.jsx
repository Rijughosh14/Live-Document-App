import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserSession, SaveDocument, GetDocumentDetails } from '../../Service/UserService';
import Access from './component/Access';
import Invite from './component/Invite';
import Page from './component/Page';
import { socket_io } from '../../Socket/Socket';
import { FiSave, FiFileText, FiUserPlus, FiShield, FiMenu, FiX } from "react-icons/fi";

const Component = () => {
    const userid = getUserSession();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const docid = urlParams.get('id');
    const Name = useSelector((state) => state?.user.Name);
    const navigate = useNavigate();

    const [Active, SetActive] = useState('file');
    const [DocumentName, SetDocumentName] = useState('');
    const [Content, SetContent] = useState('');
    const [Invites, SetInvites] = useState([]);
    const [Online, SetOnline] = useState([]);
    const [Group, SetGroup] = useState([]);
    const [DocumentId, SetDocumentId] = useState(null);
    const [DocumentAdminId, SetDocumentAdminId] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (docid && Name) {
            socket_io.emit('joinRoom', docid, Name);

            socket_io.on('userJoined', ({ username, users }) => {
                SetOnline(users.map(u => u.username));
            });

            socket_io.on('userLeft', ({ username, users }) => {
                SetOnline(users.map(u => u.username));
            });

            return () => {
                socket_io.emit('leaveRoom', docid, Name);
                socket_io.off('userJoined');
                socket_io.off('userLeft');
            };
        }
    }, [docid, Name]);

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
            console.error(error);
            navigate('/home');
        }
    };

    useEffect(() => {
        if (docid) {
            getDocumentDetails();
        }
    }, [docid]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavClick = (navItem) => {
        SetActive(navItem);
        setIsMobileMenuOpen(false);
    };

    const NavItems = () => (
        <>
            <p 
                className={`inline-flex items-center space-x-2 px-2 py-3 ${Active === 'file' ? 'bg-gray-200 text-black' : 'hover:text-gray-400 hover:bg-gray-700'} rounded-lg cursor-pointer`} 
                onClick={() => handleNavClick('file')}
            >
                <FiFileText size={20} /><span>Whiteboard</span>
            </p>
            <p 
                className={`inline-flex items-center space-x-2 px-2 py-3 ${Active === 'Invite' ? 'bg-gray-200 text-black' : 'hover:text-gray-400 hover:bg-gray-700'} rounded-lg cursor-pointer`} 
                onClick={() => handleNavClick('Invite')}
            >
                <FiUserPlus size={20} /><span>Invite</span>
            </p>
            {userid === DocumentAdminId && (
                <p 
                    className={`inline-flex items-center space-x-2 px-2 py-3 ${Active === 'Access' ? 'bg-gray-200 text-black' : 'hover:text-gray-400 hover:bg-gray-700'} rounded-lg cursor-pointer`} 
                    onClick={() => handleNavClick('Access')}
                >
                    <FiShield size={20} /><span>Access</span>
                </p>
            )}
        </>
    );

    return (
        <div className="flex flex-col md:flex-row bg-gray-300 min-h-screen h-fit">
            {/* Mobile Menu Button */}
            <button 
                className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white"
                onClick={toggleMobileMenu}
            >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-40">
                    <div className="h-full w-64 bg-gray-800 p-4">
                        <div className="flex items-center justify-center h-20 w-full bg-blue-600/50 mb-4">
                            <span className="text-white font-bold text-xl">{Name}</span>
                        </div>
                        <nav className="flex flex-col space-y-4 text-white">
                            <NavItems />
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-col w-64">
                <div className="inline-flex items-center justify-center h-20 w-full bg-blue-600/50 hover:bg-blue-500/50">
                    <span className="text-white font-bold text-xl">{Name}</span>
                </div>
                <div className="flex-grow flex flex-col justify-between text-white bg-gray-800">
                    <nav className="flex flex-col mx-4 my-6 space-y-4">
                        <NavItems />
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full flex flex-col">
                <div className="flex flex-col md:flex-row items-center h-auto md:h-20 px-4 md:px-6 py-4 bg-white gap-2 text-gray-800">
                    <div className="w-full md:w-2/3">
                        <input 
                            className="w-full md:w-64 text-lg font-semibold py-3 px-4 rounded-lg border border-gray-300" 
                            placeholder='Whiteboard name'
                            value={DocumentName}
                            onChange={(e) => SetDocumentName(e.target.value)}
                            readOnly={docid !== null}
                        />
                    </div>
                    <div className='flex flex-wrap gap-2 justify-center md:justify-start'>
                        {Online.map((username, index) => (
                            <div key={index} className='px-3 py-1 rounded-full bg-green-500 text-white text-sm'>
                                {username}
                            </div>
                        ))}
                    </div>
                    {/* button */}
                    <div className="mt-4 md:mt-0 md:ml-auto">
                        <button 
                            className='text-xl font-semibold h-fit bg-green-500/50 py-2 px-4 rounded-xl shadow-lg hover:bg-green-500 flex items-center space-x-2'
                            onClick={HandleSave}
                        >
                            <FiSave size={20} />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
                
                <div className="flex-1">
                    {Active === 'file' && <Page Content={Content} handleContentChange={SetContent} />}
                    {Active === 'Invite' && <Invite SetInvites={SetInvites} docid={docid} />}
                    {Active === 'Access' && <Access Group={Group} DocumentId={DocumentId} SetGroup={SetGroup} />}
                </div>
            </div>
        </div>
    );
};

export default Component;