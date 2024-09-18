import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { i18n } = useTranslation();

  // Function to handle language switch
  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-gray-800 text-white h-screen p-4 fixed w-64">
      <ul className="space-y-4">
      <li>
          <Link to="/dashboard" className="hover:underline block">
          Dashboard
          </Link>
        </li>
        <li>
          <Link to="/bill" className="hover:underline block">
            Bills
          </Link>
        </li>
        <li>
          <Link to="/transaction" className="hover:underline block">
            Transactions
          </Link>
        </li>
        <li>
          <Link to="/saving" className="hover:underline block">
            Savings
          </Link>
        </li>
        <li>
          <Link to="/report" className="hover:underline block">
            Reports
          </Link>
        </li>
        <li>
          <Link to="/chat" className="hover:underline block">
           chat
           </Link>
        </li>
      </ul>
      <div className="mt-8">
        <button
          onClick={() => handleLanguageChange('en')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange('es')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          ES
        </button>
        <button 
           onClick={()=> handleLogout()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"  
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
