import { NextRequest, NextResponse } from 'next/server';

const QUOTES_API_URL = 'https://api.example.com/quotes';
const SUBMIT_TX_API_URL = 'https://api.example.com/submit-transaction';

export async function POST(req: NextRequest) {
    if (process.env.USE_MOCKS === 'true') {
        const { customerId, bankAccountData, cryptoWallet, amount, cryptoCurrency = "USDC", chain = "ARBITRUM" } = await req.json();
        return NextResponse.json({ 
            quoteData: {
                "quoteId": "quote_abc123",
                "expiresAt": "2025-03-20T12:24:49.717Z",
                "estimatedExchangeRate": "1.2",
                "destinationAmount": "100",
                "fees": {
                    "feeCurrency": {
                    "label": "USDC",
                    "chain": "ETHEREUM",
                    "contractAddress": "0x123456789abcd123456789abcd123456789abcd",
                    "currencyDecimals": 18
                    },
                    "fernFee": {
                    "feeAmount": "5.45",
                    "feeUSDAmount": "5.45"
                    },
                    "developerFee": {
                    "feeAmount": "5.45",
                    "feeUSDAmount": "5.45"
                    }
                }
            },

            transaction: {
                "transactionId": "mock_tx_id",
                "customerId": customerId, 
                "quoteId": "quote_abc123",
                "transactionStatus": "PROCESSING",
                "correlationId": "03b7030f-6da1-4e76-3352-3debd82112c8",
                "source": {
                    "sourcePaymentAccountId": cryptoWallet.paymentAccountId,
                    "sourceCurrency": {
                    "label": "USDC",
                    "chain": "ARBITRUM",
                    "contractAddress": "0x123456789abcd123456789abcd123456789abcd",
                    "currencyDecimals": 6
                    },
                    "sourcePaymentMethod": chain,
                    "sourceAmount": String(amount),
                },
                "destination": {
                    "destinationPaymentAccountId": bankAccountData.paymentAccountId,
                    "destinationPaymentMethod": "ACH",
                    "destinationCurrency": {
                    "label": "USD",
                    },
                    "exchangeRate": "1.2",
                    "destinationAmount": "100"
                },
                "fees": {
                    "feeCurrency": {
                    "label": "USDC",
                    "chain": "ETHEREUM",
                    "contractAddress": "0x123456789abcd123456789abcd123456789abcd",
                    "currencyDecimals": 18
                    },
                    "fernFee": {
                    "feeAmount": "5.45",
                    "feeUSDAmount": "5.45"
                    },
                    "developerFee": {
                    "feeAmount": "5.45",
                    "feeUSDAmount": "5.45"
                    }
                },
                "transferInstructions": {
                    "type": "fiat",
                    "transferPaymentMethod": "ACH",
                    "transferMessage": "Payment for order #12345",
                    "transferBankName": "First National Bank",
                    "transferBankAddress": "123 Bank St, Finance City",
                    "transferBankAccountNumber": "987654321",
                    "transferRoutingNumber": "123456789",
                    "transferBankBeneficiaryName": "John Doe",
                    "transferIban": "GB29NWBK60161331926819",
                    "transferBicSwift": "DEUTDEFF",
                    "transferIfscCode": "SBIN0005943",
                    "transferSortCode": "40-47-36",
                    "transferBsbNumber": "082-902",
                    "transferTransitNumber": "12345",
                    "transferBankCode": "001",
                    "transferClabeNumber": "002010077777777771",
                    "transferRoutingCode": "ROUT1234",
                    "transferBranchCode": "0001",
                    "transferClearingCode": "110000",
                    "transferCnapsCode": "102033003330",
                    "transferNubanCode": "1234567890",
                    "transferPixCode": "user@bank.com",
                    "transferPaymentLink": "https://secure.payzen.lat/t/paxsz1d7"
                },
                "createdAt": "2023-08-01T12:00:00Z",
                "updatedAt": "2023-08-01T12:00:00Z"

            }
        })

    }
    try {
        const { customerId, cryptoWallet, bankAccountData, amount, cryptoCurrency = "USDC", chain = "ARBITRUM" } = await req.json();

         if (!customerId) {
            return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
            }
            if (!bankAccountData?.paymentAccountId) {
            return NextResponse.json({ error: 'bankAccountData.paymentAccountId is required' }, { status: 400 });
            }
            if (amount == null) {
            return NextResponse.json({ error: 'amount (sourceAmount in USDC) is required' }, { status: 400 });
        }
        // Call the quotes API
       const quoteRes = await fetch('https://api.fernhq.com/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FERNHQ_API_KEY}`,
        },
        body: JSON.stringify({
            customerId,
            source: {
            sourcePaymentAccountId: cryptoWallet.paymentAccountId,
            sourceCurrency: cryptoCurrency,
            sourcePaymentMethod: chain,
            sourceAmount: amount,
            },
            destination: {
            destinationPaymentAccountId: bankAccountData.paymentAccountId,
            destinationPaymentMethod: "ACH",
            destinationCurrency: "USD"
            },
            developerFee: {
            developerFeeType: "USD",
            developerFeeAmount: "5.45"
            }
            }),
        });
        if (!quoteRes.ok) {
            return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
        }

        const quotesData = await quoteRes.json();
        if (!quoteRes.ok) {
            return NextResponse.json(
                { error: 'Quote failed', fern: quotesData },
                { status: quoteRes.status || 500 }
            );
        }

        // Call the submit transaction API with data from quotes
        const correlationId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
        const transactionRes = await fetch('https://api.fernhq.com/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.FERNHQ_API_KEY}`,
                'x-idempotency-key': "text",
            },
            body: JSON.stringify({
                quoteId: quotesData.quoteId,
                correlationId,
            }),
        });
        const transactionData = await transactionRes.json();

        if (!transactionRes.ok) {
            return NextResponse.json({ error: 'Submit transaction failed', fern: transactionData },
            { status: transactionRes.status || 500 });
        }


        return NextResponse.json({ quoteData: quotesData, transaction: transactionData });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Internal server error' },
      { status: 500 });
    }
}