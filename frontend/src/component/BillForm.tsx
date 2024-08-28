import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const BillForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [toWhom, setToWhom] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const { token } = useAuth();
  const { t } = useTranslation();

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `${token}` };
      await axios.post('http://localhost:3000/api/bills', { title, amount, currency, toWhom, dueDate }, { headers });
      setAmount(0);
      setTitle('');
      setCurrency('');
      setToWhom('');
      setDueDate('');
      window.location.reload();
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  return (
    <form onSubmit={handleAddBill} className="mb-4">
      <input type="text" placeholder={t('billForm.title')} value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="number" placeholder={t('billForm.amount')} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
      <input type="text" placeholder={t('billForm.currency')} value={currency} onChange={(e) => setCurrency(e.target.value)} required />
      <input type="text" placeholder={t('billForm.toWhom')} value={toWhom} onChange={(e) => setToWhom(e.target.value)} required />
      <input type="date" placeholder={t('billForm.dueDate')} value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      <button type="submit">{t('billForm.addButton')}</button>
    </form>
  );
};

export default BillForm;
