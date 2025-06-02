import { setMainContent } from '../feeatures/homeSlice';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const ProfileCard = ({user}) => {
  const dispatch = useDispatch();

  const { 
    profilePicture, 
    username, 
    name,
    bio,
    location, 
    followers = [],
    following = [] ,
  } = user;

  const followersCount = followers?.length;
  const followingCount = following?.length;

  const handerFollowersClick = () => {
    dispatch(setMainContent('followers'))
  }

  const handleFollowingClick = () => {
    dispatch(setMainContent('following'))
  }

  return (
    <div className='w-full flex flex-col items-center mt-4' >
      <div>
         <img 
            src={profilePicture}
            className='rounded-full w-24 h-24 border-glimsee-primary object-cover' />
      </div>
      <div>
         <p className='text-xl font-bold text-center'>{name}</p>
         <p className='text-gray-500 text-sm text-center'>{username}</p>
      </div>
      
      <div className="flex justify-around w-full mt-4 text-center">
        <button
          onClick={handerFollowersClick}
          className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
        >
        <p className="text-lg font-bold text-gray-800">{followersCount}</p>
        <p className="text-gray-500 text-sm">Followers</p>
        </button>
        <button
          onClick={handleFollowingClick}
          className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <p className="text-lg font-bold text-gray-800">{followingCount}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </button>
      </div>

      {/* Bio */}
        <p className="text-gray-600 text-sm mt-4 text-center">{bio}</p>

      {/* Location (optional) */}
        {location && (
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span>{location}</span>
        </div>
        )}

        
        { ( 
        <Link
          to={`/profile/${username}`}
          className="mt-4 w-2/3 mx-auto bg-gradient-to-r from-glimsee-primary to-glimsee-secondary text-white py-2 rounded-lg text-center font-semibold hover:from-glimsee-secondary hover:to-glimsee-primary transition duration-200"
        >
          View Profile
        </Link>
        )}
    </div>
  )
}

export default ProfileCard