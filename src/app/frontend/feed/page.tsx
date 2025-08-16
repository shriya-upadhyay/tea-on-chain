export default function FeedPage() {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border-2 border-[#FF5884] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
          />
        </div>
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        {/* Card 1 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-4">
          <div className="h-32 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-4">
          <div className="h-32 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-4">
          <div className="h-32 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Card 4 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-4">
          <div className="h-32 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>

        {/* Card 5 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-4">
          <div className="h-32 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
} 