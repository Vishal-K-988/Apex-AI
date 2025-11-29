import { NextResponse } from "next/server";
import {s3} from "@/app/utils/awsClient";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST (request: Request) {
    

    try {
        const {fileType, fileName } = await request.json();


        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName,
            ContentType: fileType,
        });

        // generating the PUT pre-signed URL 
        const uploadURL  = await getSignedUrl(s3, command , { expiresIn: 300 });
        return NextResponse.json ({ uploadURL }, { status: 200 });
    } 
    catch (error ) {
        console.error ("error is occured : " , error )
        return NextResponse.json ({ error: "Internal Server Error" }, { status: 500 })
    }
}