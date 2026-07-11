import { NextResponse } from 'next/server';
import { fetchImdForecast } from '@/lib/weather/fetch-imd';

export async function POST(request: Request) {
  try {
    const { state, district } = await request.json();

    if (!state || !district) {
      return NextResponse.json({ error: 'State and district required' }, { status: 400 });
    }

    const forecast = await fetchImdForecast(state, district);
    return NextResponse.json({ forecast });
  } catch (error) {
    console.error('IMD Forecast API Error:', error);
    return NextResponse.json({ forecast: null });
  }
}
