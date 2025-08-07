import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({children}) => {
  return (
    <div className='min-h-screen'>
      <div className='flex'>
       <Sidebar/>
       <main>
        {children}
       </main>
      </div>

    </div>
  )
}

export default Layout
