import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface Saving {
  id: number;
  amount: number;
  currency: string;
  desc: string;
  date: string;
}

const SavingHistory: React.FC<{ savings: Saving[] }> = ({ savings }) => {
  const { token } = useAuth();
  const [editingSaving, setEditingSaving] = useState<Saving | null>(null);
  const [updatedAmount, setUpdatedAmount] = useState<number>(0);
  const [updatedCurrency, setUpdatedCurrency] = useState<string>('');
  const [updatedDesc, setUpdatedDesc] = useState<string>('');
  const [updatedDate, setUpdatedDate] = useState<string>('');
  const { t } = useTranslation();

  const handleDelete = async (id: number) => {
    try {
      const headers = { Authorization: `${token}` };
      await axios.delete(`http://localhost:3000/api/savings/${id}`, { headers });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting saving:', error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const headers = { Authorization: `${token}` };
      await axios.put(
        `http://localhost:3000/api/savings/${id}`,
        { amount: updatedAmount, currency: updatedCurrency, desc: updatedDesc, date: updatedDate },
        { headers }
      );
      setEditingSaving(null); // Hide the update form
      window.location.reload();
    } catch (error) {
      console.error('Error updating saving:', error);
    }
  };

  return (
    <div className="space-y-4">
      {savings.map(saving => (
        <div key={saving.id} className="bg-gray-100 p-4 mb-2 rounded shadow-md relative">
          <p>{t('savingHistory.amount')}: {saving.amount}</p>
          <p>{t('savingHistory.currency')}: {saving.currency}</p>
          <p>{t('savingHistory.desc')}: {saving.desc}</p>
          <p>{t('savingHistory.date')}: {saving.date}</p>
          
          {editingSaving?.id === saving.id && (
            <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-lg rounded border border-gray-300">
              <h5 className="font-bold">{t('savingHistory.updateSaving')}</h5>
              <input
                type="number"
                placeholder={t('savingForm.amount')}
                value={updatedAmount}
                onChange={(e) => setUpdatedAmount(Number(e.target.value))}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder={t('savingForm.currency')}
                value={updatedCurrency}
                onChange={(e) => setUpdatedCurrency(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder={t('savingForm.desc')}
                value={updatedDesc}
                onChange={(e) => setUpdatedDesc(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                placeholder={t('savingForm.date')}
                value={updatedDate}
                onChange={(e) => setUpdatedDate(e.target.value)}
                className="block mb-2 p-2 border border-gray-300 rounded"
              />
              <button onClick={() => handleUpdate(saving.id)} className="bg-blue-500 text-white p-2 rounded mr-2">{t('savingHistory.saveButton')}</button>
              <button onClick={() => setEditingSaving(null)} className="bg-gray-500 text-white p-2 rounded">{t('savingHistory.cancelButton')}</button>
            </div>
          )}
          
          <button
            onClick={() => setEditingSaving(saving.id === editingSaving?.id ? null : saving)}
            className="bg-yellow-500 text-white p-2 rounded mr-2"
          >
            {editingSaving?.id === saving.id ? t('savingHistory.cancelButton') : t('savingHistory.editButton')}
          </button>
          <button
            onClick={() => handleDelete(saving.id)}
            className="bg-red-500 text-white p-2 rounded"
          >
            {t('savingHistory.deleteButton')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavingHistory;
