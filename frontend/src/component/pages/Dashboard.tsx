import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Navbar from '../Navbar';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface Bill {
  id: number;
  title: string;
  amount: number;
  currency: string;
  toWhom: string;
  dueDate: string;
}

const Dashboard: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const { token } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const headers = { Authorization: `${token}` };
        const response = await axios.get('http://localhost:3000/api/bills', { headers });
        const upcomingBills = response.data.bills.filter((bill: Bill) => {
          const billDate = new Date(bill.dueDate);
          return billDate >= new Date();
        });
        setBills(upcomingBills);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, [token]);

  return (
    <>
      <div className="flex">
        <Navbar />
        <div className="ml-64 p-4">
          <h2 className="text-2xl font-bold mb-4">{t('dashboard.title')}</h2>
          {bills.length === 0 ? (
            <p>{t('dashboard.noBills')}</p>
          ) : (
            <div className="grid gap-4">
              {bills.map((bill) => (
                <div key={bill.id} className="p-4 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold">{bill.title}</h3>
                  <p>
                    <strong>{t('dashboard.amount')}</strong> {bill.currency} {bill.amount}
                  </p>
                  <p>
                    <strong>{t('dashboard.toWhom')}</strong> {bill.toWhom}
                  </p>
                  <p>
                    <strong>{t('dashboard.dueDate')}</strong> {format(new Date(bill.dueDate), 'dd MMM yyyy')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
