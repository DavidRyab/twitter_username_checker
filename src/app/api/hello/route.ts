import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if(!username) {
        throw new Error('username must be provided');
    }
    const res = await checkName(username);
    return NextResponse.json(res);
    
    } catch (error: any) {
       console.log(error.message);
    }

}

async function checkName(username: string){
    try {
    console.log(`${process.env.BACKEND_BASE_URL}/check-username`)
    const response = await axios.post(`${process.env.BACKEND_BASE_URL}/check-username`,{username},{
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    const body = response.data;
    console.log({body})
    return body
  
    } catch (error: any) {
      console.error(`Error fetching ${username}: ${error.message}`);
      return {
        data: null,
        error: {
          reason: error.message
        }
      }
    }
  }
  