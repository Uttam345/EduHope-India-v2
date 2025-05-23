import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <nav className="container-custom mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-secondary" />
          <span className="font-heading font-bold text-xl md:text-2xl">EduHope India</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" isScrolled={isScrolled} />
          <NavLink to="/about" label="About Us" isScrolled={isScrolled} />
          <NavLink to="/impact" label="Our Impact" isScrolled={isScrolled} />
          <Link to="/donate" className="btn btn-secondary">Donate Now</Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl absolute top-full left-0 w-full py-4 animate-slide-up">
          <div className="container-custom flex flex-col space-y-4">
            <NavLink to="/" label="Home" isMobile />
            <NavLink to="/about" label="About Us" isMobile />
            <NavLink to="/impact" label="Our Impact" isMobile />
            <Link to="/donate" className="btn btn-secondary w-full text-center">
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  isScrolled?: boolean;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, isScrolled, isMobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`
        ${isMobile ? 'block py-2 px-4 border-l-4 ' : ''}
        ${isActive 
          ? `font-medium ${isMobile ? 'border-secondary text-secondary' : 'text-secondary'}` 
          : `${isMobile ? 'border-transparent' : ''} ${isScrolled || isMobile ? 'text-foreground' : 'text-foreground'} hover:text-secondary transition-colors`
        }
      `}
    >
      {label}
    </Link>
  );
};

export default Navbar;