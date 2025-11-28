import React from 'react';
import { Declaration } from '../types';
import DeclarationRow from '../components/DeclarationRow';
import DocumentIcon from '../components/icons/DocumentIcon';

interface HistoryPageProps {
  declarations: Declaration[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ declarations }) => {
    const handleDownloadReceipt = (year: number) => {
        alert(`Downloading Acknowledgement Receipt for ${year}...`);
    };

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-2">Declaration History</h1>
      <p className="text-text-secondary mb-8">A complete record of all your past submissions.</p>
      
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
                <tr key={declaration.year} className="border-b border-gray-200 hover:bg-gray-50">
                    {/* Reuse existing row logic but add Receipt Button */}
                    <td className="py-4 px-4 text-text-main">{declaration.year}</td>
                    <td className="py-4 px-4 text-text-main">{declaration.type}</td>
                    <td className="py-4 px-4 text-text-secondary">{declaration.submissionDate}</td>
                    <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block bg-green-100 text-green-800`}>
                            {declaration.status}
                        </span>
                    </td>
                    <td className="py-4 px-4 flex space-x-3">
                        <button className="text-blue-600 hover:underline font-medium text-sm">View Details</button>
                        <button 
                            onClick={() => handleDownloadReceipt(declaration.year)}
                            className="flex items-center text-gray-600 hover:text-primary font-medium text-sm"
                            title="Download Official Receipt"
                        >
                            <DocumentIcon className="w-4 h-4 mr-1" /> Receipt
                        </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;