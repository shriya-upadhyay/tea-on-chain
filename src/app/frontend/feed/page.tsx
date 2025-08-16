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
    console.log('Profile clicked, UUID:', uuid); // Debug log
    if (uuid && uuid !== 'undefined') {
      router.push(`/frontend/profile/${uuid}`);
    } else {
      console.error('Invalid UUID:', uuid);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or Instagram username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 pr-12 border-2 border-[#FF5884] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#FF5884] hover:text-[#E04A7A] disabled:opacity-50"
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

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#FF5884] mb-4">
            Found {searchResults.length} profile{searchResults.length !== 1 ? 's' : ''}
          </h2>
          {searchResults.map((profile) => (
            <div 
              key={profile.uuid} 
              className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Profile clicked:', profile.uuid);
                router.push(`/frontend/profile/${profile.uuid}`);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {profile.instagram && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Instagram:</span>
                        <span className="text-[#FF5884]">@{profile.instagram}</span>
                      </div>
                    )}
                    {profile.linkedin && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">LinkedIn:</span>
                        <span className="text-[#FF5884]">{profile.linkedin}</span>
                      </div>
                    )}
                    {profile.facebook && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Facebook:</span>
                        <span className="text-[#FF5884]">{profile.facebook}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF5884] to-[#E04A7A] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Create Profile Button - shown below search results */}
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleCreateProfile}
          >
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF5884] to-[#E04A7A] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                +
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#FF5884] mb-2">Create Profile</h3>
                <p className="text-gray-600">Can't find him? Create a profile to add him to the feed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default Feed Cards (shown when no search results) */}
      {searchResults.length === 0 && (
        <div className="space-y-4">
          {/* Create Profile Button - shown below default feed cards */}
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleCreateProfile}
          >
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF5884] to-[#E04A7A] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                +
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#FF5884] mb-2">Create Profile</h3>
                <p className="text-gray-600">Can't find him? Create a profile to add him to the feed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 