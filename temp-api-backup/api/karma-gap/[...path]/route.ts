import { NextRequest, NextResponse } from 'next/server';
import { karmaGAPConfig } from '../../../../config/karma';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  
  if (!path || path.length === 0) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const endpoint = '/' + path.join('/');
  const url = new URL(endpoint, karmaGAPConfig.apiBaseURL);
  
  // Copy query parameters from the original request
  const searchParams = request.nextUrl.searchParams;
  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${karmaGAPConfig.apiKey}`,
      },
      // Add caching headers
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Karma GAP API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 