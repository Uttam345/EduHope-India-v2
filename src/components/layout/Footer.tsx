import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import NewsletterForm from '../ui/NewsletterForm';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Heart className="w-7 h-7 text-secondary" />
              <span className="font-heading font-bold text-xl">
                EduHope India
              </span>
            </Link>
            <p className="text-gray-300 mb-4">
              Empowering homeless children in India through education,
              nutrition, and support for a brighter future.
            </p>
            <div className="flex space-x-4 text-gray-300">
              <a
                href="#"
                className="hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/impact"
                  className="hover:text-secondary transition-colors"
                >
                  Our Impact
                </Link>
              </li>
              <li>
                <Link
                  to="/donate"
                  className="hover:text-secondary transition-colors"
                >
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>128/113 Kidwai nagar, Kanpur-208011</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="flex-shrink-0" />
                <span>+91 93364 66060</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="flex-shrink-0" />
                <span>info@eduhopeindia.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Stay updated with our progress and success stories.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              © {new Date().getFullYear()} EduHope India. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 space-x-4">
              <Link
                to="/privacy"
                className="hover:text-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-secondary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
