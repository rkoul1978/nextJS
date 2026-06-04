import { NextRequest } from 'next/server';
import { cookies, headers } from 'next/headers';
 
export async function GET(request: NextRequest) {
  const api_token = process.env.API_TOKEN || '';
  // 1. Using 'next/headers' helpers
  const cookieStore = await cookies();
  cookieStore.set('token', api_token, {
    httpOnly: true,  // Recommended for security
    secure: true,    // Required for HTTPS
    maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
    path: '/',
  });
  const token = cookieStore.get('token');
 
  const headersList = await headers();
  const referer = headersList.get('referer');
 
  // 2. Using the standard Web APIs
  const userAgent = request.headers.get('user-agent');
 
  return new Response(JSON.stringify({ token, referer, userAgent }), {
    headers: { 'Content-Type': 'application/json' },
  });
}