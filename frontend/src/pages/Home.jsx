import { useSelector } from 'react-redux';
import FollowersFollowingList from '../components/FollowersFollowingList';
import PostFeed from '../components/PostFeed'
import ProfileCard from '../components/ProfileCard'
import React from 'react'

const Home = () => {
  const {mainContent} = useSelector((state) => state.home);
  const {user:currentUser, isLoading:authLoading} = useSelector((state) => state.auth);

  if (authLoading || !currentUser) {
    return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading profile and feed...</div>;
  }

 
  return (
   <>
      <div className='flex'>
        <div className='flex w-1/4 border-gray-200 border-r-4 p-2'>
          <ProfileCard user={currentUser}/>
        </div>

        <div className='flex w-2/4 p-2'>
          {mainContent === 'posts' && <PostFeed/> }

          {mainContent === 'followers' && (
            <FollowersFollowingList 
              type={'followers'}
              username={currentUser.username} />
          )}

          {mainContent === 'following' && (
            <FollowersFollowingList 
              type={'following'}
              username={currentUser.username} />
          )}
        </div>
      </div>
   </>
  )
}

export default Home