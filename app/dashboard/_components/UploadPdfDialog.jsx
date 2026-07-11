"use client"
import React from 'react'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
    
    } from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2Icon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import uuid4 from 'uuid4'
import axios from 'axios'

    
function UploadPdfDialog({children, isMaxFile}) {


    const generateUploadUrl = useMutation(api.pdfStorage.generateUploadUrl);
    const InsertFileEntry = useMutation(api.pdfStorage.AddFileEntryToDb);
    const getFileUrl = useMutation(api.pdfStorage.getFileUrl);
    const embeddDocument = useAction(api.myAction.ingest)

    const {user} = useUser();
    const [file, setFile]= useState("")
    const [fileName, setFileName]= useState("")
    const [loading, setLoading]= useState(false)
    const [open , setOpen] = useState(false)
    const OnFileSelect =(e)=>{
        setFile(e.target.files[0]);
    }
    const OnUpload = async()=>{
        setLoading(true)
         // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();

         // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
        });
        
        const {storageId} = await result.json();
        // console.log('storageId', storageId);

        // Step 3: Insert the file entry into the database

        const fileId = uuid4();
        const fileUrl = await getFileUrl({storageId:storageId});
        const resp = await InsertFileEntry(
            {fileId:fileId, 
            storageId:storageId, 
            fileName:fileName||"Untitled File", 
            fileUrl:fileUrl,
            createdBy:user?.primaryEmailAddress?.emailAddress}
        );
        //Api Call to Fetch PDF Process data

        const ApiResp = await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
        console.log(ApiResp.data.result);

        const embeddedResult =  embeddDocument({
            splitText:ApiResp.data.result,
            fileId:{fileId:fileId}
        })
        // console.log(embeddedResult);
        setLoading(false)
        setOpen(false)
    }
    return (
    
        <Dialog open = {open}>
            <DialogTrigger asChild className="w-full">
                <Button className='w-full bg-black rounded text-white shadow-zinc-500  shadow-sm hover:text-black hover:border-[1px] hover:border-black ' onClick={()=>setOpen(true)} disabled={isMaxFile}> + Upload PDF</Button>
            </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload PDF File</DialogTitle>
                </DialogHeader>
                    <DialogDescription asChild>
                        <div>
                            <div className='mt-5 p-3 '>
                                <h2 className='mb-2'>Select a file to upload</h2>
                                <input type="file" accept='application/pdf'
                                onChange={(e)=>OnFileSelect(e)}/>
                            </div>
                            <div className='p-3'>
                                <label> File name *</label>
                                <Input placeholder="File name" className='bg-slate-200' onChange={(e)=>setFileName(e.target.value)} required={true}/>
                            </div>
                            <div>

                            </div>
                        </div>
                    </DialogDescription>
                    <DialogFooter className="sm:justify-start md:justify-end">
                        <DialogClose asChild>
                            <div >
                            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                            </div>
                        </DialogClose>
                        <Button type="submit" className="bg-black text-white shadow-sm rounded hover:text-black hover:border-[1px] hover:border-black "   onClick={OnUpload} disabled={loading}>
                        {loading ? <Loader2Icon className='animate-spin'/> : "Upload"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
        </Dialog>

    
    )
}

export default UploadPdfDialog