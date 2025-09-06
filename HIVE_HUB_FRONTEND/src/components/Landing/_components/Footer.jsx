import React from "react";

const Footer = () => {
  const quickLinks = [
    { name: "About Us" },
    { name: "Our Clients" },
    { name: "Our Work" },
    { name: "Partners" },
    { name: "Contact Us" },
  ];

 

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden mt-10">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full opacity-10 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400 rounded-full opacity-10 -ml-24 -mb-24"></div>

      <div className="relative z-10">
        {/* Headline */}
        <div className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight mb-4">
              Transform your{" "}
              <span className="text-purple-500">Impact Intervention</span> with
              Us!
            </h3>
            <p className="text-gray-300 text-base sm:text-lg mb-8">
              We generate evidence-based insights and design adaptive systems
              that help programs deliver sustainable and scalable impact
              efficiently.
            </p>
          </div>
        </div>

        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-purple-500 mb-4">
              Unnati C4E
            </h2>
            <div className="space-y-3 mb-6 text-sm text-gray-300">
              <div className="flex items-center">
                <span className="mr-3">📍</span>
                N204, Greater Kailash 1, New Delhi - 110048
              </div>
              <div className="flex items-center">
                <span className="mr-3">📞</span>
                +91 84472 72248
              </div>
              <div className="flex items-center">
                <span className="mr-3">✉️</span>
                contactus@unnatic4e.com
              </div>
            </div>
            {/* Social */}
            <div className="flex space-x-4">
              <a
                href="#linkedin"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-300"
              >
                🔗 LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() =>
                      scrollToSection(link.name.replace(/\s+/g, "").toLowerCase())
                    }
                    className="text-left w-full text-gray-300 hover:text-purple-500 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span>{link.name}</span>
                    <span className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
