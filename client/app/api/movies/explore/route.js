import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  
  try {
    const res = await fetch(`http://localhost:5000/api/content/movies?page=${page}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Backend failed');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
