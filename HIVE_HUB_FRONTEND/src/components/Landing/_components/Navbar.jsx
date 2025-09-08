import { useState } from 'react';
// import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
    const navigate = useNavigate();


  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blogs' },
    { name: 'Enrollment', path: '/enrollment' },
    { name: 'Contact', path: '/contact' },
        { name: 'Gallery', path: '/gallery' }

  ];

  return (
    <nav className="md:w-[80%] mx-auto md:mt-5 md:rounded-3xl z-50 bg-purple-200/80 backdrop-blur-lg border-2 border-purple-500/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a 
              className="group flex items-center space-x-2"
            >
              <div>
                <img src="" alt="Logo" height={50} width={50}/>
              </div>
              <span className="text-2xl font-semibold text-purple-500 dm-sans">
                Skillora
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group `}
              >
                {link.name}
               
              </a>
            ))}
            
            {/* CTA Button */}
           <div className="ml-6 pl-6 border-l border-gray-200">
      <button
        onClick={() => navigate("/auth/signin")}
        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-purple-200 transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-purple-700"
      >
        Get Started
      </button>
    </div>
          </div>


          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-xl bg-orange-50 text-purple-600 hover:bg-purple-100 transition-all duration-300"
            >
              {/* {isOpen ? <X size={22} /> : <Menu size={22} />} */}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="bg-white/95 backdrop-blur-lg border-t border-purple-100/50 px-4 py-6 space-y-1">
          {navLinks.map((link) => (
            <a
            
              onClick={toggleMenu}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300`}
            >
              {link.name}
            </a>
          ))}
          
          {/* Mobile CTA */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <a
          
              onClick={toggleMenu}
              className="block w-full text-center bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-purple-200 transition-all duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;