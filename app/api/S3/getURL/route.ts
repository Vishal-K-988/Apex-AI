import { s3 } from "@/app/utils/awsClient";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    
    try {
        const { key } = await request.json();
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
        });
        
        // getting the GET pre-signed URL 
        const url = await getSignedUrl(s3, command , { expiresIn: 500 });
        return NextResponse.json ({ url });
    }
    catch (error ) {
        console.error ("error is occured : " , error )
        return NextResponse.json ({ error: "Internal Server Error" }, { status: 500 })
    }
}