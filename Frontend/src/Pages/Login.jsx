import React, { useState } from "react";
import useLoggedinUser from "../Hooks/useLoggedinUser";
import { Link } from "react-router-dom";

const Login = () => {
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });

  const { mutate, error, isPending,isError } = useLoggedinUser();

  const handleloggedinUser = (e) => {
    e.preventDefault();
    mutate(loginData);
  };

 return (
   <div  className='w-full min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8 overflow-auto'>

      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

        {/* { signup form } */}
         
        <div className='flex flex-col space-y-4 p-4 sm:p-8 lg:w-1/2 justify-center'>
        {isError && (
            <div className="alert alert-error mb-4">
              {error.response.data.message || "Something went wrong"}
            </div>
          )}
         <form onSubmit={handleloggedinUser}>
          <div className='text-white'>
          <h2 className='text-xl font-semibold'>Welcome Back</h2>
          <p className='text-sm opacity-70'>Signin into your account to continue your langauge journey</p>
          </div>
          
          <div className='space-y-3'>
            <div className="form-control w-full">
          <label className="label"><span className="label-text">Email</span></label>
          <input className="input input-bordered w-full" placeholder='hello@example.com' type='email' required value={loginData.email} onChange={(e) => setloginData({ ...loginData, email: e.target.value })}/>
            </div>
            <div className="form-control w-full">
          <label className="label"><span className="label-text">Password</span></label>
          <input className="input input-bordered w-full" placeholder='********' type='password' required value={loginData.password} onChange={(e) => setloginData({ ...loginData, password: e.target.value })}/>
            </div>
            
            <button className='btn btn-primary w-full' type='submit'>
              {isPending? (
              <>
              <span className="loading loading-spinner loading-xs"></span>
                      Loading...
              </>
            ):(
              "Login"
            )}
            </button>
          </div>
          <div className='text-center text-sm leading-tight mt-5'>
          <p> Dont have an account? <Link to="/signup" className="text-primary hover:underline">
          Create Account
          </Link>
          </p>
          </div>
          </form>
        </div>
        
        {/* {image} */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
        <div className="max-w-md p-8">
        <div className="aspect-square max-w-sm mx-auto">
        <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
        </div>
        <div className='text-center'>
        <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
        <p className="opacity-70">
        Practice conversations, make friends, and improve your language skills together
        </p>
        </div>
        </div>
        </div>
      </div>
    </div>
  )
};

export default Login;
