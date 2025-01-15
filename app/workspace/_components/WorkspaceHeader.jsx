"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader({fileName}) {
    return (
    <div className='flex justify-between items-center m-4 shadow-md'>
        <Image src="/ai.png" alt="Vercel Logo" width={100} height={100} className='p-4 m-2 ' />
        <h1 className='text-xl font-bold '>{`Name of Your PDF file: ${fileName}`}</h1>
        <UserButton />
    </div>
    )
}

export default WorkspaceHeader