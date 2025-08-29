import React from 'react';
import { TransactionHeader, TransactionSearchAndFilters, TransactionContent } from '../components/transactions';

const Transactions: React.FC = () => {
  return (
    <div className="space-y-8">
      <TransactionHeader />
      <TransactionSearchAndFilters />
      <TransactionContent />
    </div>
  );
};

export default Transactions;
