import { CloudUpload } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UploadFileComponent() {
  const [file, setFile] = useState<File | null>(null);

  async function UploadFile () {
    try {
      if(!file ) {
        toast.info("File not Uploaded or Selected! Please select a file")
        return;
      }

      // Step -1 
      // getting the PUT presigned URL from S3 

      // Extract file extension from the original filename
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = `${file.name.replace(/\.[^/.]+$/, "")}-${Date.now()}.${fileExtension}`;

      const res1 = await fetch ("/api/S3/UploadFile", {
        method :"POST",
        body : JSON.stringify({
          fileType : file.type,
          fileName : fileName,
        }),
      })

      const {uploadURL} = await res1.json();
      if (!uploadURL) {
        toast.error ("Failed to get upload URL")
        return;
      }

      // Uploading the file to this presigned URL 
      const uploadResponse = await fetch (uploadURL, {
        method : "PUT" , 
        headers : {
          "Content-Type" : file?.type || "",
        },
        body : file
      }); 

      if (!uploadResponse.ok) {
        toast.error ("Failed to upload file")
        return;
      } else {
        toast.success ("File Uploaded Successfully!")
       
      }

        // Step -2 
        // Generating the  GET presigned URL  

      const res2 = await fetch ('/api/S3/getURL' , {
        method : "POST" , 
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify({
          key : fileName,
        })
      })

      if (!res2.ok) {
        toast.error ("Failed to get file URL")
        return;
      }

      const data = await res2.json();
      console.log ("GET pres-signed URL is : " , data.url )
      
      // STEP-3 
      // Passing the GET presigned URL to Gemini API  
        const res3  = await fetch ('/api/GeneratePrompt',{
          method : "POST" , 
          headers: {
            "Content-Type": "application/json",
          },
          body : JSON.stringify({
            url : data.url,
          })
        })
        
        if (!res3.ok) {
          toast.error ("Failed to generate prompts")
          return;
        }
        
        const GeminiResponse = await res3.text();
        const jsonResponse = JSON.parse(GeminiResponse);
        console.info("Gemini API Response is : " , jsonResponse[0].prompt1 )
    

    }
    catch (error ) {
      console.error ("error is occured : " , error )
    }
  }



  return (
    <Empty className="border border-dashed my-40">
      <EmptyHeader>
        <EmptyMedia variant="icon">
        <CloudUpload />
        </EmptyMedia>
        <EmptyTitle>Upload Your Image</EmptyTitle>
        <EmptyDescription>
          Note: Image uplaodes on the cloud and no one can access it except you.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
      <Input 
        id="picture" 
        type="file" 
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            setFile(selectedFile);
          }
        }}
      />
        <Button variant="outline" size="sm" className="mt-4" onClick={UploadFile}>
          Upload Files
        </Button>
      </EmptyContent>
    </Empty>
  )
}
