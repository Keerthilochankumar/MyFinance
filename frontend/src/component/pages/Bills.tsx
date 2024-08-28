/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import BillForm from '../BillForm';
import BillHistory from '../BillHistory';
import Navbar from '../Navbar';
import { useTranslation } from 'react-i18next';

const Bills: React.FC = () => {
  const [bills, setBills] = useState<any[]>([]);
  const { token } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const headers = { Authorization: `${token}` };
        const response = await axios.get('http://localhost:3000/api/bills', { headers });
        setBills(response.data.bills);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchBills();
  }, [token]);

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 p-4">
        <h2 className="text-2xl font-bold mb-4">{t('bills.title')}</h2>
        <BillForm />
        <BillHistory bills={bills} />
      </div>
    </div>
  );
};

export default Bills;
