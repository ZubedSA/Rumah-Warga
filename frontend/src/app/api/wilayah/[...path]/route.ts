import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const url = `https://www.emsifa.com/api-wilayah-indonesia/api/${path.join('/')}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch from external API: ${res.statusText}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Wilayah Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
