import { NextResponse } from 'next/server';
import { generatePlaybookAi } from '@/lib/ai/client';
import type { PlaybookInput } from '@/lib/types';

import { fetchImdForecast } from '@/lib/weather/fetch-imd';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    // (We assume body matches PlaybookInput, but in real world we'd use PlaybookInputSchema.parse)
    const input: PlaybookInput = body as PlaybookInput;
    
    if (!input.location || !input.familyMembers || !input.preferences) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Fetch IMD Forecast internally
    const forecast = await fetchImdForecast(input.location.state, input.location.district);

    const playbook = await generatePlaybookAi(input, forecast);
    
    return NextResponse.json(playbook);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
