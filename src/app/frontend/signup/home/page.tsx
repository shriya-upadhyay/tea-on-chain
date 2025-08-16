export default function SignupHomePage() {
  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Sign Up</h1>
            <p className="text-green-600">Sign up with Privy or connect your wallet</p>
          </div>
          
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
} 