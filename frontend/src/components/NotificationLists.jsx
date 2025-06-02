import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationLists = () => {
   const [notifications, setNotifications] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchNotifcations = async () => {
         setLoading(true);
         setError(null);

         try {
            const response = await axios.get('/api/notifications');
            
            setNotifications(response.data);
         } catch (error) {
            console.error("Error fetching notifications:", error)
            setError(error.response?.data?.message || "Failed to load notifications")
         } finally {
            setLoading(false)
         }
      }

      fetchNotifcations();
   },[])

   const handleDeleteAllNotifications = async () => {
      if(window.confirm("Are you sure you wnat to delete all notifications?"))
         try {
            await axios.delete('/api/notifications');
            setNotifications([])
            alert("All notifications deleted!")
         } catch (error) {
            console.error("Error deleting notifications:", error)
            alert(error.response?.data?.message || "Failed to delete notifications")
         }
   }

   if(loading){
      return (
      <div className='bg-white p-6 rounded-lg w-full flex items-center justify-center h-40'>
        <div className="flex items-center space-x-2 text-gray-500">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading notifications...</span>
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
    <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
         <h2 className='text-2xl font-bold text-gray-800'>Notificatoins</h2>

         {notifications.length > 0 && (
            <button 
               onClick={handleDeleteAllNotifications}
               className='text-red-500 hover:text-red-700 transition-colors duration-200 text-sm font-semibold'
            >
               Delete All
            </button>
         )}
      </div>

      {notifications.length === 0 ? (
         <p className='text-gray-500 text-center py-4 text-lg italic'>
            You don't have any notifications yet
         </p>
      ): (
         <div className='space-y-4'> 
            {notifications.map(notification => (
               <div 
                  key={notification._id}
                  className='flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 rounded-md'
               >
                  <Link to={`/profile/${notification?.from?.username}`} className='flex items-center w-full'>
                     <img 
                        src={notification?.from?.profilePicture} 
                        className='w-10 h-10 rounded-full object-cover mr-3 border-2 border-blue-300 shadow-sm'
                     />
                     <div>
                        <p className='text-gray-800 text-sm'>
                        <span className='font-semibold text-glimsee-primary'>@{notification?.from?.username}</span>{' '}
                        {notification.type === 'follow' && 'started following you.'}
                        {notification.type === 'like' && 'liked you post.'}
                        {notification.type === 'comment' && 'commented on you post.'}
                        </p>
                        
                        {notification.createdAt && (
                           <p className='text-gray-500 text-xs'>
                              {formatDistanceToNow(new Date(notification.createdAt), {addSuffix:true})}
                           </p>
                        )}
                     </div>
                  </Link>
               </div>
            ))}
         </div>
      )}
    </div>
  )
}

export default NotificationLists