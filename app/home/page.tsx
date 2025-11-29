'use client'

import UploadFileComponent from "../components/FileUploadComponent"


export default function Home() {


  
  return (
    <>
    
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-4xl font-bold">ApexEdit </h1>
            <UploadFileComponent/>
        </div>
    </>
  )
}