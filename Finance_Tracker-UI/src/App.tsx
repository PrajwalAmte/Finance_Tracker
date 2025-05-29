import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './utils/theme-context';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { SipsPage } from './pages/SipsPage';
import { LoansPage } from './pages/LoansPage';
import { ExpensesPage } from './pages/ExpensesPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="investments" element={<InvestmentsPage />} />
            <Route path="sips" element={<SipsPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;