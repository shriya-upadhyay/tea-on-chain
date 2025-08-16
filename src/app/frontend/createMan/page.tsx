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
        router.push('/frontend/feed');
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
    router.push('/frontend/feed');
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
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#582A55] tracking-tight mb-4"
              style={{ fontFamily: "'Moirai One', cursive" }}
            >
              Create Profile
            </h1>
            <p
              className="text-base sm:text-lg text-[#8B6F74]"
              style={{ fontFamily: "'Inria Sans', sans-serif" }}
            >
              Add a new profile to the tea feed
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card">
              {/* Personal Information */}
              <div className="mb-8">
                <h2 
                  className="text-xl sm:text-2xl font-semibold text-[#582A55] mb-6"
                  style={{ fontFamily: "'Moirai One', cursive" }}
                >
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#1B1B1B]">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#1B1B1B]">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h2 
                  className="text-xl sm:text-2xl font-semibold text-[#582A55] mb-6"
                  style={{ fontFamily: "'Moirai One', cursive" }}
                >
                  Social Media
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="instagram" className="block text-sm font-medium text-[#1B1B1B]">
                      Instagram Username
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter Instagram username (without @)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="linkedin" className="block text-sm font-medium text-[#1B1B1B]">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter LinkedIn profile URL or username"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="facebook" className="block text-sm font-medium text-[#1B1B1B]">
                      Facebook Profile
                    </label>
                    <input
                      type="text"
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="input"
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
                className="px-8 py-3 border-2 border-[#FF2D91] text-[#FF2D91] rounded-full font-semibold hover:bg-[#FF2D91] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D91]/40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
