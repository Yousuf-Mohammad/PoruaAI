import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-end items-center p-5 border-b-2 shadow-gray-200'>
            <UserButton />
    </div>
  )
}

export default Header