"use client"
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import Link from 'next/link';
const Dashboard = () => {

  const { user } = useUser();
  const fileList = useQuery(api.pdfStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress
  })


  return (
    <div>
      <h2 className='font-bold text-2xl'>Workspace</h2>
      <div className='grid grid-cols-4 gap-5 '>
        {fileList && fileList?.map((file) => (
          <Link href={'workspace/' + file.fileId} key={file.fileId} >
          <div key={file.fileId} className='flex flex-col gap-2 items-center justify-center p-5 mt-5 hover:bg-slate-300 rounded border-[1px] border-transparent hover:border-black cursor-pointer '>
            <Image src={"/pdf.png"} width={100} height={100} alt='pdf icon'/>
            <h2 className='text-xl font-bold '>{file.fileName}</h2>
          </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard