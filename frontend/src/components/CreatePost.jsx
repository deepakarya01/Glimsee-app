import axios from 'axios';
import React , {useState} from 'react'
import { useSelector } from 'react-redux';

const CreatePost = ({onPostCreated}) => {
   const [postText, setPostText] = useState('');
   const [postImage, setPostImage] = useState(null);
   const {user} = useSelector((state) => state.auth);
   const [imagePreview, setImagePreview] = useState(null);
   const [isPosting, setIsPosting] = useState(false);
   const [error, setError] =  useState(null);

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if(file){
         setPostImage(file);
         setImagePreview(URL.createObjectURL(file));
         setError(null)
      } else {
         setPostImage(null)
         setImagePreview(null)

      }
   }

   const handleRemoveImage = () => {
      setPostImage(null);
      setImagePreview(null);
      const fileInput = document.getElementById("post-image-input")
      if(fileInput){
         fileInput.value = "";
      }
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      if(!postText.trim() && !postImage){
         return "Post can't be empty!";
      }

      setIsPosting(true)
      setError(null);

      const formData = new FormData();
      formData.append("text", postText);
      if(postImage){
         formData.append("img", postImage);
      }

      try {
         const response = await axios.post('/api/posts', formData, {
            headers:{
               'Content-Type':'multipart/form-data',
            },
         });
         const newPost = response.data;
         if(onPostCreated){
            onPostCreated(newPost);
         }
         
      } catch (error) {
         console.error("Error in CreatePost:", error);
      } finally {
         setIsPosting(false);
         setPostImage('')
         setPostText('');
         setImagePreview('');
      }
      
   }

   return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Create a new post</h2>
            <form onSubmit={handleSubmit}>
                <div className='flex items-start mb-4'>
                    <img
                        src={user?.profilePicture}
                        alt="User Avatar"
                        className='w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0'
                    />
                    <textarea
                        className='w-full h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-glimsee-primary text-gray-700'
                        placeholder="What's on your mind? share a glimpse..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        disabled={isPosting}
                    />
                </div>

                {/* Image preview */}
                {imagePreview && (
                    <div className='mb-4 relative'>
                        <img src={imagePreview} alt="Post preview" className='w-full h-auto max-h-64 object-cover rounded-md mb-2' />
                        <button
                            type='button'
                            onClick={handleRemoveImage}
                            className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs font-bold'
                        >
                            X
                        </button>
                    </div>
                )}

                {/* File name */}
                {postImage && !imagePreview && (
                    <div className='mb-4 flex items-center justify-between bg-gray-50 p-2 rounded-md'>
                        <p className='text-gray-700 text-sm italic'>{postImage.name}</p>
                        <button
                            type='button'
                            onClick={handleRemoveImage}
                            className='text-red-500 hover:text-red-700 text-sm font-semibold'
                        >
                            Remove
                        </button>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <div className='flex justify-between items-center mt-2'>
                    <label className='cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 ease-in-out'>
                        Add Photo
                        <input
                            id="post-image-input"
                            type="file"
                            accept='image/*'
                            className='hidden'
                            onChange={handleImageChange}
                            disabled={isPosting}
                        />
                    </label>
                    <button
                        type='submit'
                        className='bg-gradient-to-r from-glimsee-primary to-glimsee-secondary text-white px-6 py-2 rounded-lg font-semibold hover:from-glimsee-secondary hover:to-glimsee-primary transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isPosting || (!postText.trim() && !postImage)}
                    >
                        {isPosting ? 'Posting...' : 'Post Glimsee'}
                    </button>
                </div>
            </form>
        </div>
  )
}

export default CreatePost