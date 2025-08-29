import React from 'react';
import { PackageHeader, PackageSearchAndFilters, PackageContent } from '../components/packages';

const Packages: React.FC = () => {
  return (
    <div className="space-y-8">
      <PackageHeader />
      <PackageSearchAndFilters />
      <PackageContent />
    </div>
  );
};

export default Packages;
