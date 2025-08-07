import React, { useState } from 'react'
import { useMutation, useQueryClient} from '@tanstack/react-query'
import { Singup } from '../Lib/Api'
import { Link } from 'react-router'

const Signup = () => {

  const [signupData, setsignupData] = useState({
    fullName:"",
    email:"",
    password:""
  })

  const QueryClient = useQueryClient()

     const {mutate, isPending, isError,error, }=useMutation({
      mutationFn: Singup,
      onSuccess: ()=> QueryClient.invalidateQueries({ queryKey: ["authuser"]})
     })


  const handleSignup = (e)=>{
    e.preventDefault()
    mutate(signupData)
  }

  return (
   <div data-theme="forest" className='w-full min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8 overflow-auto'>

      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

        {/* { signup form } */}
         
        <div className='flex flex-col space-y-4 p-4 sm:p-8 lg:w-1/2'>
        {isError && (
            <div className="alert alert-error mb-4">
              {error.response.data.message || "Something went wrong"}
            </div>
          )}
         <form onSubmit={handleSignup}>
          <div className='text-white'>
          <h2 className='text-xl font-semibold'>Create And Account</h2>
          <p className='text-sm opacity-70'>Join Lanconnect and start your langauge journey today  </p>
          </div>
          
          <div className='space-y-3'>
          <div className="form-control w-full">
          <label className="label"><span className="label-text" >Full Name</span></label>
          <input className="input input-bordered w-full" placeholder='john deo' type='text' required value={signupData.fullName} onChange={(e) => setsignupData({ ...signupData, fullName: e.target.value })}/>
            </div>
            <div className="form-control w-full">
          <label className="label"><span className="label-text">Email</span></label>
          <input className="input input-bordered w-full" placeholder='hello@example.com' type='email' required value={signupData.email} onChange={(e) => setsignupData({ ...signupData, email: e.target.value })}/>
            </div>
            <div className="form-control w-full">
          <label className="label"><span className="label-text">Password</span></label>
          <input className="input input-bordered w-full" placeholder='********' type='password' required value={signupData.password} onChange={(e) => setsignupData({ ...signupData, password: e.target.value })}/>
            </div>
             <div className="form-control ">
             <label className="label cursor-pointer justify-start gap-2">
              <input type='checkbox' className="checkbox checkbox-sm" required/>
              <span className='text-xs leading-tight'> I agree to the{" "}<span className='text-primary hover:underline"'>terms of service </span>and <span className='text-primary hover:underline"'>privacy policy</span></span>
             </label>
            </div>
            <button className='btn btn-primary w-full' type='submit'>
              {isPending? (
              <>
              <span className="loading loading-spinner loading-xs"></span>
                      Loading...
              </>
            ):(
              "Create Account"
            )}
            </button>
          </div>
          <div className='text-center text-sm leading-tight mt-5'>
          <p> Already have an accound? <Link to="/Login" className="text-primary hover:underline">
          Sign in
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
}

export default Signup
