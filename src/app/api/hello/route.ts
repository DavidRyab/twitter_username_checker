import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if(!username) {
        throw new Error('username must be provided');
    }
    const baseUrl = process.env.BACKEND_BASE_URL;
    console.log(`base: ${baseUrl}. username: ${username}`)
    const result  = axios.post(`${baseUrl}/check-username`, {username})
    .then( (res: any) => res.data );
    const resp = await result;
    console.log({resp})
    return NextResponse.json(resp);
    
    } catch (error: any) {
       console.log(error.message);
    }

}
  