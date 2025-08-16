# Dynamic Integration Setup

## Environment Variables Required

Create a `.env.local` file in your project root with:

```bash
# Dynamic Environment ID - Get this from your Dynamic dashboard
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here

# PYUSD Contract Address
NEXT_PUBLIC_DEV_PYUSD=0xYourPYUSDContractAddressHere
```

## What's Been Updated

### 1. Wagmi Configuration (`src/app/frontend/wagmi.ts`)
- ✅ Removed Gemini wallet connector
- ✅ Added Dynamic wallet connectors
- ✅ Set `multiInjectedProviderDiscovery: false` (Dynamic handles this)
- ✅ Configured for mainnet and sepolia

### 2. Providers (`src/app/frontend/providers.tsx`)
- ✅ Added `DynamicContextProvider` wrapper
- ✅ Added `DynamicWagmiConnector` for wagmi integration
- ✅ Configured with Ethereum wallet connectors

### 3. Wallet Component (`src/app/frontend/components/wallet.tsx`)
- ✅ Replaced custom wallet buttons with `<DynamicWidget />`
- ✅ Dynamic handles all wallet connections automatically
- ✅ Supports 100+ wallets out of the box

### 4. Auth Context (`src/app/frontend/contexts/AuthContext.tsx`)
- ✅ Simplified to work with Dynamic + wagmi
- ✅ Maintains compatibility with existing components

## Next Steps

1. **Get Dynamic Environment ID:**
   - Go to [Dynamic Dashboard](https://app.dynamic.xyz/)
   - Create a new project or use existing
   - Copy your environment ID

2. **Add to .env.local:**
   ```bash
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_id_here
   ```

3. **Test the integration:**
   - Visit `/frontend/signup/connect_wallet`
   - Click the Dynamic widget
   - Connect any supported wallet

## Benefits of Dynamic

- 🚀 **100+ Wallet Support** - MetaMask, WalletConnect, Coinbase, etc.
- 🎨 **Customizable UI** - Match your app's design
- 🔒 **Enterprise Security** - SOC2 compliant
- 📱 **Mobile Optimized** - Great mobile experience
- 🎯 **Easy Integration** - Simple setup with existing wagmi code

## Troubleshooting

If you see connection issues:
1. Check your Dynamic environment ID is correct
2. Ensure the environment ID is active in Dynamic dashboard
3. Check browser console for any errors
4. Verify your wagmi configuration matches supported chains 