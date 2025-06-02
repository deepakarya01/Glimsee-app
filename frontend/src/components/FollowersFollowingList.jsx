import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

const FollowersFollowingList = ({type: initialType, username}) => {
  const [currentViewType, setCurrentViewType] = useState(initialType);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true)
      setError(null)
      setList([])

      if(!username){
        console.log("username:", username);
        setError("Something went wrong!")
        setLoading(false);
        return;
      }

      try {
        let response;
        if(currentViewType === 'followers'){
          response = await axios.get(`/api/users/${username}/followers`);
        } else if (currentViewType === 'following'){
          response = await axios.get(`/api/users/${username}/following`);
        } else {
          setError("Something went wrong. try again!")
          setLoading(false)
          return;
        }

        setList(response.data);
      } catch (error) {
        console.error("Error fetching followers/following list",error)
        setError(error?.response?.data?.message || "Failed to load list.")
      } finally {
        setLoading(false);
      }
    }

    fetchList();
  },[currentViewType, username]);

 const title = currentViewType === 'followers' ? 'Followers' : 'Following';

  if (loading) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-md w-full flex items-center justify-center h-40'>
        <div className="flex items-center space-x-2 text-gray-500">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading {title.toLowerCase()}...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-md w-full text-center py-8'>
        <p className='text-red-600 font-semibold text-lg'>{error}</p>
        <p className='text-gray-500 text-sm mt-2'>Please try refreshing the page or check your connection.</p>
      </div>
    );
  }

  return (
    <div className='bg-white p-6 rounded-lg w-full max-w-lg mx-auto'>
      <div className='flex justify-center bg-blue-50 rounded-lg p-1 mb-6 shadow-sm'>
        <button
          onClick={() => setCurrentViewType("followers")}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out
            ${currentViewType === 'followers' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
        >
          Followers
        </button>
        <button
          onClick={() => setCurrentViewType('following')}
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out
            ${currentViewType === 'following' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
        >
          Following
        </button>
      </div>

      {list.length === 0 ? (
        <p className='text-gray-500 text-center py-4 text-md italic'>
          @{username} has no {title.toLowerCase()} yet.
        </p>
      ) : (
        <div className=''>
          {list.map(userItem => (
            <div
              key={userItem._id}
              className='flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 rounded-md'
            >
              <Link to={`/profile/${userItem.username}`} className='flex items-center w-full'>
                <img
                  src={userItem.profilePicture}
                  alt={userItem.username}
                  className='w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-300 shadow-sm'
                />

                <div>
                  <p className="font-bold text-gray-800 text-base">{userItem.name}</p>
                  <p className="text-gray-500 text-sm">@{userItem.username}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FollowersFollowingList