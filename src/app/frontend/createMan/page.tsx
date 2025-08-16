'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateManPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    instagram: '',
    linkedin: '',
    facebook: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create_man', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile created successfully:', result);
        router.push('/frontend/feed');  // Fixed: redirect to correct path
      } else {
        const error = await response.json();
        console.error('Profile creation failed:', error);
        alert(`Failed to create profile: ${error.error}`);
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/frontend/feed');  // Fixed: redirect to correct path
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FF5884] mb-2">Create Profile</h1>
          <p className="text-gray-600">Add a new profile to the feed</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-pink-200 p-6 shadow-lg">
            
            {/* Personal Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#FF5884] mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#FF5884] mb-4">Social Media</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
                    placeholder="Enter Instagram username (without @)"
                  />
                </div>
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
                    placeholder="Enter LinkedIn profile URL or username"
                  />
                </div>
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook Profile
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5884] focus:border-transparent"
                    placeholder="Enter Facebook profile URL or username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 border-2 border-[#FF5884] text-[#FF5884] rounded-lg font-semibold hover:bg-[#FF5884] hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-[#FF5884] to-[#E04A7A] text-white rounded-lg font-semibold hover:from-[#E04A7A] hover:to-[#D03A6A] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
