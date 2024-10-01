import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import SingleMovie from './pages/SingleMovie';
import AdminLogin from './pages/admin/AdminLogin';
import CreateMovie from './pages/admin/CreateMovie';

const App = () => {

  let isLoggedIn = localStorage.getItem("isLoggedIn");
  let isAdmin = localStorage.getItem("isAdmin");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to={"/login"}/>} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/singleMovie/:movieId' element={isLoggedIn ? <SingleMovie /> : <Navigate to={"/login"}/>} />


          {/* Admin routes */}
          <Route path='/adminLogin' element={<AdminLogin />} />
          <Route path='/createMovie' element={isAdmin ? <CreateMovie /> : <Navigate to="/adminLogin"/>} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App