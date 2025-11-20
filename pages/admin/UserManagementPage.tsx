import React, { useState } from 'react';
import { UserRole } from '../../types';
import UserGroupIcon from '../../components/icons/UserGroupIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import UserAddIcon from '../../components/icons/UserAddIcon';
import Modal from '../../components/Modal';
import CheckIcon from '../../components/icons/CheckIcon';
interface Official {
id: string;
name: string;
email: string;
designation: string;
agency: string;
schedule: 'Schedule I' | 'Schedule II';
status: 'Active' | 'Inactive';
lastLogin?: string;
}
// Mock Data
const initialOfficials: Official[] = [
{ id: '11223344', name: 'H.E. Lyonpo Dorji', email: 'dorji@cabinet.gov.bt', designation: 'Minister', agency: 'Cabinet', schedule: 'Schedule I', status: 'Active', lastLogin: '2024-02-20' },
{ id: '99887766', name: 'Dasho Pema', email: 'pema@mof.gov.bt', designation: 'Secretary', agency: 'Ministry of Finance', schedule: 'Schedule I', status: 'Active', lastLogin: '2024-02-18' },
{ id: '55667788', name: 'Mr. Tashi Wangmo', email: 'tashi@mof.gov.bt', designation: 'Procurement Officer', agency: 'Ministry of Finance', schedule: 'Schedule II', status: 'Active', lastLogin: '2024-02-15' },
{ id: '44332211', name: 'Mrs. Ugyen Tenzin', email: 'ugyen@mof.gov.bt', designation: 'Accountant', agency: 'Ministry of Finance', schedule: 'Schedule II', status: 'Inactive', lastLogin: '2023-12-10' },
];
interface UserManagementPageProps {
userRole: UserRole;
}
const UserManagementPage: React.FC<UserManagementPageProps> = ({ userRole }) => {
const [officials, setOfficials] = useState<Official[]>(initialOfficials);
const [searchQuery, setSearchQuery] = useState('');
code
Code
// Modal States
const [isAddModalOpen, setAddModalOpen] = useState(false);
const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
const [newUser, setNewUser] = useState({ id: '', name: '', email: '', designation: '', agency: '', schedule: 'Schedule II' });
const [generatedCredential, setGeneratedCredential] = useState<{username: string, password: string} | null>(null);

// Filter Logic
const filteredOfficials = officials.filter(official => {
    // Role Filtering
    if (userRole === 'agency_admin') {
        if (official.agency !== 'Ministry of Finance' || official.schedule === 'Schedule I') return false;
    }

    // Search Filtering
    const lowerSearch = searchQuery.toLowerCase();
    return (
        official.name.toLowerCase().includes(lowerSearch) ||
        official.id.includes(lowerSearch) ||
        official.designation.toLowerCase().includes(lowerSearch)
    );
});

const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const schedule = userRole === 'agency_admin' ? 'Schedule II' : newUser.schedule as 'Schedule I' | 'Schedule II';
    const agency = userRole === 'agency_admin' ? 'Ministry of Finance' : newUser.agency;

    const newOfficial: Official = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        designation: newUser.designation,
        agency: agency,
        schedule: schedule,
        status: 'Active'
    };

    setOfficials([...officials, newOfficial]);
    setAddModalOpen(false);
    
    // Simulate Credential Generation
    setGeneratedCredential({
        username: newUser.id,
        password: Math.random().toString(36).slice(-8) // Random temp password
    });
    setSuccessModalOpen(true);
    
    // Reset form
    setNewUser({ id: '', name: '', email: '', designation: '', agency: '', schedule: 'Schedule II' });
};

const toggleStatus = (id: string) => {
    setOfficials(officials.map(off => 
        off.id === id ? { ...off, status: off.status === 'Active' ? 'Inactive' : 'Active' } : off
    ));
};

return (
    <div>
        {/* Success Modal with Credentials */}
        <Modal 
            isOpen={isSuccessModalOpen} 
            onClose={() => setSuccessModalOpen(false)} 
            title="Official Registered Successfully"
        >
            <div className="text-center p-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckIcon />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Credentials Generated</h3>
                <p className="text-sm text-gray-500 mt-2">
                    The official has been added to the master list. Please share these initial credentials securely.
                </p>
                
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4 text-left">
                    <p className="text-sm"><span className="font-semibold">Username/ID:</span> {generatedCredential?.username}</p>
                    <p className="text-sm mt-1"><span className="font-semibold">Temporary Password:</span> <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-300">{generatedCredential?.password}</span></p>
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => setSuccessModalOpen(false)}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </Modal>

        {/* Add User Modal */}
        <Modal 
            isOpen={isAddModalOpen} 
            onClose={() => setAddModalOpen(false)} 
            title="Register New Declarant"
        >
            <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Citizen ID / Official ID</label>
                        <input 
                            type="text" 
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            value={newUser.id}
                            onChange={e => setNewUser({...newUser, id: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                            type="text" 
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            value={newUser.name}
                            onChange={e => setNewUser({...newUser, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            value={newUser.email}
                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input 
                            type="text" 
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            value={newUser.designation}
                            onChange={e => setNewUser({...newUser, designation: e.target.value})}
                        />
                    </div>
                    
                    {userRole === 'admin' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Agency</label>
                                <input 
                                    type="text" 
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newUser.agency}
                                    onChange={e => setNewUser({...newUser, agency: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
                                <select 
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={newUser.schedule}
                                    onChange={e => setNewUser({...newUser, schedule: e.target.value})}
                                >
                                    <option value="Schedule I">Schedule I</option>
                                    <option value="Schedule II">Schedule II</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={() => setAddModalOpen(false)} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm font-medium">Register & Issue Credential</button>
                </div>
            </form>
        </Modal>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-text-main flex items-center">
                    <UserGroupIcon />
                    <span className="ml-3">Declarant Management</span>
                </h1>
                <p className="text-text-secondary mt-1">Manage the master list of officials required to declare assets.</p>
            </div>
            <button 
                onClick={() => setAddModalOpen(true)}
                className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition font-medium shadow-sm"
            >
                <UserAddIcon />
                <span className="ml-2">Register New Official</span>
            </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by Name, ID or Designation..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Official Info</th>
                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Agency / Position</th>
                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Category</th>
                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary">Status</th>
                        <th className="py-3 px-6 font-semibold text-sm text-text-secondary text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredOfficials.map((official) => (
                        <tr key={official.id} className={`hover:bg-gray-50 ${official.status === 'Inactive' ? 'bg-gray-50 opacity-75' : ''}`}>
                            <td className="py-4 px-6">
                                <div className="font-medium text-text-main">{official.name}</div>
                                <div className="text-xs text-text-secondary">ID: {official.id}</div>
                                <div className="text-xs text-text-secondary">{official.email}</div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="text-sm text-text-main">{official.designation}</div>
                                <div className="text-xs text-text-secondary">{official.agency}</div>
                            </td>
                            <td className="py-4 px-6 text-sm text-text-secondary">
                                {official.schedule}
                            </td>
                            <td className="py-4 px-6">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${official.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                                    {official.status}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                                <button className="text-sm text-primary hover:underline font-medium">Edit</button>
                                <span className="text-gray-300">|</span>
                                <button 
                                    onClick={() => toggleStatus(official.id)}
                                    className={`text-sm font-medium hover:underline ${official.status === 'Active' ? 'text-red-600' : 'text-green-600'}`}
                                >
                                    {official.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredOfficials.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No officials found matching your criteria.
                </div>
            )}
        </div>
    </div>
);
};
export default UserManagementPage;