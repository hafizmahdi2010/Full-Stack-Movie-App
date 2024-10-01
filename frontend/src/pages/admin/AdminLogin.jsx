import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api_base_url } from '../../helper';

const AdminLogin = () => {


  const [email, setEmail] = useState("");
  const [adminKey, setadminKey] = useState("");
  const [pwd, setPwd] = useState("");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(api_base_url + "/checkAdmin", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: pwd,
        key: adminKey,
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        localStorage.setItem("isAdmin", true);
        setTimeout(() => {
          navigate("/createMovie");
        }, 100);
      }
      else {
        alert(data.msg)
      }
    })
  }

  return (
    <>
      <div className="container w-screen min-h-screen flex flex-col items-center justify-center bg-[#09090B] text-white">
        <div className="w-[23vw] bg-[#18181B] h-[auto] flex flex-col p-[20px] shadow-black/50 rounded-lg">
          <h3 className='text-2xl mb-2'>Admin Login</h3>
          <form onSubmit={handleSubmit}>

            <div className='inputBox mt-3'>
              <input onChange={(e) => { setEmail(e.target.value) }} value={email} required type="email" placeholder='Email' />
            </div>

            <div className='inputBox mt-3'>
              <input onChange={(e) => { setPwd(e.target.value) }} value={pwd} required type="password" placeholder='Password' />
            </div>

            <div className='inputBox mt-3'>
              <input onChange={(e) => { setadminKey(e.target.value) }} value={adminKey} required type="text" placeholder='Admin Key' />
            </div>

            <p className='mb-3 text-red-500'>{error}</p>

            <button className='btnBlue w-full text-[15px]'>Login</button>
          </form>
        </div>

      </div>
    </>
  )
}

export default AdminLogin