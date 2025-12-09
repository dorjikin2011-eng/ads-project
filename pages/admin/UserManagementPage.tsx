import React, { useState } from 'react';
import { UserRole } from '../../types';
import UserGroupIcon from '../../components/icons/UserGroupIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import UserAddIcon from '../../components/icons/UserAddIcon';
import Modal from '../../components/Modal';
import CheckIcon from '../../components/icons/CheckIcon';
import DocumentIcon from '../../components/icons/DocumentIcon';
import HistoryIcon from '../../components/icons/HistoryIcon';
import WatchIcon from '../../components/icons/WatchIcon';
import ExportIcon from '../../components/icons/ExportIcon';
import FilterIcon from '../../components/icons/FilterIcon';
import CalendarIcon from '../../components/icons/CalendarIcon';
import WarningIcon from '../../components/icons/WarningIcon';
import CloseIcon from '../../components/icons/CloseIcon';

interface Official { 
  id: string; 
  name: string; 
  email: string; 
  designation: string; 
  agency: string; 
  schedule: 'Schedule I' | 'Schedule II'; 
  status: 'Active' | 'Inactive'; 
  role?: 'admin' | 'agency_admin' | 'hoa'; 
  lastLogin?: string;
  declarationCount?: number;
  lastDeclaration?: string;
  declarationStatus?: 'On Time' | 'Late' | 'Non-Declarant' | 'Incomplete';
  onWatchList?: boolean;
  monitoringNotes?: string;
  declarationDueDate?: string;
  lastFilingDate?: string;
}

const initialOfficials: Official[] = [ 
  { 
    id: '11223344', 
    name: 'H.E. Lyonpo Dorji', 
    email: 'dorji@cabinet.gov.bt', 
    designation: 'Minister', 
    agency: 'Cabinet', 
    schedule: 'Schedule I', 
    status: 'Active', 
    role: 'hoa', 
    lastLogin: '2024-02-20',
    declarationCount: 5,
    lastDeclaration: '2024-01-15',
    declarationStatus: 'On Time',
    onWatchList: true,
    monitoringNotes: 'Regular filer, no issues',
    declarationDueDate: '2024-03-31',
    lastFilingDate: '2024-01-15'
  }, 
  { 
    id: '99887766', 
    name: 'Dasho Pema', 
    email: 'pema@mof.gov.bt', 
    designation: 'Secretary', 
    agency: 'Ministry of Finance', 
    schedule: 'Schedule I', 
    status: 'Active', 
    role: 'hoa', 
    lastLogin: '2024-02-18',
    declarationCount: 8,
    lastDeclaration: '2024-01-20',
    declarationStatus: 'Late',
    onWatchList: false,
    declarationDueDate: '2024-01-31',
    lastFilingDate: '2024-02-05'
  }, 
  { 
    id: '55667788', 
    name: 'Mr. Tashi Wangmo', 
    email: 'tashi@mof.gov.bt', 
    designation: 'HR Officer', 
    agency: 'Ministry of Finance', 
    schedule: 'Schedule II', 
    status: 'Active', 
    role: 'agency_admin', 
    lastLogin: '2024-02-15',
    declarationCount: 3,
    lastDeclaration: '2024-01-10',
    declarationStatus: 'Non-Declarant',
    onWatchList: true,
    monitoringNotes: 'New employee, needs training',
    declarationDueDate: '2024-03-31'
  }, 
  { 
    id: '44332211', 
    name: 'Mrs. Ugyen Tenzin', 
    email: 'ugyen@mof.gov.bt', 
    designation: 'Accountant', 
    agency: 'Ministry of Finance', 
    schedule: 'Schedule II', 
    status: 'Inactive', 
    lastLogin: '2023-12-10',
    declarationCount: 0,
    lastDeclaration: undefined,
    declarationStatus: 'Non-Declarant',
    onWatchList: false
  }, 
  { 
    id: '33221100', 
    name: 'Karma Dorji', 
    email: 'karma@moe.gov.bt', 
    designation: 'Chief HR Officer', 
    agency: 'Ministry of Education', 
    schedule: 'Schedule II', 
    status: 'Active', 
    role: 'agency_admin', 
    lastLogin: '2024-03-01',
    declarationCount: 6,
    lastDeclaration: '2024-01-25',
    declarationStatus: 'Incomplete',
    onWatchList: true,
    monitoringNotes: 'Partially filed declaration, requires follow-up',
    declarationDueDate: '2024-03-31',
    lastFilingDate: '2024-01-25'
  },
  { 
    id: '66778899', 
    name: 'Dr. Sonam Wangchuk', 
    email: 'sonam@health.gov.bt', 
    designation: 'Director', 
    agency: 'Ministry of Health', 
    schedule: 'Schedule I', 
    status: 'Active', 
    role: 'hoa', 
    lastLogin: '2024-02-28',
    declarationCount: 7,
    lastDeclaration: '2024-02-01',
    declarationStatus: 'On Time',
    onWatchList: false,
    declarationDueDate: '2024-03-31',
    lastFilingDate: '2024-02-01'
  },
  { 
    id: '12345678', 
    name: 'Ms. Dechen Zangmo', 
    email: 'dechen@moaf.gov.bt', 
    designation: 'Deputy Secretary', 
    agency: 'Ministry of Agriculture', 
    schedule: 'Schedule II', 
    status: 'Active', 
    lastLogin: '2024-02-25',
    declarationCount: 0,
    lastDeclaration: undefined,
    declarationStatus: 'Non-Declarant',
    onWatchList: true,
    monitoringNotes: 'Multiple reminders sent, no response',
    declarationDueDate: '2024-03-31'
  },
  { 
    id: '87654321', 
    name: 'Dasho Karma Wangdi', 
    email: 'karma@mohca.gov.bt', 
    designation: 'Secretary', 
    agency: 'Ministry of Home Affairs', 
    schedule: 'Schedule I', 
    status: 'Active', 
    role: 'hoa', 
    lastLogin: '2024-03-02',
    declarationCount: 4,
    lastDeclaration: '2024-02-10',
    declarationStatus: 'Late',
    onWatchList: false,
    declarationDueDate: '2024-01-31',
    lastFilingDate: '2024-02-10'
  }
];

const initialRequests = [ 
  { id: 'REQ-ADM-01', type: 'Change Agency Admin', agency: 'Ministry of Education', nominee: 'Karma Tenzin (102030)', status: 'Pending', date: '2024-03-12' }, 
  { id: 'REQ-ADM-02', type: 'Add Sub-Admin', agency: 'Thimphu Thromde', nominee: 'Pema Lhamo (504030)', status: 'Approved', date: '2024-03-10' } 
];

interface UserManagementPageProps { 
  userRole: UserRole; 
  onFileOnBehalf?: (officialName: string, officialId: string) => void; 
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ userRole, onFileOnBehalf }) => {
    const [activeTab, setActiveTab] = useState<'Master List' | 'Admin Requests' | 'Watch List'>('Master List');
    const [officials, setOfficials] = useState<Official[]>(initialOfficials);
    const [adminRequests, setAdminRequests] = useState(initialRequests);
    const [searchQuery, setSearchQuery] = useState('');
    const [scheduleFilter, setScheduleFilter] = useState<'All' | 'Schedule I' | 'Schedule II'>('All');
    const [roleFilter, setRoleFilter] = useState<'All' | 'agency_admin' | 'hoa'>('All');
    const [declarationFilter, setDeclarationFilter] = useState<'All' | 'On Time' | 'Late' | 'Non-Declarant' | 'Incomplete'>('All');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isRequestModalOpen, setRequestModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [isWatchListNotesModalOpen, setWatchListNotesModalOpen] = useState(false);
    const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
    const [watchListNotes, setWatchListNotes] = useState('');
    const [newUser, setNewUser] = useState({ id: '', name: '', email: '', designation: '', agency: '', schedule: 'Schedule II', role: 'user' });
    const [newRequest, setNewRequest] = useState({ type: 'Change Agency Admin', nomineeId: '', nomineeName: '', reason: '' });
    const [registeredEmail, setRegisteredEmail] = useState('');

    // Filter Logic
    const filteredOfficials = officials.filter(official => {
        if (userRole === 'agency_admin') { 
            if (official.agency !== 'Ministry of Finance') return false; 
        }
        if (userRole === 'admin') { 
            if (scheduleFilter !== 'All' && official.schedule !== scheduleFilter) return false; 
            if (roleFilter !== 'All' && official.role !== roleFilter) return false; 
            if (declarationFilter !== 'All' && official.declarationStatus !== declarationFilter) return false;
        }
        const lowerSearch = searchQuery.toLowerCase();
        return ( 
            official.name.toLowerCase().includes(lowerSearch) || 
            official.id.includes(lowerSearch) || 
            official.designation.toLowerCase().includes(lowerSearch) || 
            official.agency.toLowerCase().includes(lowerSearch) 
        );
    });

    // Filter for Watch List
    const watchListOfficials = officials.filter(official => official.onWatchList);

    // Export to Excel function
    const exportToExcel = (data: Official[], filename: string) => {
        // In a real implementation, you would use a library like xlsx or generate CSV
        const csvContent = "data:text/csv;charset=utf-8," 
            + ["ID,Name,Email,Designation,Agency,Schedule,Status,Declaration Status,Last Declaration,Declaration Count,Monitoring Notes"]
            .concat(data.map(o => 
                `"${o.id}","${o.name}","${o.email}","${o.designation}","${o.agency}","${o.schedule}","${o.status}","${o.declarationStatus || 'N/A'}","${o.lastDeclaration || 'N/A'}","${o.declarationCount || 0}","${o.monitoringNotes || ''}"`
            ))
            .join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`${filename} exported successfully!`);
    };

    // View History Handler
    const handleViewHistory = (officialId: string, officialName: string) => {
        // Store data to pass to HistoryPage
        const adminViewData = {
            officialId,
            officialName,
            viewerRole: userRole,
            timestamp: new Date().toISOString()
        };
        
        sessionStorage.setItem('adminViewData', JSON.stringify(adminViewData));
        
        // Navigate to History page
        window.location.href = `/history?officialId=${officialId}&viewAs=admin`;
    };

    // Watch List Handlers
    const handleAddToWatchList = (official: Official) => {
        setSelectedOfficial(official);
        setWatchListNotes(official.monitoringNotes || '');
        setWatchListNotesModalOpen(true);
    };

    const handleRemoveFromWatchList = (id: string) => {
        if(confirm("Remove this official from Watch List?")) {
            setOfficials(officials.map(off => 
                off.id === id ? { ...off, onWatchList: false, monitoringNotes: '' } : off
            ));
        }
    };

    const handleSaveWatchListNotes = () => {
        if (selectedOfficial) {
            const isAddingToWatchList = !selectedOfficial.onWatchList;
            setOfficials(officials.map(off => 
                off.id === selectedOfficial.id ? { 
                    ...off, 
                    onWatchList: true, 
                    monitoringNotes: watchListNotes 
                } : off
            ));
            setWatchListNotesModalOpen(false);
            setSelectedOfficial(null);
            setWatchListNotes('');
            
            if (isAddingToWatchList) {
                alert(`${selectedOfficial.name} has been added to Watch List with monitoring notes.`);
            } else {
                alert("Monitoring notes updated.");
            }
        }
    };

    // Handlers
    const handleAddUser = (e: React.FormEvent) => { 
        e.preventDefault(); 
        let finalSchedule = newUser.schedule as 'Schedule I' | 'Schedule II'; 
        let finalAgency = newUser.agency; 
        let finalRole = newUser.role; 
        if (userRole === 'agency_admin') { 
            finalSchedule = 'Schedule II'; 
            finalAgency = 'Ministry of Finance'; 
            finalRole = 'user'; 
        } 
        const newOfficial: Official = { 
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            designation: newUser.designation, 
            agency: finalAgency, 
            schedule: finalSchedule, 
            status: 'Active', 
            role: finalRole as any, 
            declarationCount: 0,
            declarationStatus: 'Non-Declarant'
        }; 
        setOfficials([...officials, newOfficial]); 
        setAddModalOpen(false); 
        setRegisteredEmail(newUser.email); 
        setSuccessModalOpen(true); 
        setNewUser({ id: '', name: '', email: '', designation: '', agency: '', schedule: 'Schedule II', role: 'user' }); 
    };
    
    const handleSubmitRequest = (e: React.FormEvent) => { 
        e.preventDefault(); 
        const req = { 
            id: `REQ-ADM-${Date.now().toString().slice(-3)}`, 
            type: newRequest.type, 
            agency: 'Ministry of Finance', 
            nominee: `${newRequest.nomineeName} (${newRequest.nomineeId})`, 
            status: 'Pending', 
            date: new Date().toISOString().split('T')[0] 
        }; 
        setAdminRequests([req, ...adminRequests]); 
        setRequestModalOpen(false); 
        alert("Request submitted to CADA for approval."); 
    };
    
    const handleApproveRequest = (id: string) => { 
        setAdminRequests(adminRequests.map(r => r.id === id ? { ...r, status: 'Approved' } : r)); 
        alert("Request Approved. User roles updated."); 
    };
    
    const handleRejectRequest = (id: string) => { 
        setAdminRequests(adminRequests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r)); 
    };
    
    const toggleStatus = (id: string) => { 
        setOfficials(officials.map(off => off.id === id ? { ...off, status: off.status === 'Active' ? 'Inactive' : 'Active' } : off)); 
    };
    
    const promoteToAdmin = (id: string) => { 
        if(confirm("Are you sure you want to promote this user to ADA?")) { 
            setOfficials(officials.map(off => off.id === id ? { ...off, role: 'agency_admin' } : off)); 
        } 
    };

    // Get declaration status badge color
    const getDeclarationStatusColor = (status?: string) => {
        switch(status) {
            case 'On Time':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Late':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Non-Declarant':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Incomplete':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div>
            {/* Success Modal (Email Notification) */}
            <Modal isOpen={isSuccessModalOpen} onClose={() => setSuccessModalOpen(false)} title="Registration Successful">
                <div className="text-center p-6">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <CheckIcon className="w-10 h-10 text-green-600"/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">User Registered</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                        <p className="text-sm text-blue-800 mb-2">An automated email containing the username and temporary password has been sent to:</p>
                        <p className="text-lg font-mono font-bold text-blue-900 text-center">{registeredEmail}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">The user will be prompted to change their password upon first login.</p>
                    <div className="mt-6">
                        <button onClick={() => setSuccessModalOpen(false)} className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark font-bold shadow-md">
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Watch List Notes Modal */}
            <Modal isOpen={isWatchListNotesModalOpen} onClose={() => setWatchListNotesModalOpen(false)} title={selectedOfficial?.onWatchList ? "Update Monitoring Notes" : "Add to Watch List"}>
                <div className="p-4">
                    {selectedOfficial && (
                        <>
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-text-main">{selectedOfficial.name}</h4>
                                <p className="text-sm text-text-secondary">ID: {selectedOfficial.id} | {selectedOfficial.designation}</p>
                                <p className="text-sm text-text-secondary">{selectedOfficial.agency}</p>
                                <div className="mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs border ${getDeclarationStatusColor(selectedOfficial.declarationStatus)}`}>
                                        {selectedOfficial.declarationStatus || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monitoring Notes
                                    <span className="text-xs text-gray-500 ml-2">(Reason for adding to watch list, observations, follow-up required)</span>
                                </label>
                                <textarea 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    rows={4}
                                    value={watchListNotes}
                                    onChange={(e) => setWatchListNotes(e.target.value)}
                                    placeholder="Enter monitoring notes..."
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setWatchListNotesModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleSaveWatchListNotes}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark font-bold"
                                >
                                    {selectedOfficial.onWatchList ? 'Update Notes' : 'Add to Watch List'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Add User Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Register New User">
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CID / Official ID</label>
                            <input type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" 
                                value={newUser.id} onChange={e => setNewUser({...newUser, id: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" 
                                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" required className="mt-1 w-full px-3 py-2 border rounded-md" 
                                value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Designation</label>
                            <input type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" 
                                value={newUser.designation} onChange={e => setNewUser({...newUser, designation: e.target.value})} />
                        </div>
                        {userRole === 'admin' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Agency</label>
                                    <input type="text" className="mt-1 w-full px-3 py-2 border rounded-md" 
                                        value={newUser.agency} onChange={e => setNewUser({...newUser, agency: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
                                    <select className="mt-1 w-full px-3 py-2 border rounded-md" 
                                        value={newUser.schedule} onChange={e => setNewUser({...newUser, schedule: e.target.value})}>
                                        <option value="Schedule I">Schedule I</option>
                                        <option value="Schedule II">Schedule II</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 bg-blue-50 p-3 rounded border border-blue-100">
                                    <label className="block text-sm font-bold text-blue-900 mb-1">System Role Assignment</label>
                                    <select className="w-full px-3 py-2 border border-blue-200 rounded-md" 
                                        value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                        <option value="user">Declarant (Standard User)</option>
                                        <option value="agency_admin">Asset Declaration Administrator (ADA)</option>
                                        <option value="hoa">Head of Agency (HoA)</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => setAddModalOpen(false)} 
                            className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark font-bold">
                            Register & Send Email
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Request Modal */}
            <Modal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} title="Request Administrative Change">
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <p className="text-sm text-gray-600">Submit a request to CADA to update key agency roles.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Request Type</label>
                        <select className="mt-1 w-full px-3 py-2 border rounded-md" 
                            value={newRequest.type} onChange={e => setNewRequest({...newRequest, type: e.target.value})}>
                            <option>Change Agency Admin (ADA)</option>
                            <option>Change Head of Agency (HoA)</option>
                            <option>Appoint Sub-Agency Admin</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nominee Name</label>
                            <input type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" 
                                value={newRequest.nomineeName} onChange={e => setNewRequest({...newRequest, nomineeName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nominee CID</label>
                            <input type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" 
                                value={newRequest.nomineeId} onChange={e => setNewRequest({...newRequest, nomineeId: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reason / Remarks</label>
                        <textarea className="mt-1 w-full px-3 py-2 border rounded-md" rows={3} 
                            value={newRequest.reason} onChange={e => setNewRequest({...newRequest, reason: e.target.value})}></textarea>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => setRequestModalOpen(false)} 
                            className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                            Submit Request
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center">
                        <UserGroupIcon />
                        <span className="ml-3">User Management</span>
                    </h1>
                    <p className="text-text-secondary mt-1">Manage declarants and administrative roles.</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <button 
                        onClick={() => setActiveTab('Master List')} 
                        className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'Master List' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
                    >
                        <UserGroupIcon className="w-4 h-4" />
                        Master List
                    </button>
                    <button 
                        onClick={() => setActiveTab('Watch List')} 
                        className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'Watch List' ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
                    >
                        <WatchIcon className="w-4 h-4" />
                        Watch List
                    </button>
                    <button 
                        onClick={() => setActiveTab('Admin Requests')} 
                        className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'Admin Requests' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
                    >
                        Admin Change Requests
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'Master List' ? (
                <>
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative max-w-md w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search by Name, ID or Agency..." 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {userRole === 'admin' && (
                                <>
                                    <div className="bg-gray-100 rounded p-1 flex"> 
                                        <button 
                                            onClick={() => setRoleFilter('All')} 
                                            className={`text-xs px-3 py-1.5 rounded flex items-center gap-1 ${roleFilter === 'All' ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'}`}
                                        >
                                            <UserGroupIcon className="w-3 h-3" />
                                            All Users
                                        </button> 
                                        <button 
                                            onClick={() => setRoleFilter('agency_admin')} 
                                            className={`text-xs px-3 py-1.5 rounded ${roleFilter === 'agency_admin' ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'}`}
                                        >
                                            ADA (Admins)
                                        </button> 
                                        <button 
                                            onClick={() => setRoleFilter('hoa')} 
                                            className={`text-xs px-3 py-1.5 rounded ${roleFilter === 'hoa' ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'}`}
                                        >
                                            HoA
                                        </button> 
                                    </div>
                                    <div className="bg-gray-100 rounded p-1 flex"> 
                                        {['All', 'Schedule I', 'Schedule II'].map(sch => ( 
                                            <button 
                                                key={sch} 
                                                onClick={() => setScheduleFilter(sch as any)} 
                                                className={`text-xs px-3 py-1.5 rounded ${scheduleFilter === sch ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'}`}
                                            >
                                                {sch === 'All' ? 'All' : sch === 'Schedule I' ? 'Sch I' : 'Sch II'}
                                            </button> 
                                        ))} 
                                    </div>
                                    <div className="bg-gray-100 rounded p-1 flex"> 
                                        {['All', 'On Time', 'Late', 'Non-Declarant', 'Incomplete'].map(status => ( 
                                            <button 
                                                key={status} 
                                                onClick={() => setDeclarationFilter(status as any)} 
                                                className={`text-xs px-3 py-1.5 rounded flex items-center gap-1 ${declarationFilter === status ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'}`}
                                            >
                                                {status === 'Late' || status === 'Non-Declarant' ? (
                                                    <WarningIcon className="w-3 h-3" />
                                                ) : status === 'On Time' ? (
                                                    <CheckIcon className="w-3 h-3" />
                                                ) : null}
                                                {status}
                                            </button> 
                                        ))} 
                                    </div>
                                </>
                            )}
                            <button 
                                onClick={() => setAddModalOpen(true)} 
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark shadow-sm"
                            >
                                <UserAddIcon />
                                <span className="ml-2">Add User</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Official</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Designation</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Role</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Declaration Status</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Declarations</th>
                                    <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Status</th>
                                    <th className="py-3 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOfficials.map((official) => (
                                    <tr key={official.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-text-main flex items-center gap-2">
                                                {official.name}
                                                {official.onWatchList && (
                                                    <span className="text-amber-600" title="On Watch List">
                                                        <WatchIcon className="w-4 h-4" />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-text-secondary">ID: {official.id}</div>
                                            <div className="text-xs text-gray-500">{official.email}</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            {official.designation}
                                            <br/>
                                            <span className="text-xs text-gray-500">{official.agency}</span>
                                            <br/>
                                            <span className="text-xs text-gray-500">{official.schedule}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-xs border ${official.role ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                                                {official.role === 'agency_admin' ? 'ADA' : official.role === 'hoa' ? 'HoA' : 'Declarant'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getDeclarationStatusColor(official.declarationStatus)}`}>
                                                {official.declarationStatus || 'Unknown'}
                                            </span>
                                            {official.declarationDueDate && (
                                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    Due: {official.declarationDueDate}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm">
                                                <span className="font-medium">{official.declarationCount || 0} filed</span>
                                                {official.lastDeclaration && (
                                                    <div className="text-xs text-gray-500">
                                                        Last: {official.lastDeclaration}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${official.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                                {official.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end gap-2">
                                                {/* WATCH LIST BUTTON */}
                                                {userRole === 'admin' && (
                                                    <button 
                                                        onClick={() => official.onWatchList 
                                                            ? handleRemoveFromWatchList(official.id)
                                                            : handleAddToWatchList(official)}
                                                        className={`text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1 ${
                                                            official.onWatchList 
                                                                ? 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200'
                                                                : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                        title={official.onWatchList ? "Remove from Watch List" : "Add to Watch List"}
                                                    >
                                                        {official.onWatchList ? (
                                                            <>
                                                                <CloseIcon className="w-3 h-3" />
                                                                Remove Watch
                                                            </>
                                                        ) : (
                                                            <>
                                                                <WatchIcon className="w-3 h-3" />
                                                                Watch
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                
                                                {/* VIEW HISTORY BUTTON - for ADA and CADA */}
                                                {(userRole === 'agency_admin' || userRole === 'admin') && (
                                                    <button 
                                                        onClick={() => handleViewHistory(official.id, official.name)}
                                                        className="text-xs font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center gap-1"
                                                        title="View Declaration History"
                                                    >
                                                        <HistoryIcon className="w-3 h-3" />
                                                        History
                                                    </button>
                                                )}
                                                
                                                {/* FILE button - for HoA */}
                                                {onFileOnBehalf && official.status === 'Active' && (
                                                    <button 
                                                        onClick={() => onFileOnBehalf(official.name, official.id)}
                                                        className="text-xs font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                                                    >
                                                        File
                                                    </button>
                                                )}
                                                
                                                {/* ACTIVATE/DEACTIVATE button */}
                                                <button 
                                                    onClick={() => toggleStatus(official.id)}
                                                    className={`text-sm font-medium hover:underline ${official.status === 'Active' ? 'text-red-600' : 'text-green-600'}`}
                                                >
                                                    {official.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                
                                                {/* MAKE ADMIN button - for CADA only */}
                                                {userRole === 'admin' && !official.role && ( 
                                                    <>
                                                        <span className="text-gray-300">|</span>
                                                        <button 
                                                            onClick={() => promoteToAdmin(official.id)}
                                                            className="text-sm text-purple-600 font-medium hover:underline"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : activeTab === 'Watch List' ? (
                <>
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative max-w-md w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search watch list..." 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <div className="bg-gray-100 rounded p-1 flex"> 
                                {['All', 'Late', 'Non-Declarant', 'Incomplete'].map(status => ( 
                                    <button 
                                        key={status} 
                                        onClick={() => setDeclarationFilter(status as any)} 
                                        className={`text-xs px-3 py-1.5 rounded flex items-center gap-1 ${declarationFilter === status ? 'bg-white shadow text-primary font-bold' : 'text-gray-500'}`}
                                    >
                                        {status === 'Late' || status === 'Non-Declarant' ? (
                                            <WarningIcon className="w-3 h-3" />
                                        ) : null}
                                        {status}
                                    </button> 
                                ))} 
                            </div>
                            <button 
                                onClick={() => exportToExcel(watchListOfficials, 'watch_list')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm"
                            >
                                <ExportIcon />
                                <span className="ml-2">Export Watch List</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {watchListOfficials.length > 0 ? (
                            <>
                                <div className="p-4 bg-amber-50 border-b border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <WatchIcon className="w-6 h-6 text-amber-600" />
                                            <div>
                                                <h3 className="font-bold text-amber-900">Proactive Monitoring Watch List</h3>
                                                <p className="text-sm text-amber-700">
                                                    {watchListOfficials.length} officials being monitored for compliance
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-amber-800">
                                            Last updated: {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Official</th>
                                            <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Risk Level</th>
                                            <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Monitoring Notes</th>
                                            <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Last Action</th>
                                            <th className="py-3 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {watchListOfficials.map((official) => (
                                            <tr key={official.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-text-main">{official.name}</div>
                                                    <div className="text-xs text-text-secondary">ID: {official.id}</div>
                                                    <div className="text-xs text-gray-500">{official.designation}, {official.agency}</div>
                                                    <div className="mt-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getDeclarationStatusColor(official.declarationStatus)}`}>
                                                            {official.declarationStatus}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {official.declarationStatus === 'Non-Declarant' ? (
                                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                                            High Risk
                                                        </span>
                                                    ) : official.declarationStatus === 'Late' ? (
                                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                            Medium Risk
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                                                            Low Risk
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-700 max-w-xs">
                                                        {official.monitoringNotes || 'No notes provided'}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm">
                                                        {official.lastDeclaration ? (
                                                            <>
                                                                <span className="font-medium">Last filed: {official.lastDeclaration}</span>
                                                                <div className="text-xs text-gray-500">
                                                                    Total: {official.declarationCount || 0} declarations
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-red-600 font-medium">Never filed</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleAddToWatchList(official)}
                                                            className="text-xs font-medium text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50"
                                                            title="Update Monitoring Notes"
                                                        >
                                                            Update Notes
                                                        </button>
                                                        <button 
                                                            onClick={() => handleViewHistory(official.id, official.name)}
                                                            className="text-xs font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center gap-1"
                                                        >
                                                            <HistoryIcon className="w-3 h-3" />
                                                            History
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRemoveFromWatchList(official.id)}
                                                            className="text-xs font-medium text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 flex items-center gap-1"
                                                        >
                                                            <CloseIcon className="w-3 h-3" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <WatchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No officials on Watch List</h3>
                                <p className="text-gray-600 mb-6">Add officials to the watch list for proactive monitoring.</p>
                                <button 
                                    onClick={() => setActiveTab('Master List')}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                >
                                    Go to Master List
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {userRole === 'agency_admin' && ( 
                        <div className="mb-6 flex justify-end"> 
                            <button 
                                onClick={() => setRequestModalOpen(true)} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm flex items-center"
                            >
                                <DocumentIcon className="w-5 h-5 mr-2" /> 
                                New Change Request
                            </button> 
                        </div> 
                    )}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-6 text-sm text-text-secondary">Request Type</th>
                                    <th className="py-3 px-6 text-sm text-text-secondary">Agency</th>
                                    <th className="py-3 px-6 text-sm text-text-secondary">Nominee Details</th>
                                    <th className="py-3 px-6 text-sm text-text-secondary">Status</th>
                                    {userRole === 'admin' && <th className="py-3 px-6 text-right">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {adminRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <span className="font-medium text-gray-900">{req.type}</span>
                                            <br/>
                                            <span className="text-xs text-gray-500">{req.date}</span>
                                        </td>
                                        <td className="py-4 px-6 text-sm">{req.agency}</td>
                                        <td className="py-4 px-6 text-sm">{req.nominee}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        {userRole === 'admin' && ( 
                                            <td className="py-4 px-6 text-right"> 
                                                {req.status === 'Pending' && ( 
                                                    <div className="flex justify-end gap-2"> 
                                                        <button 
                                                            onClick={() => handleRejectRequest(req.id)}
                                                            className="text-red-600 text-xs font-medium border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                                                        >
                                                            Reject
                                                        </button> 
                                                        <button 
                                                            onClick={() => handleApproveRequest(req.id)}
                                                            className="text-green-600 text-xs font-medium border border-green-200 px-2 py-1 rounded hover:bg-green-50"
                                                        >
                                                            Approve
                                                        </button> 
                                                    </div> 
                                                )} 
                                            </td> 
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserManagementPage;