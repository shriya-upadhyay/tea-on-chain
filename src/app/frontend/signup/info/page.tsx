export default function InfoPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-pink-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#FF5884] mb-2">User Information</h1>
            <p className="text-[#FF5884]">Please provide your details</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#FF5884] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#FF5884] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
              />
            </div>
            
            <button className="w-full bg-[#FF5884] hover:bg-[#E04A7A] text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-6">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 