import { BellIcon, HomeIcon, UsersIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router'

const Sidebar = () => {

  const [isOpen, setisOpen] = useState(true)

  const currentPath = location.pathname

  return (
    <aside className="h-screen sticky border-r bg-base-200 border-base-300 w-64 " onClick={()=>setisOpen(false)}>
      <div>
        <nav className=' mt-10 p-4 space-y-1'>
          <Link to="/" className={`btn btn-ghost w-full normal-case justify-start ${
            currentPath === "/"? "btn-active": ""
          }`}>
          <HomeIcon className="size-5 text-base-content opacity-70"/>
          <span>Home</span>
          </Link>
          <Link to="/Friends" className={`btn btn-ghost w-full normal-case justify-start ${
            currentPath === "/Friends"? "btn-active": ""
          }`}>
          <UsersIcon  className="size-5 text-base-content opacity-70"/>
          <span>Friends</span>
          </Link>
          <Link to="/notification" className={`btn btn-ghost w-full normal-case justify-start ${
            currentPath === "/notification"? "btn-active": ""
          }`}>
          <BellIcon  className="size-5 text-base-content opacity-70"/>
          <span>Notifications</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
