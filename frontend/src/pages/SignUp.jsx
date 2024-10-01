import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api_base_url } from '../helper';

const SignUp = () => {

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(api_base_url + "/signUp",{
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({
        username: username,
        name: name,
        email: email,
        password: pwd
      })
    }).then((res)=>res.json()).then((data)=>{
      if(data.success){
        alert("Account Created Successfully")
        navigate("/login");
      }
      else{
        setError(data.message)
      }
    })
  }

  return (
    <>
      <div className="container w-screen min-h-screen flex flex-col items-center justify-center bg-[#09090B] text-white">
        <div className="w-[23vw] bg-[#18181B] h-[auto] flex flex-col p-[20px] shadow-black/50 rounded-lg">
          <h3 className='text-2xl mb-6'>SignUp</h3>
          <form onSubmit={handleSubmit}>
            <div className='inputBox'>
              <input onChange={(e)=>{setUsername(e.target.value)}} value={username} required type="text" placeholder='Username' />
            </div>

            <div className='inputBox mt-3'>
              <input onChange={(e)=>{setName(e.target.value)}} value={name} required type="text" placeholder='Name' />
            </div>

            <div className='inputBox mt-3'>
              <input onChange={(e)=>{setEmail(e.target.value)}} value={email} required type="email" placeholder='Email' />
            </div>

            <div className='inputBox mt-3'>
              <input onChange={(e)=>{setPwd(e.target.value)}} value={pwd} required type="password" placeholder='Password' />
            </div>

            <p className='mb-1 mt-2 text-[14px]'>Already have an account <Link className='text-[#1D4ED8]' to="/login">Login</Link></p>
            <p className='mb-3 text-red-500'>{error}</p>
        
           <button className='btnBlue w-full text-[15px]'>Sign Up</button>
          </form>
        </div>

      </div>
    </>
  )
}

export default SignUp