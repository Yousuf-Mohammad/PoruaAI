"use client"
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";


export default function Home() {

  const {user} = useUser();
  const createUser = useMutation(api.user.createUser);
  const checkUser = async()=>{
    const result =await createUser({
      email:user?.primaryEmailAddress?.emailAddress,
      userName:user?.fullName || user?.username,
      imageUrl:user?.imageUrl});
      console.log(result);
  }

  useEffect(()=>{
    user&&checkUser();
  },[user])
  return (
    
    <section className="absolute inset-0 -z-10 w-full h-screen items-center justify-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] text-white ">
    <div className="mx-auto max-w-screen-xl  lg:flex lg:h-screen lg:items-center">
      <div className="mx-auto max-w-6xl text-center">
        <h1
          className="text-4xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text  font-extrabold text-transparent "
        >
          Porua AI:Smarter Notes, Faster Insights.
  
          <span className="sm:block "> Unlock your AI superpower! </span>
        </h1>
  
        <p className="mx-auto mt-4 max-w-xl  sm:text-lg/relaxed">
          Transform how you interact with PDFs. Porua AI lets you extract key insights and create notes effortlessly in seconds. Say goodbye to manual highlighting and hello to smarter productivity.


        </p>
  
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link
            className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
            href={user?.primaryEmailAddress?.emailAddress ?'/dashboard':'/sign-in'}
          >
            Get Started 
          </Link>
  
          
        </div>
      </div>
    </div>
    </section>



    
  )
}
