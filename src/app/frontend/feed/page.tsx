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
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      {/* Soft brand overlay to keep text readable */}
      <div className="absolute inset-0"/>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-start px-4 sm:px-6 py-8">
        <div className="w-full max-w-4xl">
          {/* Search Section */}
          <div className="card mb-8">
            <div className="text-center mb-6">
              <h2
                className="text-xl sm:text-2xl font-semibold text-[#582A55] mb-2"
                style={{ fontFamily: "'Moirai One', cursive" }}
              >
                Search Profiles
              </h2>
              <p
                className="text-[#8B6F74]"
                style={{ fontFamily: "'Inria Sans', sans-serif" }}
              >
                Look up by name or social media username
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-full max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or Instagram username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input pr-12"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF2D91] hover:text-[#E04A7A] disabled:opacity-50 transition-colors"
                  >
                    {isSearching ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

            {/* Create Profile Button */}
            <div className="text-center">
              <button
                onClick={handleCreateProfile}
                className="btn-primary max-w-xs"
              >
                + Add New Profile
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="card">
              <div className="text-center mb-6">
                <h2
                  className="text-xl sm:text-2xl font-semibold text-[#582A55] mb-2"
                  style={{ fontFamily: "'Moirai One', cursive" }}
                >
                  Found {searchResults.length} Profile{searchResults.length !== 1 ? 's' : ''}
                </h2>
                <p
                  className="text-[#8B6F74]"
                  style={{ fontFamily: "'Inria Sans', sans-serif" }}
                >
                  Click on a profile to view details and reviews
                </p>
              </div>

              <div className="space-y-4">
                {searchResults.map((profile) => (
                  <div 
                    key={profile.uuid} 
                    className="bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-200/60 p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleProfileClick(profile.uuid)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 
                          className="text-xl font-semibold text-[#1B1B1B] mb-3 group-hover:text-[#582A55] transition-colors"
                          style={{ fontFamily: "'Inria Sans', sans-serif" }}
                        >
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <div className="space-y-2 text-sm text-[#8B6F74]">
                          {profile.instagram && (
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Instagram:</span>
                              <span className="text-[#FF2D91] font-medium">@{profile.instagram}</span>
                            </div>
                          )}
                          {profile.linkedin && (
                            <div className="flex items-center">
                              <span className="font-medium mr-2">LinkedIn:</span>
                              <span className="text-[#FF2D91] font-medium">{profile.linkedin}</span>
                            </div>
                          )}
                          {profile.facebook && (
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Facebook:</span>
                              <span className="text-[#FF2D91] font-medium">{profile.facebook}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#FF2D91] to-[#E04A7A] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {profile.firstName?.[0]}{profile.lastName?.[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          
        </div>
      </div>
    </div>
  );
} 