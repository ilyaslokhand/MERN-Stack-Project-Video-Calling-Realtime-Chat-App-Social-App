import { BellIcon, LogOutIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'
import ThemeSelector from './ThemeSelector'
import useauthUser from '../Hooks/useauthUser'
import useLogout from '../Hooks/useLogout'

const Navbar = () => {
  const {authUser} = useauthUser()

  const { mutate } = useLogout();


  return (
    <div className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='flex items-center ml-auto gap-3 sm:gap-4'>
        <div>
          <Link to="/notification">
          <button className="btn btn-ghost btn-circle">
            <BellIcon className="h-6 w-6 text-base-content opacity-70"/>
          </button>
          </Link>
        </div>
        <ThemeSelector/>
        <div className='w-9 rounded-full'>
          <img src={authUser?.profilepic}  rel="noreferrer"/>
        </div>
        <div>
          <button className="btn btn-ghost btn-circle" onClick={() => mutate()}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70"/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
