import React, { useState } from 'react';
import { DeleteAccess, getUserSession } from '../../../Service/UserService';
import { AiOutlineDelete } from 'react-icons/ai';
import { ImSpinner2 } from 'react-icons/im';

const Access = ({ Group, DocumentId, SetGroup }) => {
  const userid = getUserSession();
  const [loading, setLoading] = useState(null); // To track the loading state for each removal

  const deleteAccess = async (id) => {
    if (DocumentId && window.confirm("Are you sure you want to remove this user's access?")) {
      setLoading(id); // Set loading for the current user being removed
      const response = await DeleteAccess(DocumentId, id);
      SetGroup(response.Group);
      setLoading(null); // Reset loading after action completes
    }
  };

  return (
    <div className="h-full w-full py-4 px-5">
      <div className="h-full w-full bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-3 overflow-auto">
          {Group.map((data, index) => {
            if (userid === data._id) return null; // Skip current user
            return (
              <div
                key={index}
                className="w-full h-32 bg-white rounded-lg shadow-lg flex justify-between items-center px-5 py-4 border border-gray-300"
              >
                <p className="text-lg font-semibold text-gray-800 truncate">{data.Name}</p>
                <button
                  onClick={() => deleteAccess(data._id)}
                  disabled={loading === data._id}
                  className={`px-3 py-2 rounded-md text-white font-medium flex items-center space-x-2 transition-all duration-200
                    ${loading === data._id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {loading === data._id ? (
                    <>
                      <ImSpinner2 className="animate-spin" />
                      <span>Removing...</span>
                    </>
                  ) : (
                    <>
                      <AiOutlineDelete size={18} />
                      <span>Remove</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Access;
