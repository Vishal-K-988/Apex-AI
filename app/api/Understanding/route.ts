import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API 

export async function POST (){

try {


    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
        model : "gemini-2.5-flash",
       
        contents : "How does ai works ! "
    }) 
    
    const textContent = response.text || ""

    return new Response(textContent, {
        headers: {
            'Content-Type': 'text/plain',
        },
    })
}
catch (error){
    console.error ("error is occured : " , error )
    return new Response(JSON.stringify({ error: "An error occurred" }), {
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

}