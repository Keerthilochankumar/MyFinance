import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const SavingForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const { token } = useAuth();
  const { t } = useTranslation();

  const handleAddSaving = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const headers = { Authorization: `${token}` };
      await axios.post('http://localhost:3000/api/savings', { amount, currency, desc, date }, { headers });
      setAmount(0);
      setCurrency('');
      setDesc('');
      setDate('');
      // Optionally refetch or update state here
      window.location.reload();
    } catch (error) {
      console.error('Error adding saving:', error);
    }
  };

  return (
    <form onSubmit={handleAddSaving} className="mb-4">
      <input type="number" placeholder={t('savingForm.amount')} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
      <input type="text" placeholder={t('savingForm.currency')} value={currency} onChange={(e) => setCurrency(e.target.value)} required />
      <input type="text" placeholder={t('savingForm.desc')} value={desc} onChange={(e) => setDesc(e.target.value)} required />
      <input type="date" placeholder={t('savingForm.date')} value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit">{t('savingForm.addButton')}</button>
    </form>
  );
};

export default SavingForm;
