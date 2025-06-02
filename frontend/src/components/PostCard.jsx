// src/components/PostCard.jsx
import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import {formatDistanceToNow} from 'date-fns'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FaRegCommentAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import CommentSection from './CommentSection';


const PostCard = ({ post, onDelete, onPostUpdated }) => {
    const {user} = useSelector((state) => state.auth);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showCommentSection, setShowCommentSection] = useState(false);

    const [currentLikesCount, setCurrentLikesCount] = useState(post?.likes?.length || 0)
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(post?.likes?.includes(user._id));

    if (!post) {
    return "No posts";
   }

    const authorName = post?.author?.name || 'Unknown User';
    const authorUsername = post?.author?.username || 'unknown';
    const authorProfilePicture = post?.author?.profilePicture;
    const postText = post?.text;
    const postImageUrl = post?.image;
    const createdAt = post?.createdAt;
    const commentsCount = post?.comments?.length || 0; 
    const postAuthorId = post?.author?._id

    const isCurrentUser = postAuthorId === user._id;


    let timeAgo = '';
    if(createdAt){
      try {
        const dateObj = new Date(createdAt)
        if(!isNaN(dateObj.getTime())){
          timeAgo = formatDistanceToNow(dateObj, {addSuffix:true})
        } else {
          console.warn("PostCard: Invalid date string received for createdAt:", createdAt);
          timeAgo = 'Invalid Date';
        }
      } catch (error) {
        console.error("PostCard: Error parsing createdAt date:", error, createdAt);
        timeAgo = 'Error Date';
      }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }
        setIsDeleting(true)
        try {
            const response = await axios.delete(`/api/posts/${post._id}`)
            console.log("Deleted post:", response.data);

            if(onDelete){
                onDelete(post._id);
            }
        } catch (error) {
            console.error("Error deleting post:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleLikeUnlike = async () => {
        const previousLikedStatus = isLikedByCurrentUser;
        const previosLikesCount = currentLikesCount;
        
        setIsLikedByCurrentUser(!previousLikedStatus);
        setCurrentLikesCount(previousLikedStatus ? previosLikesCount - 1 : previosLikesCount + 1)

        try {
            await axios.post(`/api/posts/like/${post._id}`)
        } catch (error) {
            console.error("Error in like/unlike post:",error)
            
        }
    }


    const handleCommentAddedToPost = (postId) => {
        if (onPostUpdated) {
            onPostUpdated(postId);
        }
    };


   return (
    <div className="bg-white p-6 border-b border-gray-200 mb-4">
            <div className="flex items-center mb-3">
                {/* User Avatar */}
                {authorUsername && (
                    <Link to={`/profile/${authorUsername}`} className="flex-shrink-0">
                        <img
                            src={authorProfilePicture}
                            alt={`${authorName}'s avatar`}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                    </Link>
                )}
                {/* User Info */}
                <div>
                    {authorName && (
                        <Link to={`/profile/${authorUsername}`} className="font-semibold text-gray-800 hover:text-glimsee-primary">
                            {authorName}
                        </Link>
                    )}
                    {authorUsername && (
                        <p className="text-gray-500 text-sm">@{authorUsername} • {timeAgo}</p>
                    )}
                </div>
                
                {/* Delete Post Icon */}
                {isCurrentUser && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className= "ml-auto text-gray-600 hover:text-red-500"
                        title={"Delete Post"}
                    >
                        <MdDeleteOutline size={20}/>
                    </button>
                )}
            </div>
            
            {/* Post Text */}
            {postText && (
                <p className="text-gray-700 mb-3">{postText}</p>
            )}

            {/* Post Image */}
            {postImageUrl && (
                <img
                    src={postImageUrl}
                    alt="Post content"
                    className="w-full h-auto rounded-lg mb-3 object-cover max-h-96"
                />
            )}
            
            {/* Likes & Comments */}
            <div className="flex justify-between text-gray-500 text-sm mt-3">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLikeUnlike}
                        className="flex items-center gap-1">
                        {isLikedByCurrentUser ? (
                            <FaHeart className='text-red-500'/>
                        ) :(
                            <FaRegHeart className='text-red-500'/>
                        )}
                        <span>{currentLikesCount} Likes</span>
                    </button>
                    <button 
                        onClick={() => setShowCommentSection(prev => !prev)}
                        className="flex items-center gap-1">
                        <FaRegCommentAlt/>
                        <span>{commentsCount} Comments</span>
                    </button>
                </div>
            </div>

            {showCommentSection && (
                <CommentSection
                    postId={post._id}
                    comments={post.comments}
                    onCommentAdded={handleCommentAddedToPost}
                />
            )}

        </div>
  );
};

export default PostCard;