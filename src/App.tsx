import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

  const handleNavigate = (page: string, propertyId?: string) => {
    setCurrentPage(page);
    if (propertyId) {
      setSelectedPropertyId(propertyId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'properties' && <PropertiesPage onNavigate={handleNavigate} />}
      {currentPage === 'property' && selectedPropertyId && (
        <PropertyDetailsPage propertyId={selectedPropertyId} onNavigate={handleNavigate} />
      )}
      {currentPage === 'contact' && <ContactPage />}

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Elite Estates</h3>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect property. We make real estate simple and accessible.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleNavigate('home')} className="text-gray-400 hover:text-white">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('properties')} className="text-gray-400 hover:text-white">
                    Properties
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('contact')} className="text-gray-400 hover:text-white">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+1 (555) 123-4567</li>
                <li>info@eliteestates.com</li>
                <li>123 Real Estate Ave, NY 10001</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Elite Estates. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
