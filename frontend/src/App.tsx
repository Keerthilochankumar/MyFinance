import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';



const App: React.FC = () => {
  return (
      <Router>
        <div className="">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              
            </Routes>
        </div>
      </Router>
  );
};

export default App;
