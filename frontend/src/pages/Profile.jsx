import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import FollowersFollowingList from '../components/FollowersFollowingList';

const ProfilePage = () => {
    const { username } = useParams();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);

    const [currentProfileView, setCurrentProfileView] = useState('posts');

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/users/profile/${username}`);
                setProfileUser(response.data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError(err.response?.data?.message || 'Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    useEffect(() => {
        const fetchUserPosts = async () => {

            setPostsLoading(true);
            setPostsError(null);
            try {
                const response = await axios.get(`/api/posts/user/${username}`);
                setUserPosts(response.data);
            } catch (err) {
                console.error("Error fetching user posts:", err);
                setPostsError(err.response?.data?.message || 'Failed to load user posts.');
            } finally {
                setPostsLoading(false);
            }
        };

        fetchUserPosts();
    }, [username]);


    if(loading){
      return (
      <div className='bg-white p-6 rounded-lg w-full flex items-center justify-center h-40'>
        <div className="flex items-center space-x-2 text-gray-500">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading profile...</span>
        </div>
      </div>
    );
   }

    if (error) {
        return <div className="text-center mt-8 text-lg text-red-500">Error: {error}</div>;
    }

    if (!profileUser) {
        return <div className="text-center mt-8 text-lg">User not found.</div>;
    }

    const isOwnProfile = currentUser && currentUser._id === profileUser._id;
    const isFollowing = profileUser?.followers?.includes(currentUser?._id)

const handleFollowToggle = async () => {
    try {
        await axios.post(`/api/users/follow/${profileUser._id}`);

        // Update only profileUser's followers for UI
        setProfileUser(prev => ({
            ...prev,
            followers: isFollowing
                ? prev.followers.filter(id => id !== currentUser._id)
                : [...prev.followers, currentUser._id]
        }));

    } catch (error) {
        console.error("Error following/unfollowing user:", error);
    }
};

const handleProfileUpdate = (updatedUser) => {
    setProfileUser(updatedUser);
}

    return (
    <div className='container mx-auto max-w-2xl bg-white shadow-sm rounded-lg overflow-hidden'>
        <div className='relative w-full'> 
            <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEtVFaLMVljG9ZoyMTvMGj11TOIa60MStJ7Q&s"
                className='w-full h-48 object-cover' />
            <img 
                src={profileUser.profilePicture}
                className='absolute left-4 -bottom-16 w-32 h-32 rounded-full object-cover shadow-lg' />
        </div>

        {/* Profile info */}
        <div className='p-4 pt-5'> 
            <div className='flex justify-end mb-4'>
                {isOwnProfile? (
                    <button 
                        onClick={() => setShowEditModal(true)}
                        className='bg-gradient-to-r from-glimsee-primary to-glimsee-secondary text-white px-6 py-2 rounded-full font-semibold'> 
                        Edit profile
                    </button>
                ):(
                    <button
                        onClick={handleFollowToggle} 
                        className={`px-6 py-2 rounded-full font-semibold ${isFollowing ? 'bg-transparent text-gray-700 border border-gray-400 hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'} transition-colors`}>
                        {isFollowing ? 'Following' : "Follow"}
                    </button>
                )}
            </div>

            <h1 className='text-2xl font-bold text-gray-800'>{profileUser.name}</h1>
            <p className='text-gray-500 text-md mb-1'>@{profileUser.username}</p>

            {profileUser.bio && (
                <p className='text-gray-700 mb-1'>{profileUser.bio}</p>
            )}

            {profileUser.createdAt && (
                <div className='flex items-center text-gray-600 text-sm'>
                    <FaCalendarAlt className="mr-2"/> Joined {format(new Date(profileUser.createdAt), 'MMM yyyy')}
                </div>
            )}

            <div className='flex gap-4'>
                <span 
                    onClick={() => setCurrentProfileView('following')}
                    className='font-semibold cursor-pointer'>{profileUser?.following?.length}
                    <span className='text-gray-600 ml-1'>Following</span>
                </span>
                <span 
                    onClick={() => setCurrentProfileView('followers')}
                    className='font-semibold cursor-pointer'>{profileUser?.followers?.length}
                    <span className='text-gray-600 ml-1'>Followers</span>
                </span>
            </div>
        </div>

        <hr className='border-gray-200 mt-6 mb-4' />

        {showEditModal && currentUser && (
            <EditProfileModal 
                user={currentUser}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onUpdate={handleProfileUpdate}
            />
        )}

        <div >
        {currentProfileView === 'followers' && (
        <>
            <FollowersFollowingList
                type="followers"
                username={profileUser.username}
            />
             <p
                onClick={() => setCurrentProfileView('posts')}
                className='text-gray-500 text-center text-sm cursor-pointer'>
                remove
            </p>
        </>
        )}

        {currentProfileView === 'following' && (
        <>
            <FollowersFollowingList
                type="following"
                username={profileUser.username}
            />
            <p
                onClick={() => setCurrentProfileView('posts')}
                className='text-gray-500 text-center text-sm cursor-pointer hover:text-red-400'>
                remove
            </p>
        </>
        )}
        </div>
        
        {/* User posts */}
        <div className='p-4'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Posts</h2>
            {postsLoading ? (
                <div className='text-center text-lg'>Loading posts...</div>
            ): postsError ? (
                <div className='text-center text-lg text-red-400'>Error: {postsError}</div>
            ): userPosts.length === 0 ? (
                <p className='text-gray-600'>No posts from this user yet.</p>
            ):(
                <div className='space-y-4'>
                    {userPosts.map((post) => (
                        <PostCard key={post._id}  post={post}/>
                    ))}
                </div>
            )}
        </div>
    </div>
    );
};

export default ProfilePage;