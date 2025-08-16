import { NextRequest, NextResponse } from 'next/server';

// Set your FernHQ customer type here
const CUSTOMER_TYPE = 'INDIVIDUAL'; // or 'BUSINESS', etc.

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      address,
      employmentStatus,
      mostRecentOccupation,
      sourceOfFunds,
      accountPurpose,
      expectedMonthlyPaymentsUsd,
      governmentIdNumber,
      govIdIssuanceDate,
      govIdExpirationDate,
      frontIdImage,
      backIdImage,
    } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required and must be a string.' },
        { status: 400 }
      );
    }

    const kycData = {
      legalFirstName: firstName,
      legalLastName: lastName,
      phoneNumber,
      dateOfBirth,
      address,
      employmentStatus,
      mostRecentOccupation,
      sourceOfFunds,
      accountPurpose,
      expectedMonthlyPaymentsUsd,
      isIntermediary: false,
      documents: [
        {
          type: "GOVERNMENT_ID",
          subtype: "DRIVERS_LICENSE",
          countryCode: address.countryCode || "US",
          documentIdNumber: governmentIdNumber,
          issuanceDate: govIdIssuanceDate,
          expirationDate: govIdExpirationDate,
          frontIdImage,   
          backIdImage,  
          description: "US driver's license"
        },
        {
          type: "PROOF_OF_ADDRESS",
          subtype: "UTILITY_BILL",
          countryCode: address.countryCode || "US",
          proofOfAddressImage: "data:image/jpeg;base64,REPLACE_PROOF_BASE64",
          issuanceDate: "2024-01-10",
          description: "Electric bill from January 2024"
        }
      ]
    };

    const payload = {
      customerType: CUSTOMER_TYPE,
      firstName,
      lastName,
      email,
      kycData
    };

    console.log('FernHQ payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api.fernhq.com/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FERNHQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('FernHQ full response:', JSON.stringify(data, null, 2));

    if (response.ok && data && typeof data.customerId === 'string') {
      return NextResponse.json({ customerId: data.customerId }, { status: response.status });
    } else {
      return NextResponse.json({
        error: data?.message || data?.error || 'Unknown FernHQ error',
        code: data?.code,
        raw: data
      }, { status: response.status || 500 });
    }
  } catch (error: any) {
    console.error('Internal error in create_account route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
