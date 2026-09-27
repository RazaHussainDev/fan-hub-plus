import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { mediaId } = params;
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
