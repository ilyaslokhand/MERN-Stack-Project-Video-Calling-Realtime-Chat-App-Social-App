import React from 'react'
import { Link } from 'react-router'
import { LANGUAGE_TO_FLAG } from '../constant'

const FrienddataCard = ({FriendListdata}) => {
  return (
    <div className='card bg-base-200'>
      <div className='card-body p-4'>

        {/* fetch username and profile */}
       <div className='flex gap-3'>
        <div className='avatar size-12'>
          <img src={FriendListdata?.profilepic} alt={FriendListdata?.fullName}/>
        </div>
        <p>{FriendListdata?.fullName}</p>
       </div>
       {/* fetch the langauge  */}
       <div className='flex flex-wrap'>
      <span className='badge badge-secondary text-xs'>
      {getLangaugeFlag(FriendListdata?.nativelangauge)}
      native:{FriendListdata?.nativelangauge}
      </span>
      <span className='badge badge-outline text-xs'>
      {getLangaugeFlag(FriendListdata?.Learninglangauge)}
      native:{FriendListdata?.Learninglangauge}
      </span>
       </div>
       <div>
        <Link className='btn btn-ghost w-full' to={`/chats/${FriendListdata?._id}`}>Message</Link>
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