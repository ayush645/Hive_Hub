import React from "react";
// import { Pencil, LayoutDashboard, Sofa, Hammer } from "lucide-react";

// Install Lucide-react and you can customize icons and texts accordingly

const steps = [
  {
    id: 1,
    title: "Consultation",
    description:
      "We discuss your needs, preferences, lifestyle, and vision for the space.",
    // icon: <Pencil className="w-12 h-12" />,
  },
  {
    id: 2,
    title: "Conceptualization",
    description:
      "We create design ideas, mood boards, and layouts to match your style.",
    // icon: <LayoutDashboard className="w-12 h-12" />,
  },
  {
    id: 3,
    title: "Planning",
    description:
      "We finalize materials, finishes, furniture, and develop timelines for your project.",
    // icon: <Sofa className="w-12 h-12" />,
  },
  {
    id: 4,
    title: "Execution",
    description:
      "We manage installation and oversee construction to bring your design to life.",
    // icon: <Hammer className="w-12 h-12" />,
  },
];

const DesignProcess = () => {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 text-black bg-purple-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16">
          <h2 className="text-4xl md:text-6xl brico -tracking-wider leading-tight mb-6 lg:mb-0">
            Our Design <br /> Process
          </h2>
          <div className="max-w-md">
            <p className="uppercase text-sm -tracking-wider brico text-gray-500 mb-2">
              Process
            </p>
            <p className="text-lg text-gray-700">
              Discover how our thoughtful process transforms ideas into
              personalized, functional, and beautifully styled spaces.
            </p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="relative flex flex-col md:flex-row items-center md:justify-between gap-12">
          {/* Connecting Line - Desktop only */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-[2px] bg-purple-500 z-0 mx-20" />

          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="relative group">
                <div className="bg-purple-500 text-white rounded-full w-40 h-40 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-400 group-hover:shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-125 group-hover:bg-purple-400 ">
                  {step.id}.
                </div>
              </div>
              <h3 className="mt-6 text-lg font-semibold group-hover:bg-purple-400  transition-colors duration-300">
                {step.title}
              </h3>
              <p className="mt-2 text-lg text-gray-600 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesignProcess;
