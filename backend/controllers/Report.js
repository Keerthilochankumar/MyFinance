const { User, Bill, Saving, Transaction } = require('../models');
const moment = require('moment');

exports.getReport = async (req, res) => {
  const userId = req.user.id;

  try {
    
    const [bills, savings, transactions] = await Promise.all([
      Bill.findAll({ where: { userId } }),
      Saving.findAll({ where: { userId } }),
      Transaction.findAll({ where: { userId } })
    ]);

    const totalIncome = transactions.length 
      ? transactions.filter(transaction => transaction.type === 'income')
                    .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      : 0;

    const totalExpenses = transactions.length 
      ? transactions.filter(transaction => transaction.type === 'expense')
                    .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      : 0;

    const totalBalance = totalIncome - totalExpenses;

    const currentYear = moment().year();
    const yearlyTransactions = transactions.filter(transaction =>
      moment(transaction.date).year() === currentYear
    );

    const yearlyIncome = yearlyTransactions.length
      ? yearlyTransactions.filter(transaction => transaction.type === 'income')
                          .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      : 0;

    const yearlyExpenses = yearlyTransactions.length
      ? yearlyTransactions.filter(transaction => transaction.type === 'expense')
                          .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      : 0;

    const yearlyBalance = yearlyIncome - yearlyExpenses;

    const currentMonth = moment().month() + 1;
    const monthlyTransactions = yearlyTransactions.filter(transaction =>
      moment(transaction.date).month() + 1 === currentMonth
    );

    const monthlyIncome = monthlyTransactions.length
      ? monthlyTransactions.filter(transaction => transaction.type === 'income')
                           .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      : 0;

    const monthlyExpenses = monthlyTransactions.length
      ? monthlyTransactions.filter(transaction => transaction.type === 'expense')
                           .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      : 0;

    const monthlyBalance = monthlyIncome - monthlyExpenses;

 
    const currentDate = moment().format('YYYY-MM-DD');
    const dailyTransactions = transactions.filter(transaction =>
      moment(transaction.date).format('YYYY-MM-DD') === currentDate
    );

    const dailyIncome = dailyTransactions.length
      ? dailyTransactions.filter(transaction => transaction.type === 'income')
                         .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      : 0;

    const dailyExpenses = dailyTransactions.length
      ? dailyTransactions.filter(transaction => transaction.type === 'expense')
                         .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
      : 0;

    const dailyBalance = dailyIncome - dailyExpenses;

 
    const totalSavings = savings.length 
      ? savings.reduce((sum, saving) => sum + parseFloat(saving.amount || 0), 0)
      : 0;

    const averageMonthlySavings = totalSavings / 12;

  
    const upcomingBills = bills.filter(bill => new Date(bill.dueDate) > new Date());

  
    const categorizedTransactions = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = [];
      }
      acc[transaction.category].push(transaction);
      return acc;
    }, {});

 
    const insights = {
      overall: { totalIncome, totalExpenses, totalBalance },
      yearly: { yearlyIncome, yearlyExpenses, yearlyBalance },
      monthly: { monthlyIncome, monthlyExpenses, monthlyBalance },
      daily: { dailyIncome, dailyExpenses, dailyBalance },
      totalSavings,
      averageMonthlySavings,
      upcomingBillsCount: upcomingBills.length,
      categorizedTransactions,
    };

    const report = {
      insights,
      bills,
      savings,
      transactions,
      balancePieChart: { totalBalance, totalIncome, totalExpenses }
    };
    console.log('Report generated:', report);

    res.json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
