import React, { useState } from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  const{login, checkAuth} = useContext(AuthContext);
  const navigate = useNavigate();


  
  const handleSubmit=async(e)=>{
    e.preventDefault();
     const success= await login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password });
     console.log("Navigating to home...");

     if(success) {
      await checkAuth();
      navigate('/');  
     }
  };
 

  return (
    <div className='min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      <form onSubmit={handleSubmit} className='border-2 bg-white/8 border-green-800 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
      <h2 className='font-medium text-2xl flex justify-between gap-2 items-center'>{currState}
      <img src="/chat-icon.svg" alt="" className='w-10' />
      </h2>

{currState==="Sign up" &&
( <input type="text" onChange={(e)=>setFullName(e.target.value)} value={fullName} className='p-2 border border-green-800 rounded-md focus:outline-none' placeholder='Full Name' required />)
}
      <>
        <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:border-none focus:ring-2 focus:ring-teal-600' placeholder='example@email.com' required />
        <input type="text" onChange={(e)=>setPassword(e.target.value)} value={password} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:border-none focus:ring-2 focus:ring-teal-600' placeholder='password' required />
      </>

      <button type='submit' className='py-3 bg-gradient-to-r from-green-500/40 via-emerald-600/40 to-teal-600/40 hover:from-green-600/50 hover:to-teal-700/50 transition-all duration-300 rounded-lg cursor-pointer'>
        {currState==="Sign up"? "Create Account" :"Login"}
      </button>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <input type="checkbox" required/>
        <p>Agree to the terms of use & privacy policy.</p>
      </div>
      <div className='flex items-center justify-center'>
      {currState=="Sign up"?(
        <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>setCurrState("Login")} className='font-medium text-indigo-500 cursor-pointer'>Login here</span></p>
      ):(
        <p className='text-sm text-gray-500'>Don't have an account? <span onClick={()=>setCurrState("Sign up")}className='font-medium text-indigo-500 cursor-pointer'>Create one</span></p>
      )}
      </div>
      </form>
    </div>
  )
}

export default LoginPage;
