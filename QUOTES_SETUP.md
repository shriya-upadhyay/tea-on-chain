# Quotes API Setup Guide

## Overview
This implementation provides a complete frontend and backend solution for getting quotes from the Fern API. Users can input their parameters through a web form, and the system will make the API call to Fern and return the results.

## Features
- **Frontend Form**: User-friendly interface for inputting quote parameters
- **Backend API**: Secure endpoint that validates input and forwards requests to Fern
- **Input Validation**: Comprehensive validation of all required fields
- **Error Handling**: Proper error handling and user feedback
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Setup Instructions

### 1. Environment Configuration
Create a `.env.local` file in your project root and add your Fern API token:

```bash
FERN_API_TOKEN=your_actual_fern_api_token_here
```

### 2. Install Dependencies
Run the following command to install all required dependencies:

```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Home Page**: `http://localhost:3000`
- **Quotes Page**: `http://localhost:3000/quotes`

## API Endpoint

### POST `/api/quotes`
Accepts the following JSON structure:

```json
{
  "customerId": "string",
  "source": {
    "sourcePaymentAccountId": "string",
    "sourceCurrency": "string",
    "sourcePaymentMethod": "string",
    "sourceAmount": "string"
  },
  "destination": {
    "destinationPaymentAccountId": "string",
    "destinationPaymentMethod": "string",
    "destinationCurrency": "string"
  }
}
```

## Form Fields

### Customer ID
- **Type**: Text input
- **Required**: Yes
- **Description**: Unique identifier for the customer

### Source Section
- **Payment Account ID**: Text input (required)
- **Currency**: Dropdown with options: USD, EUR, GBP, JPY
- **Payment Method**: Dropdown with options: ACH, WIRE, CARD
- **Amount**: Number input with decimal support (required)

### Destination Section
- **Payment Account ID**: Text input (required)
- **Payment Method**: Dropdown with options: BASE, POLYGON, ARBITRUM
- **Currency**: Dropdown with options: USDC, USDT, ETH, BTC

## Security Features
- API token stored in environment variables
- Input validation on both frontend and backend
- Error messages don't expose sensitive information
- Proper HTTP status codes for different error scenarios

## Error Handling
The system handles various error scenarios:
- Missing required fields
- Invalid API responses
- Network errors
- Server errors

## Styling
The interface uses Tailwind CSS for a modern, responsive design that works well on both desktop and mobile devices.

## Testing
To test the functionality:
1. Navigate to `/quotes`
2. Fill in the form with valid test data
3. Submit the form
4. Check the response display

## Production Considerations
- Ensure `FERN_API_TOKEN` is properly set in production environment
- Consider adding rate limiting
- Add logging for production debugging
- Implement proper CORS policies if needed
