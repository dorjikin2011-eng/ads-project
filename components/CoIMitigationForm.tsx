// components/CoIMitigationForm.tsx
import React, { useState } from 'react';
import Modal from './Modal';

interface CoIMitigationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nature: string; steps: string; timeline: string }) => void;
  officialName: string;
}

const CoIMitigationForm: React.FC<CoIMitigationFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  officialName 
}) => {
  const [data, setData] = useState({ nature: '', steps: '', timeline: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
    setData({ nature: '', steps: '', timeline: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mitigation Plan: ${officialName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Nature of Conflict</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={data.nature}
            onChange={e => setData({...data, nature: e.target.value})}
            required
          >
            <option value="">Select...</option>
            <option value="Recusal">Recusal from decision-making</option>
            <option value="Divestment">Divestment of asset/interest</option>
            <option value="Disclosure">Enhanced disclosure</option>
            <option value="Other">Other (specify)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Mitigation Steps</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows={3}
            value={data.steps}
            onChange={e => setData({...data, steps: e.target.value})}
            placeholder="Describe concrete actions to be taken..."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Timeline</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="e.g., Within 30 days"
            value={data.timeline}
            onChange={e => setData({...data, timeline: e.target.value})}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark text-sm font-bold"
          >
            Submit Plan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CoIMitigationForm;