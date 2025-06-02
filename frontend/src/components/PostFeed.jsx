import React,{useEffect, useState} from 'react'
import CreatePost from './CreatePost'
import PostCard from './PostCard'
import axios from 'axios'

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    
    const fetchAllPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/posts/all')
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally{
        setLoading(false)
      }
    }

    fetchAllPosts();
  },[])

  const handlePostDelete = (deletedPostId) => {
    setPosts((prev) => prev.filter(post => post._id !== deletedPostId))
  }

  const handlePostUpdated = async (postId) => {
    try {
        const response = await axios.get(`/api/posts/${postId}`);
        const updatedPost = response.data;
        setPosts(prevPosts => {
            const newPosts = prevPosts.map(post =>
                post._id === postId ? updatedPost : post
            );
            return newPosts;
        });
    } catch (err) {
        console.error("Error refreshing post data:", err);
    }
};

  const handlePostCreated = (newPost) => {
        setPosts(prevPost => [newPost, ...prevPost])
   }

   if(loading){
      return (
      <div className='bg-white p-6 rounded-lg w-full flex items-center justify-center h-40'>
        <div className="flex items-center space-x-2 text-gray-500">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading feed...</span>
        </div>
      </div>
    );
   }


  return (
    <div className=''>
      <CreatePost onPostCreated={handlePostCreated}/>

      {posts?.length > 0 && (
        posts.map((post) => (
                    
          <PostCard 
            key={post._id}
            post={post}
            onDelete={handlePostDelete}
            onPostUpdated={handlePostUpdated}
          />
          
        ))  
      )}
      
    </div>
  )
}

export default PostFeed