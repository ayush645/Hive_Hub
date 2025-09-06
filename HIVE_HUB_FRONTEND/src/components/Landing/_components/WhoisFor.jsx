import React, { useRef } from "react";

// Dummy SVG icon for illustration; replace with your real SVGs
const BenefitIcon = () => (
  <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="32" fill="#f1f1f1" />
    <text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#222">😎</text>
  </svg>
);

const benefits = [
  {
    text: "Real-Time Content That Captivates and Connects Audiences Instantly",
    img: 'https://framerusercontent.com/images/yBsl7wO7dvRGKnkzXsedaMgqUk.png',
    bg:'bg-purple-200'
  },
  {
    text: "Strategies Built for Results, Guided by Data and Creativity",
 img: 'https://framerusercontent.com/images/9YXhFjAV8CsnxIj9lpMNut2s.png',
bg:'bg-purple-200'  },
  {
    text: "Comprehensive Social Media Solutions—From Creation to Community",
 img: 'https://framerusercontent.com/images/ZkX4C69JxyAyD4KNk3iQC08pCE.png',
bg:'bg-purple-200'  },
  {
    text: "Bold, Innovative Campaigns That Set and Shape Trends",
 img: 'https://framerusercontent.com/images/RjQdEs6HYUk3H73pX0FTlrFzp4.png', 
bg:'bg-purple-200' }
];

export default function BenefitsCarousel() {
  const scrollRef = useRef();

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: dir === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 mb-8 text-center">
        <div className="inline-flex items-center mb-2 bg-purple-500 rounded-2xl pr-4 text-sm font-semibold text-white gap-2">
        
          <span className="inline-flex items-center"><span className="w-8 h-8 mr-1 bg-[#101b36] rounded-full flex justify-center items-center"><i className="fa-regular fa-star"></i></span></span>
          Benefits
        </div>
        <h2 className="text-3xl md:text-5xl brico tracking-tight text-[#101b36]">
          See why <span className='text-purple-500'>partnering</span> with us is the <span className="text-black"><span className='text-purple-500'>smartest</span> move.</span>
        </h2>
      </div>

      {/* Carousel Area */}
      <div className="relative max-w-7xl mx-auto px-4 ">
        {/* Arrows */}
        <button
          aria-label="Scroll Left"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#101b36] text-white rounded-full p-2 shadow-md transition-all focus:outline-none"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          aria-label="Scroll Right"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#101b36] text-white rounded-full p-2 shadow-md transition-all focus:outline-none"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Benefit Cards Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth pt-4 pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className={`shrink-0 w-72 sm:w-80 md:w-80 rounded-2xl ${item.bg} text-[#101b36] p-6 flex flex-col items-center shadow-sm scroll-snap-align-start`}
            >
              <div className="mb-4 flex flex-col justify-center items-center gap-5">
                              <p className=" text-2xl brico tracking-tighter font-medium text-center">{item.text}</p>

                <img src={item.img} alt="image" className="h-56 w-56 rounded-3xl"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Optional: Add this to your global CSS for hiding scrollbars in Chrome/Firefox/Safari
// .hide-scrollbar::-webkit-scrollbar { display: none; }
// .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
