import { NextRequest, NextResponse } from 'next/server';

// Set your FernHQ customer type here
const CUSTOMER_TYPE = 'INDIVIDUAL'; // or 'BUSINESS', etc.

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();
		if (!email || typeof email !== 'string') {
			return NextResponse.json({ error: 'Email is required and must be a string.' }, { status: 400 });
		}

			const response = await fetch('https://api.fernhq.com/customers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${process.env.FERNHQ_API_KEY}`,
				},
				body: JSON.stringify({
					customerType: CUSTOMER_TYPE,
                    firstName: "Shubhi",
                    lastName: "Upadhyay",
					email: email,
				}),
			});

		const data = await response.json();
		// Return only the customerId as an object, handle if not present
		if (data && typeof data.customerId === 'string') {
			return NextResponse.json({ customerId: data.customerId }, { status: response.status });
		} else {
			return NextResponse.json({ error: 'customerId not found in response', raw: data }, { status: 500 });
		}
	} catch (error: any) {
		return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
	}
}
