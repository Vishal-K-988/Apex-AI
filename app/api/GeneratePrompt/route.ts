import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API 

export async function POST (request: Request){

try {
    // if  api key is missing 
    if (!apiKey) {
        return new Response ("API key is missing", { status: 401 });
    }

    const { url: imageURL } = await request.json();
    
    if (!imageURL) {
        return new Response ("Image URL is missing", { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey })
    const response = await fetch (imageURL)
    const imageArrayBuffer = await response.arrayBuffer();
  const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

//   structure of the prompt 
//   {
//     "prompts" : {
//         "Gemini Prompt 1" : "prompt1",
//         "Gemini Prompt 2" : "prompt2",
//         "Gemini Prompt 3" : "prompt3",
//     }
//   }
    const result = await ai.models.generateContent({
        model : "gemini-2.5-flash",
        contents : [
            {
                inlineData : {
                    mimeType : "image/jpeg",
                    data : base64ImageData
            },
        },
        {
            text : `I want you to give me suggested prompts for this uploaded image. For reference :1.  remove the background from this image or 2. add mountains into this image or 3. make it a black and white image or 4. make it a sepia tone image or 5. make it a vintage image or 6. make it a neon image or 7. make it a cyberpunk image or 8. make it a steampunk image or 9. make it a retro image or 10. make it a comic book image or 11. make it a watercolor image or 12. make it a oil painting image or 13. make it a acrylic painting image or 14. make it a digital painting image or 15. make it a sketch image or 16. make it a pencil sketch image or 17. make it a watercolor sketch image or 18. make it a oil painting sketch image or 19. make it a acrylic painting sketch image or 20. make it a digital painting sketch image 
            Note that : Every image will have unique prompt based on the uploaded image . 
            I wanted you to give me only 3 prompts for the uploaded image in a JSON format like this : 
            [{"prompt1' : "hello there } , {"prompt2" :  "mewo mewo "}]
            Note that : Every prompt should be unique and should be related to the uploaded image.
            Note that : Every prompt should be in a JSON format.
       
            `
        }
        ],
    });

    const textResult = await result.text;
    
    if (!textResult) {
        return new Response(JSON.stringify({ error: "No response from AI" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    
    let data = textResult;
    
    // Remove markdown code block markers (```json and ```)
    data = data.trim();
    data = data.replace(/^```json\s*/i, ''); // Remove ```json at the start (case insensitive)
    data = data.replace(/^```\s*/i, ''); // Remove ``` at the start (in case it's just ```)
    data = data.replace(/\s*```\s*$/i, ''); // Remove ``` at the end
    data = data.trim(); // Remove any remaining whitespace
    
    return new Response(data, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
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