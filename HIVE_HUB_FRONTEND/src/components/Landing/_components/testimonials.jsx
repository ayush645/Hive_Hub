import React from "react";

// All dummy images filled properly
const testimonials = [
  {
    review: "Working with this team felt like having a secret weapon. They took our scattered ideas and turned them into a website.",
    name: "Tobias Green",
    title: "FOUNDER, GREENSPARK INNOVATIONS",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968853.png", // Greenspark dummy logo
    avatar: "https://i.pravatar.cc/100?img=11",
    bg:'bg-purple-500  text-white'
  },
  {
    review: "Finally, an agency that speaks our language! They understood our vision better than we did and brought it to life in a way that exceeded expectations.",
    name: "Silas Leighton",
    title: "MANAGING DIRECTOR, VENTUREVISTA",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    avatar: "https://i.pravatar.cc/100?img=12",
    bg:'bg-[#101b36] text-white '
  },
  {
    review: "I came in with high hopes, and they absolutely blew me away. From strategy to execution, every detail was on point. ",
    name: "Orion Vance",
    title: "CEO, LUNAR LUX CO.",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968866.png",
    avatar: "https://i.pravatar.cc/100?img=13",
      bg:'bg-purple-500  text-white'
  },
  {
    review: "Our brand went from a whisper to a roar. The team’s creativity and expertise made all the difference.",
    name: "Callum Yates",
    title: "CO-FOUNDER, DRIFTWOOD MEDIA",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968776.png",
    avatar: "https://i.pravatar.cc/100?img=14",
    bg:'bg-[#101b36] text-white'
  },
  {
    review: "They made us feel like their most important client. The attention to detail, quick responses, and innovative ideas were top-notch.",
    name: "Jasper Lowell",
    title: "BRAND MANAGER, STELLAR BLOOM STUDIO",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968885.png",
    avatar: "https://i.pravatar.cc/100?img=16",
      bg:'bg-purple-500  text-white'
  },
  {
    review: "Our online presence went from zero to hero in no time. The team made the process so seamless.",
    name: "Jasper Lowell",
    title: "CEO, COPPERLEAF ENTERPRISES",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968709.png",
    avatar: "https://i.pravatar.cc/100?img=15",
    bg: 'bg-[#101b36] text-white'
  },
  
];

const Testimonial = () => {
  return (
    <section className=" py-10 px-4 md:px-16">
      {/* Header */}
       <div className="max-w-5xl mx-auto px-4 mb-8 text-center">
        <div className="inline-flex items-center mb-2 bg-purple-400  rounded-2xl pr-4 text-sm font-semibold text-white gap-2">
        
          <span className="inline-flex items-center"><span className="w-8 h-8 mr-1 bg-[#101b36] rounded-full flex justify-center items-center"><i className="fa-regular fa-star"></i></span></span>
          Testimonials
        </div>
        <h2 className="text-3xl md:text-5xl brico tracking-tight text-[#101b36]">
          Hear <span className='text-purple-500 '>Stories</span> <span className="inline-flex -space-x-4">
            {testimonials.slice(0, 5).map((t, i) => (
              <img
                key={i}
                src={t.avatar}
                alt={t.name}
                className={`rounded-full border-2 border-white w-10 h-10 object-cover shadow ${i && "-ml-4"}`}
              />
            ))}
          </span> straight from the people we've helped
        </h2>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 py-10">
        {testimonials.map((t, i) => (
          <div className="flex flex-col gap-5 justify-end" key={i}>
          <div key={i}
          className={`${t.bg} p-10 rounded-3xl`}
          >
            <h2 className="brico font-semibold text-lg"><i className="fa-regular fa-comment-dots"></i> {t.review}</h2>
          
          </div>
          <div className="flex justify-center md:justify-start">
            <img src={t.avatar} alt="" className="rounded-full h-16 z-10 w-16 grayscale"/>
            <img src={t.logo} alt="" className="rounded-full bg-gray-300 grayscale -ml-2 h-16 w-16 border-2 border-gray-300"/>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl brico">{t.name}</h2>
            <h2 className="text-sm brico">{t.title}</h2>
          </div>
          </div>
        ))}
       
      </div>


    </section>
  );
};

export default Testimonial;





