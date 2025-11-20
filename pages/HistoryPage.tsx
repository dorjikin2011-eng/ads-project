import React from 'react';
import { Declaration } from '../types';
import DeclarationRow from '../components/DeclarationRow';
interface HistoryPageProps {
declarations: Declaration[];
}
const HistoryPage: React.FC<HistoryPageProps> = ({ declarations }) => {
return (
<div>
<h1 className="text-3xl font-bold text-text-main mb-2">Declaration History</h1>
<p className="text-text-secondary mb-8">A complete record of all your past submissions.</p>
code
Code
<div className="bg-white rounded-lg shadow-md p-6">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Year</th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Type</th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Submission Date</th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Status</th>
            <th className="py-3 px-4 font-semibold text-sm text-text-secondary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {declarations.map(declaration => (
            <DeclarationRow key={declaration.year} declaration={declaration} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
);
};
export default HistoryPage;