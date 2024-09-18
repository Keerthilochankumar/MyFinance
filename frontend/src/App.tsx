import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './component/pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import Bills from './component/pages/Bills';
import Savings from './component/pages/Savings';
import Transactions from './component/pages/Transactions';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import FinancialReport from './pages/Report';
import Chatbot from './component/ChatBot';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/report" element={<FinancialReport/>} />
              <Route path="/bill" element={<Bills/>} />
              <Route path='/transaction' element={<Transactions/>} />
              <Route path='/saving' element={<Savings/>} />
              <Route path='/signup' element={<Register/>} />
              <Route path='/signin' element={<Login/>} />
              <Route path='/chat' element={<Chatbot/>} />
            </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
