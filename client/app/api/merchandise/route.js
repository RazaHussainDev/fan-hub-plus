import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  try {
    const res = await fetch(`${backendBase}/api/merchandise?${queryString}`, {
      next: { revalidate: 30 }
    });
    if (!res.ok) throw new Error('Backend failed');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Next.js merchandise route error:", error.message);
    return NextResponse.json({ success: false, results: [], count: 0 }, { status: 500 });
  }
}
