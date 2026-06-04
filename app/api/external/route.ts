import { NextRequest } from 'next/server';
 
export async function GET(request: NextRequest) {
  const response = await fetch('https://dummyjson.com/products?limit=1', {
    // Optional: forward some headers, add auth tokens, etc.
   // headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
  });
 
  // Transform or forward the response
  const data = await response.json();
  const transformed = { ...data, source: 'proxied-through-nextjs' };
 
  return new Response(JSON.stringify(transformed), {
    headers: { 'Content-Type': 'application/json' },
  });
}