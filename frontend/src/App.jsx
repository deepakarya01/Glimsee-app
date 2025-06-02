import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { loginSuccess } from "./feeatures/authSlice"

import LoginForm from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Home from './pages/Home'
import Navbar from "./components/Navbar"
import ProfilePage from "./pages/Profile"
import NotificationLists from "./components/NotificationLists"

axios.defaults.withCredentials = true;

function App() {
  const {user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/auth/me')
        dispatch(loginSuccess(response.data.user));
      } catch (error) {
        if(error.response && error.response.status === 401){
          console.log("User is not authenticated (401 Unauthenticated)")
          dispatch(loginSuccess(null))
        } else {
          console.error("Auth check failed:", error);
          dispatch(loginSuccess(null)); 
        }
      }
    }

    checkAuthStatus();
  },[dispatch])

  return (
    <>
      <BrowserRouter>

        <Navbar/>

        <div className="pt-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={ user ? <Home/> : <LoginForm/>} />
            <Route path='/login' element={<LoginForm/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            
            <Route path="/notifications" element={user ?  <NotificationLists/> : <LoginForm/> } />
            <Route path="/profile/:username" element={user? <ProfilePage/> : <LoginForm/>} />
          </Routes>
          </div>
        </div>
        
      </BrowserRouter>
    </>
  )
}

export default App
