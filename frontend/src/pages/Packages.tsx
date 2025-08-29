import React, { useState } from 'react';
import { PackageHeader, PackageSearchAndFilters, PackageContent } from '../components/packages';

const Packages: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <PackageHeader onCreateClick={handleCreateClick} />
      <PackageSearchAndFilters />
      <PackageContent 
        onCreateModalOpen={isCreateModalOpen}
        onCloseCreateModal={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Packages;
