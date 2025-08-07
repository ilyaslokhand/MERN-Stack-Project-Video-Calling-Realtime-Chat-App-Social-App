import React from 'react'
import { LoaderIcon } from "lucide-react";

const Loader = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  )
}

export default Loader
