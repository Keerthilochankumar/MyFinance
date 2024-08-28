import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface Bill {
  id: number;
  title: string;
  amount: number;
  currency: string;
  toWhom: string;
  dueDate: string;
}

const BillHistory: React.FC<{ bills: Bill[] }> = ({ bills }) => {
  const { token } = useAuth();
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState<string>('');
  const [updatedAmount, setUpdatedAmount] = useState<number>(0);
  const [updatedCurrency, setUpdatedCurrency] = useState<string>('');
  const [updatedToWhom, setUpdatedToWhom] = useState<string>('');
  const [updatedDueDate, setUpdatedDueDate] = useState<string>('');
  const { t } = useTranslation();

  const handleDelete = async (id: number) => {
    try {
      const headers = { Authorization: `${token}` };
      await axios.delete(`http://localhost:3000/api/bills/${id}`, { headers });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const headers = { Authorization: `${token}` };
      await axios.put(
        `http://localhost:3000/api/bills/${id}`,
        { title: updatedTitle, amount: updatedAmount, currency: updatedCurrency, toWhom: updatedToWhom, dueDate: updatedDueDate },
        { headers }
      );
      setEditingBill(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  return (
    <div className="space-y-4">
      {bills.map(bill => (
        <div key={bill.id} className="bg-gray-100 p-4 mb-2 rounded shadow-md relative">
          <h4 className="font-bold">{bill.title}</h4>
          <p>{t('billHistory.amount')}: {bill.amount}</p>
          <p>{t('billHistory.currency')}: {bill.currency}</p>
          <p>{t('billHistory.toWhom')}: {bill.toWhom}</p>
          <p>{t('billHistory.dueDate')}: {bill.dueDate}</p>
          
          {/* Update form */}
          {editingBill?.id === bill.id && (
            <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-lg rounded border border-gray-300">
              <h5 className="font-bold">{t('billHistory.updateBill')}</h5>
              <input
                type="text"
                placeholder={t('billHistory.title')}
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder={t('billHistory.amount')}
                value={updatedAmount}
                onChange={(e) => setUpdatedAmount(Number(e.target.value))}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder={t('billHistory.currency')}
                value={updatedCurrency}
                onChange={(e) => setUpdatedCurrency(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder={t('billHistory.toWhom')}
                value={updatedToWhom}
                onChange={(e) => setUpdatedToWhom(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                placeholder={t('billHistory.dueDate')}
                value={updatedDueDate}
                onChange={(e) => setUpdatedDueDate(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <button onClick={() => handleUpdate(bill.id)} className="bg-blue-500 text-white p-2 rounded mr-2">{t('billHistory.saveButton')}</button>
              <button onClick={() => setEditingBill(null)} className="bg-gray-500 text-white p-2 rounded">{t('billHistory.cancelButton')}</button>
            </div>
          )}
          
          {/* Action buttons */}
          <button
            onClick={() => setEditingBill(bill.id === editingBill?.id ? null : bill)}
            className="bg-yellow-500 text-white p-2 rounded mr-2"
          >
            {editingBill?.id === bill.id ? t('billHistory.cancelButton') : t('billHistory.editButton')}
          </button>
          <button
            onClick={() => handleDelete(bill.id)}
            className="bg-red-500 text-white p-2 rounded"
          >
            {t('billHistory.deleteButton')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default BillHistory;
