import { NextResponse } from 'next/server';

export async function POST(request) {
  const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const body = await request.json();
    const res = await fetch(`${backendBase}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to submit feedback' }, { status: 500 });
  }
}
