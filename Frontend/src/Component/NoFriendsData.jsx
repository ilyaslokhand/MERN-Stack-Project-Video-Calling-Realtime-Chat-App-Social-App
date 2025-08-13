import React from 'react'

const NoFriendsData = ({ message,title }) => {
  return (
    <div className='card bg-base-200 text-center p-4 mt-5'>
      <h2 className='font-bold mb-2 text-lg'>{title}</h2>
      <p className='text-base-content'>
        {message}
      </p>
    </div>
  )
}

export default NoFriendsData
