import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNowStrict } from 'date-fns';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CommentSection = ({ postId, comments, onCommentAdded, onCommentDeleted }) => {
    // Removed initialComments prop as it's redundant with 'comments'
    const { user: currentUser } = useSelector((state) => state.auth);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState('');

    // Initialize displayedComments directly from the 'comments' prop.
    // If the parent ensures 'comments' is always up-to-date (by refetching),
    // then this state primarily serves the optimistic update fallback.
    const [displayedComments, setDisplayedComments] = useState(comments || []);

    // Effect to update displayedComments when the 'comments' prop changes from parent.
    // This is crucial if the parent component is responsible for fetching the latest comments
    // and passing them down (which is the recommended approach).
    useEffect(() => {
        setDisplayedComments(comments || []);
    }, [comments]); // Depend on 'comments' prop

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setCommentError('');

        if (!currentUser) {
            setCommentError("Kindly log in to add a comment."); // Improved message
            return;
        }
        if (!commentText.trim()) {
            setCommentError("Comment cannot be empty.");
            return;
        }

        setIsSubmittingComment(true);
        try {
            const response = await axios.post(`/api/posts/comment/${postId}`, { text: commentText });

            // console.log("Comment response:", response); // Removed console.log for cleaner output

            // IMPORTANT: If onCommentAdded is provided, the parent is expected to refetch
            // and update the 'comments' prop, which will then update displayedComments via useEffect.
            if (onCommentAdded) {
                onCommentAdded(postId); // Notify parent to refresh comments for this post
            } else {
                // FALLBACK: Optimistically add the comment to the local state if no onCommentAdded handler.
                // This is less reliable but provides immediate UI feedback.
                // Make sure `currentUser` has `name` and `profilePicture` for this to work well.
                const newLocalComment = {
                    _id: Date.now().toString(), // Unique temporary ID for local display
                    user: {
                        _id: currentUser._id,
                        username: currentUser.username,
                        name: currentUser.name || currentUser.username, // Use name if available
                        profilePicture: currentUser.profilePicture || '/image_fec0ad.png'
                    },
                    text: commentText,
                    createdAt: new Date().toISOString(),
                };
                setDisplayedComments(prevComments => [newLocalComment, ...prevComments]); // Add new comment to top
            }

            setCommentText(''); // Clear comment input
            // Consider removing alert(response.data.message) for smoother UX
            // alert(response.data.message);

        } catch (err) {
            console.error("Error commenting on post:", err);
            setCommentError(err.response?.data?.message || 'Failed to add comment. Please try again.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Placeholder for future comment deletion functionality
   //  const handleDeleteComment = async (commentId) => {
   //      if (!window.confirm("Are you sure you want to delete this comment?")) {
   //          return;
   //      }
   //      // Assuming you have a backend route like DELETE /api/posts/comment/:postId/:commentId
   //      try {
   //          // await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
   //          // console.log("Comment deleted successfully");
   //          // if (onCommentDeleted) {
   //          //     onCommentDeleted(postId, commentId); // Notify parent
   //          // } else {
   //          //     setDisplayedComments(prev => prev.filter(comment => comment._id !== commentId));
   //          // }
   //          alert("Delete comment functionality not yet implemented on backend.");
   //      } catch (error) {
   //          console.error("Error deleting comment:", error);
   //          alert("Failed to delete comment.");
   //      }
   //  };

    return (
        <div className='mt-4 border-t pt-4 border-gray-200'>
            {currentUser ? (
                <form onSubmit={handleCommentSubmit} className='mb-4 flex items-center'> {/* Added flex and items-center for better layout */}
                    <img
                        src={currentUser.profilePicture}
                        alt={`${currentUser.username}'s profile`}
                        className='w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0'
                    />
                    <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder='Add a comment...'
                        className='flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm'
                        disabled={isSubmittingComment}
                    />
                    <button
                        type='submit'
                        className='ml-2 bg-blue-500 text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isSubmittingComment || !commentText.trim()}
                    >
                        {isSubmittingComment ? "Posting..." : "Post"}
                    </button>
                </form>
            ) : (
                <p className='text-gray-500 text-sm mb-4 text-center'>
                    <Link to='/login' className='text-blue-500 hover:underline'>Log in</Link> {/* Fixed typo */}
                    to add a comment.
                </p>
            )}

            {/* Comment error */}
            {commentError && (
                <p className='text-red-500 text-sm mb-3 text-center'>{commentError}</p>
            )}

            {Array.isArray(displayedComments) && displayedComments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No comments yet. Be the first one!</p>
            ) : (
                <div className='space-y-3'>
                    {/* Ensure comments are always iterated over an array */}
                    {Array.isArray(displayedComments) && displayedComments.map((comment) => (
                        <div key={comment._id} className='flex items-start'>
                            <Link to={`/profile/${comment.user.username}`}>
                                <img
                                    src={comment.user.profilePicture || '/image_fec0ad.png'} // Added fallback
                                    alt={`${comment.user.username}'s profile`}
                                    className='w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0'
                                />
                            </Link>
                            <div className='bg-gray-100 rounded-xl p-2 flex-1'>
                                <div className='flex justify-between items-center mb-0.5'>
                                    <Link
                                        to={`/profile/${comment.user.username}`}
                                        className="font-semibold text-gray-800 text-sm hover:underline" // Added classes for consistency
                                    >
                                        {comment.user.name || comment.user.username} {/* Prefer name, fallback to username */}
                                    </Link>
                                    <span className="text-xs text-gray-500 ml-2"> {/* Added classes for consistency */}
                                        {formatDistanceToNowStrict(new Date(comment.createdAt), {addSuffix: true})}
                                    </span>
                                </div>
                                <p className='text-gray-700 text-sm break-words'>{comment.text}</p>
                            </div>
                            {/* Optional: Add delete comment button for comment owner or post owner */}
                            {/* You need to pass postAuthorId as a prop to CommentSection to enable deletion for post owner */}
                            {/* For example: <CommentSection postId={post._id} comments={post.comments} postAuthorId={post.author._id} ... /> */}
                            {/* {currentUser && (currentUser._id === comment.user._id || (postAuthorId && currentUser._id === postAuthorId)) && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="ml-2 text-gray-400 hover:text-red-500"
                                    title="Delete comment"
                                >
                                    <FaTimes size={12} />
                                </button>
                            )} */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommentSection;