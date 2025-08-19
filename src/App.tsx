import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import HomePage from './pages/HomePage';
import DonationPage from './pages/DonationPage';
import DonationSuccessPage from './pages/DonationSuccessPage';
import ImpactPage from './pages/ImpactPage';
import AboutPage from './pages/AboutPage';
import CertificatePage from './pages/CertificatePage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />                                    {/* Monitors route changes and scrolls to top */}
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/donation/success" element={<DonationSuccessPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/certificate/:id" element={<CertificatePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default App;