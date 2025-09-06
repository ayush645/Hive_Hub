import React from "react";

const StatsSection = () => {
  return (
    <section className="py-10 px-4 md:px-10 lg:px-20 font-inter">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl text-purple-500 md:text-5xl brico tracking-tight leading-tight">
          <span className="text-[#101b36] ">Building</span> brands,{" "}
          <span className="text-[#101b36] ">boosting</span> businesses,
          <br className="hidden sm:block" />
          and <span className="text-[#101b36]">redefining</span> possibilities.
        </h2>
        <p className="text-2xl text-gray-600 mt-4 brico">
          Let’s grow your brand together.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div>
          <div className="border-2 border-dashed border-purple-400 rounded-2xl p-6 text-center">
            <h3 className="text-7xl brico text-black">
              250<span className="text-purple-500 text-7xl align-center">+</span>
            </h3>
            <p className="text-lg font-medium mt-2">Projects Delivered</p>
          </div>
          <p className="text-gray-600 mt-2 text-xl">
            Our strategies have helped clients achieve up to 70% revenue growth
            in just one year!
          </p>
        </div>
        {/* Card 2 */}
        <div>
          <div className="border-2 border-dashed border-purple-400 rounded-2xl p-6 text-center">
            <h3 className="text-7xl brico text-black">
              250<span className="text-purple-500 text-7xl align-center">+</span>
            </h3>
            <p className="text-lg font-medium mt-2">Projects Delivered</p>
          </div>
          <p className="text-gray-600 mt-2 text-xl">
            Our strategies have helped clients achieve up to 70% revenue growth
            in just one year!
          </p>
        </div>

        {/* Card 3 */}
        <div>
        <div className="border-2 border-dashed border-purple-400 rounded-2xl p-6 text-center">
          <h3 className="text-7xl brico text-black">
            250<span className="text-purple-500 text-7xl align-center">+</span>
          </h3>
          <p className="text-lg font-medium mt-2">Projects Delivered</p>
          
        </div>
        <p className="text-gray-600 mt-2 text-xl">
            Our strategies have helped clients achieve up to 70% revenue growth in just one year!
          </p>
        
</div>
      </div>
    </section>
  );
};

export default StatsSection;
