import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CreditCard, DollarSign, BarChart4, ArrowRight } from 'lucide-react';
import { DashboardMetricCard } from '../components/dashboard/DashboardMetricCard';
import { Card } from '../components/ui/Card';
import { PieChart } from '../components/charts/PieChart';
import { Button } from '../components/ui/Button';
import { expenseApi } from '../api/expenseApi';
import { investmentApi } from '../api/investmentApi';
import { sipApi } from '../api/sipApi';
import { loanApi } from '../api/loanApi';
import { ExpenseSummary } from '../types/Expense';
import { InvestmentSummary } from '../types/Investment';
import { SipSummary } from '../types/Sip';
import { LoanSummary } from '../types/Loan';

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
  const [investmentSummary, setInvestmentSummary] = useState<InvestmentSummary | null>(null);
  const [sipSummary, setSipSummary] = useState<SipSummary | null>(null);
  const [loanSummary, setLoanSummary] = useState<LoanSummary | null>(null);

  // Load all summary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get current date for expense summary
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        
        // Fetch all summaries in parallel
        const [expensesResult, investmentsResult, sipsResult, loansResult] = await Promise.all([
          expenseApi.getSummary(firstDayOfMonth, lastDayOfMonth),
          investmentApi.getSummary(),
          sipApi.getSummary(),
          loanApi.getSummary()
        ]);
        
        setExpenseSummary(expensesResult);
        setInvestmentSummary(investmentsResult);
        setSipSummary(sipsResult);
        setLoanSummary(loansResult);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate net worth
  const calculateNetWorth = () => {
    const investmentValue = investmentSummary?.totalValue || 0;
    const sipValue = sipSummary?.totalCurrentValue || 0;
    const loanValue = loanSummary?.totalBalance || 0;
    
    // Assets - Liabilities
    return (investmentValue + sipValue) - loanValue;
  };

  // Prepare expense category data for pie chart
  const getExpenseCategoryData = () => {
    if (!expenseSummary?.expensesByCategory) return [];
    
    return Object.entries(expenseSummary.expensesByCategory).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Prepare investment data for pie chart
  const getAssetAllocationData = () => {
    const investmentValue = investmentSummary?.totalValue || 0;
    const sipValue = sipSummary?.totalCurrentValue || 0;
    
    return [
      { name: 'Investments', value: investmentValue },
      { name: 'SIPs', value: sipValue }
    ];
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Net Worth */}
        <DashboardMetricCard
          title="Net Worth"
          value={calculateNetWorth()}
          icon={<TrendingUp />}
          isLoading={isLoading}
          onClick={() => {}}
        />
        
        {/* Total Investments */}
        <DashboardMetricCard
          title="Investments"
          value={(investmentSummary?.totalValue || 0) + (sipSummary?.totalCurrentValue || 0)}
          changeValue={
            investmentSummary?.totalProfitLoss && investmentSummary.totalValue
              ? (investmentSummary.totalProfitLoss / investmentSummary.totalValue) * 100
              : undefined
          }
          changeLabel="Overall Return"
          icon={<TrendingUp />}
          isLoading={isLoading}
          onClick={() => {}}
        />
        
        {/* Total Loans */}
        <DashboardMetricCard
          title="Loan Balance"
          value={loanSummary?.totalBalance || 0}
          icon={<CreditCard />}
          isLoading={isLoading}
          onClick={() => {}}
        />
        
        {/* Monthly Expenses */}
        <DashboardMetricCard
          title="Monthly Expenses"
          value={expenseSummary?.totalExpenses || 0}
          icon={<DollarSign />}
          isLoading={isLoading}
          onClick={() => {}}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Chart */}
        <Card
          title="Asset Allocation"
          isLoading={isLoading}
          footer={
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                iconRight={<ArrowRight size={16} />}
                onClick={() => {}}
              >
                <Link to="/investments">View Investments</Link>
              </Button>
            </div>
          }
        >
          <PieChart
            data={getAssetAllocationData()}
            height={300}
          />
        </Card>
        
        {/* Expense Breakdown Chart */}
        <Card
          title="Expense Breakdown"
          isLoading={isLoading}
          footer={
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                iconRight={<ArrowRight size={16} />}
                onClick={() => {}}
              >
                <Link to="/expenses">View Expenses</Link>
              </Button>
            </div>
          }
        >
          <PieChart
            data={getExpenseCategoryData()}
            height={300}
          />
        </Card>
      </div>
    </div>
  );
};