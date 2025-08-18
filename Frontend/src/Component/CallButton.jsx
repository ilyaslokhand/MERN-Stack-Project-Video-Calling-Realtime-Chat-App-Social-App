import { VideoIcon } from 'lucide-react'
import React from 'react'

const CallButton = ({handlevideocall}) => {
  return (
    <div className='absolute  flex justify-end w-full mx-auto p-3 '>
      <button className='btn btn-success btn-sm text-white' onClick={handlevideocall}>
        <VideoIcon className='size-6'/>
      </button>
    </div>
  )
}

export default CallButton
