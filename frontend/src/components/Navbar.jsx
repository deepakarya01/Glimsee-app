import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import glimseeLogo from '../assets/GlimseeIcon.ico'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { logoutSuccess, setLoading, setError } from '../feeatures/authSlice'
import { resetMainContent } from '../feeatures/homeSlice'

import { MdHome } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";



const Navbar = () => {
   const {user} = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleLogout = async () => {
      try {
         await axios.post('/api/auth/logout')
         dispatch(logoutSuccess())
         navigate('/login')
      } catch (error) {
         console.error("Logout error", error)
         dispatch(setError(error.response?.data?.error || "Logout failed"))
      } finally {
         dispatch(setLoading(false))
      }
   }

   const handleHomeClick = () => {
      dispatch(resetMainContent());
   }

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md'>
      <div className='max-w-7xl mx-auto px-6 flex justify-between'>
         <div className='flex items-center space-x-2'>
            <Link 
               onClick={handleHomeClick}
               to='/' 
               className='flex items-center'>
               <img src={glimseeLogo} className='w-16 h-16' />
               <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-glimsee-primary to-glimsee-secondary">Glimsee</span>
            </Link>
         </div>
         <div className='flex items-center gap-4 space-x-0'>
            

            {user ? (
               <>
                  <Link 
                     to='/'
                     onClick={handleHomeClick}
                     className=' flex gap-1 text-gray-700 hover:text-glimsee-primary font-medium transition duration-150 ease-in-out'>
                     <MdHome size={24}/>   
                     Home  
                  </Link>
                  <Link 
                     to={"/notifications"} 
                     className=' flex  gap-1 text-gray-700 hover:text-glimsee-primary font-medium transition duration ease-in-out'>
                     <IoIosNotifications size={24}/>   
                     Notification
                  </Link>
                  <button 
                     className='text-gray-700 hover:text-glimsee-primary font-medium transition duration ease-in-out'
                     onClick={handleLogout}>Logout</button>
               </>
            ) : (
               <div className='flex space-x-4'>
                  <Link 
                     to="/login" 
                     className='text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow hover:text-glimsee-primary hover:bg-gray-200 font-bold transition duration-150 ease-in-out'>
                     Login
                  </Link>
               </div>
            )}
         </div>
      </div>
    </div>
  )
}

export default Navbar