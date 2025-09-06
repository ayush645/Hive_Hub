import React from 'react';

const WhyUsSection = () => {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xl font-medium text-gray-500 mb-4 tracking-wide uppercase">Why Us</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-[#191c1e] leading-tight max-w-4xl mx-auto">
            Experience unmatched <span className='text-purple-500'>convenience</span> and <span className='text-purple-500'>reliability</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Feature 1 - Personalized approach */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <span className="text-4xl sm:text-5xl font-light text-gray-400">01</span>
              <div className="flex-1 pt-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-purple-600 mb-4">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  We take the time to understand your unique preferences and needs, ensuring tailored solutions for your perfect home.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Family discussing home plans with real estate agent"
                className="w-full h-64 sm:h-72 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Feature 2 - Expert guidance */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <span className="text-4xl sm:text-5xl font-light text-gray-400">02</span>
              <div className="flex-1 pt-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-purple-600 mb-4">
                  Ready-to-Use Store Themes
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <img 
                src="https://images.unsplash.com/photo-1664575602554-2087b04935a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Real estate professionals working with documents and house models"
                className="w-full h-64 sm:h-72 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Our Chatbot with experienced professionals provides insightful advice and support to help you make informed property.
            </p>
          </div>

          {/* Feature 3 - Seamless experience */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <span className="text-4xl sm:text-5xl font-light text-gray-400">03</span>
              <div className="flex-1 pt-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-purple-600 mb-4">
                  Trending Products Loader
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  From your first search to finalizing the deal, we ensure a smooth, hassle-free process for your peace of mind.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <img 
                src="https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Happy family signing documents with real estate agent"
                className="w-full h-64 sm:h-72 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WhyUsSection;