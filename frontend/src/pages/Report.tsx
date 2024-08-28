/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import Navbar from '../component/Navbar';
import { useTranslation } from 'react-i18next';

interface ReportData {
  overall: { totalIncome: number; totalExpenses: number; totalBalance: number };
  yearly: { yearlyIncome: number; yearlyExpenses: number; yearlyBalance: number };
  monthly: { monthlyIncome: number; monthlyExpenses: number; monthlyBalance: number };
  daily: { dailyIncome: number; dailyExpenses: number; dailyBalance: number };
  totalSavings: number;
  averageMonthlySavings: number;
  upcomingBillsCount: number;
  categorizedTransactions: Record<string, Array<{ amount: number }>>;
  balancePieChart: { totalBalance: number; totalIncome: number; totalExpenses: number };
}

interface ReportCardProps {
  title: string;
  children: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, children }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};

const FinancialReport: React.FC = () => {
  const { t } = useTranslation();
  const [report, setReport] = useState<ReportData | null>(null);
  const barChartRef = useRef<SVGSVGElement | null>(null);
  const pieChartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    axios.get('http://localhost:3000/api/report', { headers })
      .then(response => {
        setReport(response.data.report.insights);
      })
      .catch(error => {
        console.error('Error fetching report data:', error);
      });
  }, []);

  useEffect(() => {
    if (report) {
      drawBarChart();
      drawPieChart();
    }
  }, [report]);

  const drawBarChart = () => {
    if (!barChartRef.current || !report) return;

    const data = [
      { label: t('Total Income'), value: report.overall.totalIncome ?? 0 },
      { label: t('Total Expenses'), value: report.overall.totalExpenses ?? 0 },
      { label: t('Total Balance'), value: report.overall.totalBalance ?? 0 },
    ];

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select(barChartRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f4f4f4');

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)!]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('x', d => x(d.label)!)
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', 'steelblue');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('transform', `translate(${margin.left},0)`);

    svg.append('g')
      .call(d3.axisBottom(x))
      .attr('transform', `translate(0,${height - margin.bottom})`);
  };

  const drawPieChart = () => {
    if (!pieChartRef.current || !report) return;

    const data = Object.entries(report.categorizedTransactions).map(([key, value]) => ({
      category: key,
      amount: value.reduce((sum, item) => sum + item.amount, 0)
    }));

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(pieChartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.category))
      .range(d3.schemeCategory10);

    const pie = d3.pie<{ category: string; amount: number }>()
      .value(d => d.amount)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ category: string; amount: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    svg.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.category));

    svg.selectAll('text')
      .data(pie(data))
      .enter().append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.category);
  };

  const formatCurrency = (value: number | undefined) => {
    return value ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value) : '$0.00';
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 p-4">
        <ReportCard title={t('Financial Report')}>
          {report ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{t('Overall Financial Overview')}</h3>
                  <svg ref={barChartRef} className="w-full"></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{t('Transaction Categories')}</h3>
                  <svg ref={pieChartRef} className="w-full"></svg>
                </div>
              </div>
              <div className="border-t mt-6 pt-4">
                <h3 className="text-xl font-semibold mb-2">{t('Details')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Total Income')}:</strong> {formatCurrency(report.overall.totalIncome)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Total Expenses')}:</strong> {formatCurrency(report.overall.totalExpenses)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Total Balance')}:</strong> {formatCurrency(report.overall.totalBalance)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Yearly Income')}:</strong> {formatCurrency(report.yearly.yearlyIncome)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Yearly Expenses')}:</strong> {formatCurrency(report.yearly.yearlyExpenses)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Yearly Balance')}:</strong> {formatCurrency(report.yearly.yearlyBalance)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Monthly Income')}:</strong> {formatCurrency(report.monthly.monthlyIncome)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Monthly Expenses')}:</strong> {formatCurrency(report.monthly.monthlyExpenses)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Monthly Balance')}:</strong> {formatCurrency(report.monthly.monthlyBalance)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Daily Income')}:</strong> {formatCurrency(report.daily.dailyIncome)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Daily Expenses')}:</strong> {formatCurrency(report.daily.dailyExpenses)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Daily Balance')}:</strong> {formatCurrency(report.daily.dailyBalance)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Total Savings')}:</strong> {formatCurrency(report.totalSavings)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Average Monthly Savings')}:</strong> {formatCurrency(report.averageMonthlySavings)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <p><strong>{t('Upcoming Bills Count')}:</strong> {report.upcomingBillsCount}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>{t('Loading report...')}</p>
          )}
        </ReportCard>
      </div>
    </div>
  );
};

export default FinancialReport;
