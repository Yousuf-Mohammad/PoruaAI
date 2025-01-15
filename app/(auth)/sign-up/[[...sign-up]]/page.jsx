import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className='flex justify-center items-center h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] '>
    <SignUp />
  </div>)
}