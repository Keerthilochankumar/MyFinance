import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  currency: string;
  category: string;
  desc: string;
  date: string;
}

const TransactionHistory: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const { token } = useAuth();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [updatedType, setUpdatedType] = useState<string>('');
  const [updatedAmount, setUpdatedAmount] = useState<number>(0);
  const [updatedCurrency, setUpdatedCurrency] = useState<string>('');
  const [updatedCategory, setUpdatedCategory] = useState<string>('');
  const [updatedDesc, setUpdatedDesc] = useState<string>('');
  const [updatedDate, setUpdatedDate] = useState<string>('');
  const { t } = useTranslation();

  const handleDelete = async (id: number) => {
    try {
      const headers = { Authorization: `${token}` };
      await axios.delete(`http://localhost:3000/api/transactions/${id}`, { headers });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const headers = { Authorization: `${token}` };
      await axios.put(
        `http://localhost:3000/api/transactions/${id}`,
        { type: updatedType, amount: updatedAmount, currency: updatedCurrency, category: updatedCategory, desc: updatedDesc, date: updatedDate },
        { headers }
      );
      setEditingTransaction(null); // Hide the update form
      window.location.reload();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  return (
    <div className="space-y-4">
      {transactions.map(transaction => (
        <div key={transaction.id} className="bg-gray-100 p-4 mb-2 rounded shadow-md relative">
          <p>{t('transactionHistory.type')}: {transaction.type}</p>
          <p>{t('transactionHistory.amount')}: {transaction.amount}</p>
          <p>{t('transactionHistory.currency')}: {transaction.currency}</p>
          <p>{t('transactionHistory.category')}: {transaction.category}</p>
          <p>{t('transactionHistory.desc')}: {transaction.desc}</p>
          <p>{t('transactionHistory.date')}: {transaction.date}</p>

          {editingTransaction?.id === transaction.id && (
            <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-lg rounded border border-gray-300">
              <h5 className="font-bold">{t('transactionHistory.updateTransaction')}</h5>
              <input
                type="text"
                placeholder={t('transactionForm.type')}
                value={updatedType}
                onChange={(e) => setUpdatedType(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder={t('transactionForm.amount')}
                value={updatedAmount}
                onChange={(e) => setUpdatedAmount(Number(e.target.value))}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder={t('transactionForm.currency')}
                value={updatedCurrency}
                onChange={(e) => setUpdatedCurrency(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder={t('transactionForm.category')}
                value={updatedCategory}
                onChange={(e) => setUpdatedCategory(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder={t('transactionForm.desc')}
                value={updatedDesc}
                onChange={(e) => setUpdatedDesc(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                placeholder={t('transactionForm.date')}
                value={updatedDate}
                onChange={(e) => setUpdatedDate(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <button onClick={() => handleUpdate(transaction.id)} className="bg-blue-500 text-white p-2 rounded mr-2">{t('transactionHistory.saveButton')}</button>
              <button onClick={() => setEditingTransaction(null)} className="bg-gray-500 text-white p-2 rounded">{t('transactionHistory.cancelButton')}</button>
            </div>
          )}
          
          <button
            onClick={() => setEditingTransaction(transaction.id === editingTransaction?.id ? null : transaction)}
            className="bg-yellow-500 text-white p-2 rounded mr-2"
          >
            {editingTransaction?.id === transaction.id ? t('transactionHistory.cancelButton') : t('transactionHistory.editButton')}
          </button>
          <button
            onClick={() => handleDelete(transaction.id)}
            className="bg-red-500 text-white p-2 rounded"
          >
            {t('transactionHistory.deleteButton')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
