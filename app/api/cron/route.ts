import type { NextRequest } from 'next/server';
 
export function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
 
  return Response.json({ success: true });
}