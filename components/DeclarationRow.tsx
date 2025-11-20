import React from 'react';
import { Declaration, DeclarationStatus } from '../types';

interface DeclarationRowProps {
  declaration: Declaration;
}

const StatusBadge: React.FC<{ status: DeclarationStatus }> = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
  let colorClasses = "";

  switch (status) {
    case DeclarationStatus.APPROVED:
      colorClasses = "bg-green-100 text-green-800";
      break;
    case DeclarationStatus.SUBMITTED:
      colorClasses = "bg-blue-100 text-blue-800";
      break;
    case DeclarationStatus.PENDING:
      colorClasses = "bg-yellow-100 text-yellow-800";
      break;
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};


const DeclarationRow: React.FC<DeclarationRowProps> = ({ declaration }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-4 px-4 text-text-main">{declaration.year}</td>
      <td className="py-4 px-4 text-text-main">{declaration.type}</td>
      <td className="py-4 px-4 text-text-secondary">{declaration.submissionDate}</td>
      <td className="py-4 px-4">
        <StatusBadge status={declaration.status} />
      </td>
      <td className="py-4 px-4">
        <button className="text-accent hover:underline font-medium text-sm">View Details</button>
      </td>
    </tr>
  );
};

export default DeclarationRow;