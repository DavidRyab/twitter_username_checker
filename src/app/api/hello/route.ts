import axios from "axios";
import UserAgent from 'user-agents';
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
      const agent = new UserAgent();
      // const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
      const userAgent = agent.toString();
  
      // Create an instance of axios with default configuration
      const instance = axios.create();
  
      // Add a request interceptor to modify the configuration before sending the request
      instance.interceptors.request.use(config => {
      // Add a random delay between 1 and 5 seconds
      const delay = Math.floor(Math.random() * 4000) + 1000;
      return new Promise(resolve => setTimeout(() => resolve(config), delay));
      });
  
      // Add a request interceptor to modify the user agent header
      instance.interceptors.request.use(config => {
      config.headers['User-Agent'] = userAgent;
      return config;
      });
  
  
    const response = await axios.get(`https://proxy.scrapeops.io/v1/?api_key=6bcf45ae-d3c3-4bdb-b1b9-5f9e93021431&url=https://www.instagram.com/${username}`
      );
      const body = response.data;
      
      const count = (body.match(new RegExp(username, 'gi')) || []).length;
      console.log(`Found ${count} occurrences of "${username}"`);
      if(count > 30){
           return {
          data: {
            result: false
          },
          error: null
        } 
      } else {
        return {
          data: {
            result: true
          },
          error: null
        } 
      }
  
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
  