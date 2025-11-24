import React, { useState, useEffect } from 'react';
import CheckIcon from '../../components/icons/CheckIcon';
import XIcon from '../../components/icons/XIcon';
import Modal from '../../components/Modal';
import SearchIcon from '../../components/icons/SearchIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';
import DocumentIcon from '../../components/icons/DocumentIcon';
import { UserRole } from '../../types';

// --- Data ---
const mockDeclarantsData: Record<string, any> = {
    '11223344': { id: '11223344', name: 'H.E. Lyonpo Dorji', schedule: 'Schedule I', designation: 'Minister', type: 'Annual', risk: 'Low', status: 'Pending Review', assets: [], documents: [{name: 'Tax.pdf', type: 'Tax'}] },
    '55667788': { id: '55667788', name: 'Mr. Tashi Wangmo', schedule: 'Schedule II', designation: 'Officer', type: 'Vacation of Office', risk: 'Medium', status: 'Pending Review', assets: [], documents: [{name: 'Clearance.pdf', type: 'Admin'}] }
};

// --- Components ---
const VerificationCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white border border-gray-200 rounded-lg mb-4 p-4 shadow-sm">
        <h3 className="font-bold text-gray-700 text-sm uppercase mb-3 border-b pb-2">{title}</h3>
        {children}
    </div>
);

interface AdminVerificationPageProps { userRole: UserRole; preSelectedId?: string | null; }

const AdminVerificationPage: React.FC<AdminVerificationPageProps> = ({ userRole, preSelectedId }) => {
    const [selectedId, setSelectedId] = useState<string | null>(preSelectedId || null);
    const [checks, setChecks] = useState({ timely: false, complete: false, accurate: false });
    const [isCertModalOpen, setCertModalOpen] = useState(false);

    useEffect(() => { if (preSelectedId) setSelectedId(preSelectedId); }, [preSelectedId]);
    const selected = selectedId ? mockDeclarantsData[selectedId] : null;

    const handleVerify = () => {
        if (selected?.type === 'Vacation of Office') {
            setCertModalOpen(true);
        } else {
            alert("Declaration Verified. Compliance Status Updated.");
        }
    };

    const issueCertificate = () => {
        alert("Clearance Certificate Issued! Notification sent to ACC and Declarant.");
        setCertModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Certificate Modal */}
            <Modal isOpen={isCertModalOpen} onClose={() => setCertModalOpen(false)} title="Issue Clearance Certificate">
                <div className="space-y-4 text-center">
                    <div className="bg-green-50 p-4 rounded text-green-800 text-sm border border-green-200">
                        You are confirming that <strong>{selected?.name}</strong> has satisfactorily declared their assets upon Vacation of Office.
                    </div>
                    <p className="text-gray-600 text-sm">This action will generate a digital Clearance Certificate available for the declarant to download.</p>
                    <button onClick={issueCertificate} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">Verify & Notify ACC</button>
                </div>
            </Modal>

            {/* Sidebar List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                <div className="lg:col-span-4 bg-white rounded-lg shadow p-4">
                    <h2 className="font-bold text-gray-700 mb-4">Pending Verification</h2>
                    {Object.values(mockDeclarantsData).map((d:any) => (
                        <button key={d.id} onClick={() => setSelectedId(d.id)} className={`w-full text-left p-3 rounded mb-2 ${selectedId === d.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}>
                            <div className="font-bold text-gray-800">{d.name}</div>
                            <div className="text-xs text-gray-500">{d.type} | {d.designation}</div>
                        </button>
                    ))}
                </div>

                {/* Main Panel */}
                <div className="lg:col-span-8">
                    {selected ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start border-b pb-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold">{selected.name}</h1>
                                    <p className="text-gray-500 text-sm">{selected.type} • {selected.schedule}</p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-xs font-bold">Pending Verification</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <VerificationCard title="1. Timeliness Check">
                                        <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer">
                                            <input type="checkbox" checked={checks.timely} onChange={(e) => setChecks({...checks, timely: e.target.checked})} className="h-5 w-5 text-green-600 rounded" />
                                            <span className="text-sm text-gray-700">Submitted within deadline?</span>
                                        </label>
                                    </VerificationCard>
                                    <VerificationCard title="2. Completeness Check">
                                        <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer">
                                            <input type="checkbox" checked={checks.complete} onChange={(e) => setChecks({...checks, complete: e.target.checked})} className="h-5 w-5 text-green-600 rounded" />
                                            <span className="text-sm text-gray-700">All mandatory fields filled?</span>
                                        </label>
                                    </VerificationCard>
                                    <VerificationCard title="3. Accuracy Check">
                                        <label className="flex items-center space-x-3 p-2 bg-gray-50 rounded cursor-pointer">
                                            <input type="checkbox" checked={checks.accurate} onChange={(e) => setChecks({...checks, accurate: e.target.checked})} className="h-5 w-5 text-green-600 rounded" />
                                            <span className="text-sm text-gray-700">Matches uploaded evidence?</span>
                                        </label>
                                    </VerificationCard>
                                </div>
                                <div>
                                    <VerificationCard title="Uploaded Evidence">
                                        {selected.documents.map((doc:any, i:number) => (
                                            <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded text-sm border-b border-dashed border-gray-200">
                                                <span className="flex items-center text-gray-600"><DocumentIcon className="w-4 h-4 mr-2 text-blue-500"/> {doc.name}</span>
                                                <button className="text-blue-600 font-bold text-xs">View</button>
                                            </div>
                                        ))}
                                    </VerificationCard>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
                                <button className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 font-medium">Return for Correction</button>
                                <button 
                                    onClick={handleVerify} 
                                    disabled={!checks.timely || !checks.complete || !checks.accurate}
                                    className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    <CheckIcon className="w-5 h-5 mr-2" />
                                    {selected.type === 'Vacation of Office' ? 'Verify & Issue Certificate' : 'Verify Compliance'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded shadow p-12">Select an official to verify</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminVerificationPage;