'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Review {
  uuid: string;
  review: string;
  woman: string;
  man: string;
}

interface MenProfile {
  uuid: string;
  firstName: string;
  lastName: string;
  instagram: string;
  linkedin: string;
  facebook: string;
}

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<MenProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (params.uuid && params.uuid !== 'undefined') {
      console.log('Params UUID:', params.uuid); // Debug log
      fetchProfile();
      fetchReviews();
    }
  }, [params.uuid]);

  const fetchProfile = async () => {
    if (!params.uuid || params.uuid === 'undefined') {
      console.error('No valid UUID found');
      return;
    }
    
    try {
      console.log('Fetching profile for UUID:', params.uuid);
      const response = await fetch(`/api/profile/${params.uuid}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        console.error('Profile fetch failed:', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!params.uuid || params.uuid === 'undefined') {
      return;
    }
    
    try {
      // Fix: Call the correct API endpoint
      const response = await fetch(`/api/reviews/${params.uuid}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    try {
      const response = await fetch('/api/write-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: reviewText,
          man: params.uuid,
          woman: 'temp-woman-uuid' // This should come from user authentication
        }),
      });

      if (response.ok) {
        setReviewText('');
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleBack = () => {
    router.push('/frontend/feed');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-[#FF5884] text-xl">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-red-500 text-xl">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 text-[#FF5884] hover:text-[#E04A7A] transition-colors"
        >
          ← Back to Feed
        </button>

        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-8 mb-6 shadow-lg">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF5884] to-[#E04A7A] rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <div className="space-y-2 text-gray-600">
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
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#FF5884]">
              Reviews ({reviews.length})
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-2 bg-gradient-to-r from-[#FF5884] to-[#E04A7A] text-white rounded-lg font-semibold hover:from-[#E04A7A] hover:to-[#D03A6A] transition-all duration-200"
            >
              {showReviewForm ? 'Cancel' : 'Leave Review'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent resize-none mb-3"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#FF5884] to-[#E04A7A] text-white rounded-lg font-semibold hover:from-[#E04A7A] hover:to-[#D03A6A] transition-all duration-200"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to leave one!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.uuid} className="border-l-4 border-[#FF5884] pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <p className="text-gray-800">{review.review}</p>
                  <p className="text-sm text-gray-500 mt-2">By: {review.woman}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
