"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import WorkspaceHeader from '../_components/WorkspaceHeader';
import PdfViewer from '../_components/PdfViewer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from '../_components/TextEditor';
function Workspace() {
    const {fileId} =useParams();
    const fileInfo = useQuery(api.pdfStorage.getFileRecord,{
        fileId:fileId
    })

 
   
  return (
    <div>
        <WorkspaceHeader fileName={fileInfo?.fileName}/>
        <div className='grid grid-cols-2 gap-5 '>
            <div className='overflow-y-scroll h-[83vh] relative'>
                {/* Text Editor */}
                <TextEditor fileId={fileId}/>
            </div>
            <div>
                {/* pdf viewer  */}
                <PdfViewer fileUrl={fileInfo?.fileUrl}  />
            </div>
        </div>
    </div>
  )
}

export default Workspace