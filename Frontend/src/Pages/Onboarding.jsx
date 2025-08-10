import React, { useState } from 'react'
import useauthUser from '../Hooks/useauthUser'
import {  useMutation, useQueryClient } from '@tanstack/react-query'
import { onBoarding } from '../Lib/Api'
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES } from '../constant'
import toast from "react-hot-toast";


const Onboarding = () => {
  const { authUser} = useauthUser()
  const QueryClient = useQueryClient();

  const [boardingData,setboardingData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilepic: authUser?.profilepic || "",
    nativelangauge: authUser?.nativelangauge || "",
    Learninglangauge: authUser?.Learninglangauge || "",
    location: authUser?.location || ""
  })

  const {mutate, error,isError,isPending}= useMutation(
    {
      mutationFn:onBoarding,
      onSuccess: ()=> {
      toast.success("Profile onboarded successfully");
        QueryClient.invalidateQueries({ queryKey: ["authuser"]})
      },
      onError: (error)=>{
        toast.error(error.response.data.message)
      }
    }
  )

    const handleRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const randomAvatar =  `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    setboardingData({ ...boardingData, profilepic: randomAvatar });
    toast.success("Random profile picture generated!");
};

  const handleonBoardingbtn = (e)=>{
    e.preventDefault()
    mutate(boardingData)
  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-base-100 p-4' >
      <div className='card bg-base-200 w-full max-w-3xl'>
      <div className="card-body p-6 sm:p-8">
        <h1 className='text-2xl sm:text-3xl font-bold text-center'>Complete Your Profile</h1>
        <form onSubmit={handleonBoardingbtn}>
          <div className='flex flex-col justify-center items-center mt-6'>
            <div className='size-32 rounded-full'>
              {boardingData.profilepic? (
               <img src={boardingData.profilepic} alt="Profile Preview" className="w-full h-full object-cover"/>
              ):
              (
                <CameraIcon className="size-12 text-base-content opacity-40" />
              )
              }
            </div>
            <div className='mt-5'>
              <button type='button' className="btn btn-accent" onClick={handleRandomAvatar}>
              <ShuffleIcon className="size-4 mr-2"  />Generate Random Avatar</button>
            </div>
          </div>
          <div className="form-control w-full">
          <label className="label"><span className="label-text" >Full Name</span></label>
          <input className="input input-bordered w-full" placeholder='john deo' type='text' required value={boardingData.fullName} onChange={(e) => setboardingData({...boardingData, fullName: e.target.value })}/>
            </div>
            <div className="form-control w-full">
          <label className="label"><span className="label-text" >Bio</span></label>
          <textarea
                name="bio"
                
                value={boardingData.bio}
                onChange={(e) => setboardingData({ ...boardingData, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className="form-control ">
            <label className="label"><span className="label-text" >Native Language</span></label>
             <select className="select select-bordered w-full" name='nativeLanguage' value={boardingData.nativelangauge} onChange={(e) => setboardingData({...boardingData, nativelangauge: e.target.value })}>
              
                <option>Select your native language</option>
              {LANGUAGES.map((lang)=>(
                <option key={lang} value={lang.toLowerCase()}>{lang}</option>
              ))}
              
             </select>
              </div>
              <div className="form-control ">
            <label className="label"><span className="label-text" >Learning Language</span></label>
             <select className="select select-bordered w-full" name='Learning Language' value={boardingData.Learninglangauge} onChange={(e) => setboardingData({...boardingData, Learninglangauge: e.target.value })}>
              
                <option>Select your Learning Language</option>
              {LANGUAGES.map((lang)=>(
                <option key={lang} value={lang.toLowerCase()}>{lang}</option>
              ))}
              
             </select>
              </div>
            </div>
            <div className="form-control w-full">
            <label className="label"><span className="label-text" >Location</span></label>
            <div className='relative'>
            <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
            <input className="input input-bordered w-full pl-10" placeholder='City, Country' type='text' required value={boardingData.location} onChange={(e) => setboardingData({...boardingData, location: e.target.value })}/>

            </div>
            </div>
            <div className='mt-10'>
              <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
              </button>
            </div>
        </form>
      </div>
      </div>
    </div>
  )
}

export default Onboarding
