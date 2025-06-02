import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {loginSuccess} from '../feeatures/authSlice';
import { FaCamera, FaTimes } from 'react-icons/fa';

const EditProfileModal = ({ user, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
    });
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(user.profilePicture || '');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if(user){
            setFormData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
            })
            setPreviewImage(user.profilePicture)
            setProfilePictureFile(null)
            setError('')
            setLoading(false);
        }
    },[user])

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
       if(file){
        setProfilePictureFile(file);
        setPreviewImage(URL.createObjectURL(file));
       } else {
        setProfilePictureFile(null)
        setPreviewImage(user.profilePicture);
       }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSubmit = { ...formData }; // Start with current form data

            // Check if a new profile picture file has been selected
            if (profilePictureFile) {
                // Use FileReader to convert the file to a Base64 string
                const reader = new FileReader();
                reader.readAsDataURL(profilePictureFile);

                await new Promise((resolve, reject) => {
                    reader.onloadend = () => {
                        dataToSubmit.profilePicture = reader.result; // Base64 string for Cloudinary
                        resolve();
                    };
                    reader.onerror = reject;
                });
            } else {
                // If no new file is selected, send the existing profile picture URL
                // This ensures that if the user doesn't change the image, the old one is sent.
                // If user.profilePicture was empty, it will be an empty string, and your backend handles that.
                dataToSubmit.profilePicture = user.profilePicture || '';
            }

            // Send the request to your backend
            // Assuming your backend route is POST /api/users/update
            const response = await axios.post('/api/users/update', dataToSubmit);

            // Update Redux state with the new user data
            dispatch(loginSuccess(response.data.user));

            // Notify parent component (ProfilePage) about the update
            onUpdate(response.data.user);

            // Close the modal
            onClose();

        } catch (err) {
            console.error("Error updating profile:", err);
            // Display specific error message from backend if available
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md max-h-[90vh] bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-bold text-gray-700">Edit Profile</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                
                {/* Modal body */}
                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <div 
                            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded related text-sm' 
                            role='alert'
                        >
                            {error}
                        </div>
                    )}
                    
                    {/* Profile picture upload */}
                    <div className="mb-4 flex flex-col items-center gap-2">
                        <div className="relative w-28 h-28">
                            <img 
                                src={previewImage} 
                                alt="Profile preview" 
                                className="w-full h-full rounded-full object-cover shadow-sm border-4 border-gray-200"
                            />
                            <label 
                                htmlFor="profilePictureInput"
                                title='Change profile picture'
                                className='absolute bottom-0 right-0 bg-white rounded-full p-2 border-gray-200 shadow-sm'
                            >
                                <input
                                    id='profilePictureInput' 
                                    type="file"
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    className='hidden'
                                    disabled={loading}
                                />
                                <FaCamera className="h-5 w-5 text-gray-500" />
                            </label>
                        </div>
                        <p className='text-sm text-gray-500'>Click camera icon to change picture</p>
                    </div>

                    {/* Form filed */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 mb-2"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 mb-2"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 mb-2"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-gray-700 text-sm font-medium mb-1">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 mb-2"
                            rows="3"
                            maxLength="160"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 text-right mt-1">{formData.bio.length}/160</p>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 mb-2"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="website" className="block text-gray-700 text-sm font-medium mb-1">Website</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 mb-2"
                            disabled={loading}
                        />
                    </div>


                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-md hover:from-blue-600 hover:to-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;