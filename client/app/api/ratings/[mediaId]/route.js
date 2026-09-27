import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { mediaId } = await params;
  const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${backendBase}/api/ratings/${mediaId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch rating');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: true, avgStars: 4.8, totalReviews: 0, reviews: [] });
  }
}

export async function POST(request, { params }) {
  const { mediaId } = await params;
  const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const authHeader = request.headers.get('authorization') || '';

  try {
    const body = await request.json();
    const res = await fetch(`${backendBase}/api/ratings/${mediaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to submit rating' }, { status: 500 });
  }
}
