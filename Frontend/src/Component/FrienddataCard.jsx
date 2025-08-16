import React from 'react'
import { Link } from 'react-router'
import { LANGUAGE_TO_FLAG } from '../constant'

const FrienddataCard = ({friend }) => {
  console.log("newfriend=>",friend)
  return (
    <div className='card bg-base-200 mt-10'>
      <div className='card-body p-4'>

        {/* fetch username and profile */}
       <div className='flex gap-3 items-center'>
        <div className='avatar size-12'>
          <img src={friend?.profilepic} alt={friend?.fullName}/>
        </div>
        <p>{friend?.fullName}</p>
       </div>
       {/* fetch the langauge  */}
       <div className='flex flex-wrap gap-3'>
      <span className='badge badge-secondary text-xs'>
      {getLangaugeFlag(friend?.nativelangauge)}
      native:{friend?.nativelangauge}
      </span>
      <span className='badge badge-outline text-xs'>
      {getLangaugeFlag(friend?.Learninglangauge)}
      native:{friend?.Learninglangauge}
      </span>
       </div>
       <div className='mt-3'>
        <Link className='btn btn-primary w-full' to={`/chats/${friend?._id}`}>Message</Link>
       </div>
      </div>
    </div>
  )
}

export default FrienddataCard


export const getLangaugeFlag = (langauge)=>{
 
  if (!langauge) return null
   
  const langaugetoLowercase = langauge.toLowerCase();
  const countryFlag = LANGUAGE_TO_FLAG[langaugetoLowercase]
  if (countryFlag) {
    return (
      <img 
       src={`https://flagcdn.com/24x18/${countryFlag}.png`} alt={langaugetoLowercase} className='inline-block h-3 mr-2'
      />
    )
  }
  return null;
}