# Tea on Chain Frontend

A modern, responsive frontend application for the Tea on Chain platform, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Home Page**: Welcome page with platform overview and statistics
- **Signup Page**: User registration form with validation
- **ID Page**: Digital identity management and profile viewing
- **Stake Page**: Token staking interface with multiple pools
- **Surf Page**: Tea market exploration with search and filtering
- **Instruction Popup Component**: Reusable modal for displaying instructions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
src/app/
├── frontend/                 # Main frontend application
│   ├── components/          # Reusable components
│   │   ├── InstructionPopup.tsx
│   │   └── index.ts
│   ├── id/                  # ID/Profile page
│   │   └── page.tsx
│   ├── signup/              # Signup page
│   │   └── page.tsx
│   ├── stake/               # Staking page
│   │   └── page.tsx
│   ├── surf/                # Market surfing page
│   │   └── page.tsx
│   ├── layout.tsx           # Frontend layout with navigation
│   └── page.tsx             # Home page
├── layout.tsx               # Root layout
├── page.tsx                 # Root page (redirects to frontend)
└── globals.css              # Global styles
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Pages Overview

### Home Page (`/frontend`)
- Platform introduction and features
- Quick navigation to other sections
- Platform statistics display

### Signup Page (`/frontend/signup`)
- User registration form
- Form validation
- Terms and conditions agreement

### ID Page (`/frontend/id`)
- Digital identity display
- Editable profile information
- Reputation and statistics
- Quick action buttons

### Stake Page (`/frontend/stake`)
- Multiple staking pools with different APY rates
- Token staking interface
- Position management
- Reward claiming

### Surf Page (`/frontend/surf`)
- Tea market exploration
- Search and filtering capabilities
- Tea item display with ratings and prices
- Shopping cart functionality

## Components

### InstructionPopup
A reusable modal component for displaying instructions and information:
- Customizable title and content
- Auto-close functionality
- Responsive design
- Backdrop click to close

## Styling

The application uses Tailwind CSS for styling with a consistent green tea theme:
- Primary colors: Green shades (`green-600`, `green-700`, etc.)
- Background: Gradient backgrounds with transparency
- Cards: White backgrounds with backdrop blur effects
- Responsive: Mobile-first design with responsive breakpoints

## Navigation

The frontend includes a sticky navigation header with:
- Logo and branding
- Navigation links to all major sections
- Mobile-responsive hamburger menu
- Consistent navigation across all pages

## Future Enhancements

- User authentication and login
- Wallet integration
- Real-time data updates
- Advanced filtering and sorting
- User reviews and ratings
- Shopping cart and checkout
- Admin dashboard
- API integration with blockchain

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management and side effects
- **Responsive Design**: Mobile-first approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
