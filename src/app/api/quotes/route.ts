import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { customerId, source, destination } = body;
    
    if (!customerId || !source || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, source, destination' },
        { status: 400 }
      );
    }

    // Validate source fields
    if (!source.sourcePaymentAccountId || !source.sourceCurrency || 
        !source.sourcePaymentMethod || !source.sourceAmount) {
      return NextResponse.json(
        { error: 'Missing required source fields' },
        { status: 400 }
      );
    }

    // Validate destination fields
    if (!destination.destinationPaymentAccountId || !destination.destinationPaymentMethod || 
        !destination.destinationCurrency) {
      return NextResponse.json(
        { error: 'Missing required destination fields' },
        { status: 400 }
      );
    }

    // Get API token from environment variable
    const apiToken = process.env.FERN_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    // Prepare request to Fern API
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${apiToken}`);

    const raw = JSON.stringify({
      customerId,
      source,
      destination
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect
    };

    // Make request to Fern API
    const response = await fetch("https://api.fernhq.com/quotes/", requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Fern API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Quote API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
