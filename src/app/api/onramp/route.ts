import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Mock mode: return fake data if USE_MOCKS is set
  if (process.env.USE_MOCKS === 'true') {
    const { customerId } = await req.json();
    return NextResponse.json({
      cryptoWallet: {
        paymentAccountId: 'mock-crypto-wallet-id',
        paymentAccountType: 'EXTERNAL_CRYPTO_WALLET',
        paymentAccountStatus: 'ACTIVE',
        createdAt: new Date().toISOString(),
        customerId: 'mock-customer-id',
        externalCryptoWallet: {
          cryptoWalletType: 'EVM',
          chain: 'ARBITRUM',
          address: '0x1234567890123456789012345678901234567890',
        },
        isThirdParty: false,
      },
      bankAccount: {
        paymentAccountId: 'mock-bank-account-id',
        paymentAccountType: 'EXTERNAL_BANK_ACCOUNT',
        paymentAccountStatus: 'ACTIVE',
        createdAt: new Date().toISOString(),
        customerId: 'mock-customer-id',
        externalBankAccount: {
          accountNumber: '00123456789',
          bankName: 'Chase Bank',
          bankAccountCurrency: 'USD',
        },
      },
      quote: {
        quoteId: 'mock-quote-id',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        estimatedExchangeRate: '1.2',
        destinationAmount: '100',
        fees: {
          feeCurrency: {
            label: 'USDC',
            chain: 'ARBITRUM',
            contractAddress: '0x123456789abcd123456789abcd123456789abcd',
            currencyDecimals: 18,
          },
          fernFee: {
            feeAmount: '5.45',
            feeUSDAmount: '5.45',
          },
          developerFee: {
            feeAmount: '5.45',
            feeUSDAmount: '5.45',
          },
        },
      },
      transaction: {
        transactionId: 'mock-transaction-id',
        status: 'SUBMITTED',
        quoteId: 'mock-quote-id',
        correlationId: 'mock-correlation-id',
        "source": {
            "sourcePaymentAccountId": 'mock-bank-account-id',
            "sourceCurrency": {
            "label": "USD",
            },
            "sourceAmount": "100"

        },
        "destination": {
            "destinationPaymentAccountId": 'mock-crypto-wallet-id',
            "destinationPaymentMethod": "ARBITRUM",
            "destinationCurrency": {
                "label": "USDC",
                "chain": "ARBITRUM",
                "contractAddress": "0x123456789abcd123456789abcd123456789abcd",
                "currencyDecimals": 6
            },
            "exchangeRate": "1.2",
            "destinationAmount": "100"
        },
        createdAt: new Date().toISOString(),
      },
    }, { status: 200 });
  }
  try {
    const { customerId } = await req.json();

    // 1. Create external crypto wallet
    const cryptoWalletRes = await fetch('https://api.fernhq.com/payment-accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FERNHQ_API_KEY}`,
      },
      body: JSON.stringify({
        paymentAccountType: 'EXTERNAL_CRYPTO_WALLET',
        customerId,
        externalCryptoWallet: {
          cryptoWalletType: 'EVM',
          chain: 'ARBITRUM',
          address: '0x1234567890123456789012345678901234567890',
        },
      }),
    });
    const cryptoWalletData = await cryptoWalletRes.json();
    if (!cryptoWalletData.paymentAccountId) {
      return NextResponse.json({
        error: 'Failed to create crypto wallet',
        cryptoWallet: cryptoWalletData
      }, { status: 400 });
    }

    // 2. Create external bank account (example minimal payload, adjust as needed)
    const bankAccountRes = await fetch('https://api.fernhq.com/payment-accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FERNHQ_API_KEY}`,
      },
      body: JSON.stringify({
        paymentAccountType: 'EXTERNAL_BANK_ACCOUNT',
        customerId,
        nickname: 'Savings Account',
        externalBankAccount: {
          accountNumber: '00123456789',
          bankName: 'Chase Bank',
          bankAccountCurrency: 'USD',
          bankAddress: {
            country: 'US',
            addressLine1: '350 5th Avenue',
            addressLine2: 'Floor 21',
            city: 'New York',
            state: 'New York',
            stateCode: 'NY',
            postalCode: '10016',
            locale: 'en-US',
          },
          bankAccountType: 'CHECKING',
          bankAccountPaymentMethod: 'ACH',
          bankAccountOwner: {
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            businessName: 'Fern LLC',
            address: {
              country: 'US',
              addressLine1: '350 5th Avenue',
              addressLine2: 'Floor 21',
              city: 'New York',
              state: 'New York',
              stateCode: 'NY',
              postalCode: '10016',
              locale: 'en-US',
            },
            type: 'INDIVIDUAL',
          },
          routingNumber: '021000021',
        },
      }),
    });
    const bankAccountData = await bankAccountRes.json();
    if (!bankAccountData.paymentAccountId) {
      return NextResponse.json({
        error: 'Failed to create bank account',
        bankAccount: bankAccountData
      }, { status: 400 });
    }


    // 3. Get quote info
    const quoteRes = await fetch('https://api.fernhq.com/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FERNHQ_API_KEY}`,
      },
      body: JSON.stringify({
        customerId,
        source: {
          sourcePaymentAccountId: bankAccountData.paymentAccountId,
          sourceCurrency: "USD",
          sourcePaymentMethod: "ACH",
          sourceAmount: "100"
        },
        destination: {
          destinationPaymentAccountId: cryptoWalletData.paymentAccountId,
          destinationPaymentMethod: "ARBITRUM",
          destinationCurrency: "USDC"
        },
        developerFee: {
          developerFeeType: "USD",
          developerFeeAmount: "5.45"
        }
      }),
    });
    const quoteData = await quoteRes.json();
    if (!quoteData.quoteId) {
      return NextResponse.json({
        error: 'Failed to get quote',
        quote: quoteData
      }, { status: 400 });
    }

    // 4. Submit the transaction using the quoteId
    // Generate a random correlationId for demonstration (in production, use a real unique value)
    const correlationId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    const transactionRes = await fetch('https://api.fernhq.com/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FERNHQ_API_KEY}`,
        'x-idempotency-key': "text",
      },
      body: JSON.stringify({
        quoteId: quoteData.quoteId,
        correlationId,
      }),
    });
    const transactionData = await transactionRes.json();

    // Return all responses
    return NextResponse.json({
      cryptoWallet: cryptoWalletData,
      bankAccount: bankAccountData,
      quote: quoteData,
      transaction: transactionData,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
