import React from 'react';
import { SettingsHeader, SettingsSearchAndFilters, SettingsContent } from '../components/settings';

const Settings: React.FC = () => {
  return (
    <div className="space-y-8">
      <SettingsHeader />
      <SettingsSearchAndFilters />
      <SettingsContent />
    </div>
  );
};

export default Settings;
