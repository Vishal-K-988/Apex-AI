'use client'
export default function Home() {


    async function handleClick () {
        try {
            console.log("button cliucked ! ")
            const response  = await fetch ("/api/Understanding" , {
                method : "POST",
              
            })
            const data = await response.text()
            console.log ("respone is : " , data )
        }
        catch (error ){
            console.error ("error is occured : " , error )
        }
    }
  return (
    <>
    
        <div className=" flex justify-center items-center h-screen">
            <button onClick={handleClick}>Click me </button>
        </div>
    </>
  )
}