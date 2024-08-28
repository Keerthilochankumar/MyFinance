/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import SavingForm from '../SavingForm';
import SavingHistory from '../SavingHistory';
import Navbar from '../Navbar';

const Savings: React.FC = () => {
  const [savings, setSavings] = useState<any[]>([]);
  const { token } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const headers = { Authorization: `${token}` };
        const response = await axios.get('http://localhost:3000/api/savings', { headers });
        setSavings(response.data.savings);
      } catch (error) {
        console.error('Error fetching savings:', error);
      }
    };
    fetchSavings();
  }, [token]);

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 p-4">
        <h2 className="text-2xl font-bold mb-4">{t('savings.title')}</h2>
        <SavingForm />
        <SavingHistory savings={savings} />
      </div>
    </div>
  );
};

export default Savings;
