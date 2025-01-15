"use client"
import {Button} from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Box, Layout, Sheet, Shield } from "lucide-react"
import Image from 'next/image'
import React from 'react'
import UploadPdfDialog from "./UploadPdfDialog"
import { useUser } from "@clerk/nextjs"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
const SideBar = () => {
      const { user } = useUser();
      const path = usePathname();
      const fileList = useQuery(api.pdfStorage.getUserFiles, {
        userEmail: user?.primaryEmailAddress?.emailAddress
      })
    // console.log(fileList?.length);
  return (
    <div className='shadow-sm shadow-black h-screen p-7 relative border-l-2 '>
        <Image src="/ai.png" alt="Vercel Logo" width={100} height={100} className='p-2 m-2 mx-auto' />

        <div className='mt-10'>
            
            <UploadPdfDialog isMaxFile={fileList?.length >= 5? true: false}/> 
            <Link href={'/dashboard'}>
            <div className={`flex gap-2 items-center justify-center p-5 mt-5 hover:bg-slate-300 rounded border-[1px] border-transparent hover:border-black cursor-pointer ${path === '/dashboard' ? 'bg-slate-300 border-black' : ''} `}>
                <Layout/>
                <h2>Workspace</h2>
            </div>
            </Link>
            <Link href={'/dashboard/upgrade'}>
            <div className={`flex gap-2 items-center justify-center p-5 mt-5 hover:bg-slate-300 rounded border-[1px] border-transparent hover:border-black cursor-pointer ${path === '/dashboard/upgrade' ? 'bg-slate-300 border-black' : ''} `}>
                <Box/>
                <h2>Upgrade</h2>
            </div>
            </Link>
        </div>
        <div className=" w-full absolute bottom-20 z-20" >
            <Progress value={(fileList?.length / 5) * 100} className="w-3/4"  />
            <p className="text-sm mt-2">{`${fileList?.length} of 5 files`}</p>
            <p className="text-xs text-gray-400 mt-2">Upgrade to upload more</p>
        </div>
    </div>
  )
}

export default SideBar