import React, { useState } from 'react';
import { getUserSession, SearchFriend, SendInvite } from '../../../Service/UserService';
import { ImSpinner2 } from 'react-icons/im'; // For loading spinner

const Invite = ({ SetInvites, docid }) => {
  const [FriendName, SetFriendName] = useState('');
  const [Friend, SetFriend] = useState([]);
  const [loading, setLoading] = useState(false); // To track the loading state

  const userid = getUserSession();

  const filterSearchlist = (id) => {
    const list = Friend.filter((_, index) => index !== id);
    SetFriend(list);
  };

  const sendInvite = async (receiverid, i) => {
    setLoading(true); // Start loading
    await SendInvite(userid, receiverid, docid);
    filterSearchlist(i);
    setLoading(false); // End loading
  };

  const AddToInvites = (data, i) => {
    SetInvites((prev) => [...prev, data]);
    filterSearchlist(i);
  };

  const handleSearch = async () => {
    if (FriendName === '') return;
    const response = await SearchFriend(FriendName);
    SetFriend(response);
    SetFriendName('');
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row justify-between px-4 md:px-10 py-4 space-y-4 md:space-y-0">
      {/* Friends List */}
      <div className="w-full md:w-1/2 bg-gray-500 my-8 rounded-lg shadow-lg overflow-auto py-3 px-5">
        {Friend.map((data, i) => {
          if (data._id === userid) return null;
          return (
            <div
              key={i}
              className="w-full h-28 bg-white rounded-md shadow-md flex flex-col px-4 py-4 gap-4 mb-4 hover:shadow-xl transition-shadow duration-300"
            >
              <p className="text-lg font-semibold text-gray-800">{data.Name}</p>
              <div className="flex flex-row gap-3">
                {docid === null ? (
                  <button
                    className="h-fit w-fit px-3 py-1 rounded bg-green-300 hover:bg-green-400 transition-all font-medium"
                    onClick={() => AddToInvites(data, i)}
                  >
                    Add
                  </button>
                ) : (
                  <button
                    className={`h-fit w-fit px-3 py-1 rounded bg-green-300 hover:bg-green-400 transition-all font-medium flex items-center gap-2
                    ${loading ? 'cursor-not-allowed' : ''}`}
                    onClick={() => sendInvite(data._id, i)}
                    disabled={loading}
                    title="Send invite"
                  >
                    {loading ? <ImSpinner2 className="animate-spin" /> : 'Invite'}
                  </button>
                )}
                <button
                  className="h-fit w-fit px-3 py-1 rounded bg-red-300 hover:bg-red-400 transition-all font-medium"
                  onClick={() => filterSearchlist(i)}
                  title="Cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Friend Form */}
      <div className="flex w-full md:w-1/3">
        <div className="h-64 w-full bg-white m-auto rounded-xl shadow-lg flex flex-col gap-6 py-6 px-8 justify-center">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full focus:outline-none border-b border-gray-400 focus:border-gray-700 transition-all px-2"
              placeholder="Enter friend name"
              value={FriendName}
              onChange={(e) => SetFriendName(e.target.value)}
            />
          </div>
          <button
            className="w-fit h-fit py-3 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white font-medium mx-auto transition-all duration-200"
            onClick={handleSearch}
          >
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invite;
