import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  // Update page title
  useEffect(() => {
    document.title = 'Page Not Found';
  }, []);

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
      <div className="container-custom max-w-xl text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <Home className="mr-2" size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;