import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const TransactionForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const { token } = useAuth();
  const { t } = useTranslation();

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `${token}` };
      await axios.post('http://localhost:3000/api/transactions', { type, amount, currency, category, desc, date }, { headers });
      setAmount(0);
      setType('');
      setCurrency('');
      setCategory('');
      setDesc('');
      setDate('');
      window.location.reload();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <form onSubmit={handleAddTransaction} className="mb-4">
      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="">{t('transactionForm.selectType')}</option>
        <option value="income">{t('transactionForm.income')}</option>
        <option value="expense">{t('transactionForm.expense')}</option>
      </select>
      <input type="number" placeholder={t('transactionForm.amount')} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
      <input type="text" placeholder={t('transactionForm.currency')} value={currency} onChange={(e) => setCurrency(e.target.value)} required />
      <input type="text" placeholder={t('transactionForm.category')} value={category} onChange={(e) => setCategory(e.target.value)} required />
      <input type="text" placeholder={t('transactionForm.desc')} value={desc} onChange={(e) => setDesc(e.target.value)} required />
      <input type="date" placeholder={t('transactionForm.date')} value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit">{t('transactionForm.addButton')}</button>
    </form>
  );
};

export default TransactionForm;
