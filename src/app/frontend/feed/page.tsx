'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MenProfile {
  uuid: string;
  firstName: string;
  lastName: string;
  instagram: string;
  linkedin: string;
  facebook: string;
}

export default function FeedPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MenProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-men?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.profiles);
      } else {
        console.error('Search failed:', data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCreateProfile = () => {
    router.push('/frontend/createMan');
  };

  const handleProfileClick = (uuid: string) => {
    if (uuid && uuid !== 'undefined') {
      router.push(`/frontend/profile/${uuid}`);
    } else {
      console.error('Invalid UUID:', uuid);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F8]/70 via-white/20 to-[#C5A3FF]/30" />

      <div className="relative z-10 h-full max-w-3xl mx-auto px-4 sm:px-6 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 pt-6 pb-3 bg-gradient-to-b from-white/60 to-transparent backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or Instagram username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-2xl border border-pink-200/80 bg-white/80 px-4 py-3 text-[#1B1B1B] placeholder-[#8B6F74]/60 focus:outline-none focus:ring-2 focus:ring-[#FF2D91] focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF2D91] hover:text-[#E04A7A] disabled:opacity-50 transition-colors"
              >
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 py-4 md:py-6 space-y-5">
          {searchResults.length > 0 ? (
            searchResults.map((profile) => (
              <article key={profile.uuid} className="card p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-[#FFF5F8] overflow-hidden flex-shrink-0 grid place-items-center text-[#8B6F74]">
                    👤
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#1B1B1B] truncate" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
                        {profile.firstName} {profile.lastName}
                      </h3>
                    </div>
                    <div className="mt-1 text-xs text-[#8B6F74]" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
                      @{profile.instagram || profile.linkedin || profile.facebook || 'n/a'}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={() => handleProfileClick(profile.uuid)}
                    className="rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A] text-white font-semibold text-sm sm:text-base py-2.5 px-5 shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
                  >
                    View profile
                  </button>

                  <span className="text-xs sm:text-sm text-[#8B6F74] underline">@{profile.instagram}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="card p-8 text-center" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
              <h4 className="text-lg font-semibold text-[#1B1B1B] mb-1">Don’t see your date?</h4>
              <p className="text-[#8B6F74] mb-4">Be the first to share—help other girls avoid red flags.</p>
              <button
                onClick={handleCreateProfile}
                className="rounded-full bg-[#1B1B1B] hover:bg-[#2A2A2A] text-white font-semibold py-2.5 px-6 shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
              >
                Write an entry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
