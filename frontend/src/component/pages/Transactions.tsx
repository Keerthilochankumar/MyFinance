/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import TransactionForm from '../TransactionForm';
import TransactionHistory from '../TransactionHistory';
import Navbar from '../Navbar';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const { token } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const headers = { Authorization: `${token}` };
        const response = await axios.get('http://localhost:3000/api/transactions', { headers });
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [token]);

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 p-4">
        <h2 className="text-2xl font-bold mb-4">{t('transactions.title')}</h2>
        <TransactionForm />
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};

export default Transactions;
