import React, { useState, useEffect } from 'react';
import { Declaration } from '../types';
import DocumentIcon from '../components/icons/DocumentIcon';

interface HistoryPageProps {
  declarations: Declaration[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ declarations: propDeclarations }) => {
    const [declarations, setDeclarations] = useState<Declaration[]>(propDeclarations);
    const [isAdminView, setIsAdminView] = useState(false);
    const [targetOfficial, setTargetOfficial] = useState<{id: string, name: string} | null>(null);
    const [loading, setLoading] = useState(false);

    // Check for admin view on component mount
    useEffect(() => {
        // Get query parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const viewAs = urlParams.get('viewAs');
        const officialId = urlParams.get('officialId');
        
        if (viewAs === 'admin' && officialId) {
            setIsAdminView(true);
            
            // Try to get official name from sessionStorage or URL
            try {
                // First try sessionStorage (set by UserManagementPage)
                const adminViewData = sessionStorage.getItem('adminViewData');
                if (adminViewData) {
                    const data = JSON.parse(adminViewData);
                    if (data.officialId === officialId) {
                        setTargetOfficial({
                            id: officialId,
                            name: data.officialName || `Official ${officialId}`
                        });
                    }
                }
            } catch (e) {
                console.error('Error reading sessionStorage:', e);
            }
            
            // If no sessionStorage data, try URL parameter
            if (!targetOfficial) {
                const officialName = urlParams.get('officialName') || `Official ${officialId}`;
                setTargetOfficial({
                    id: officialId,
                    name: decodeURIComponent(officialName)
                });
            }
            
            // Load mock data for the target official (replace with API call)
            if (!propDeclarations || propDeclarations.length === 0) {
                setLoading(true);
                setTimeout(() => {
                    const mockDeclarations: Declaration[] = [
                        {
                            year: 2024,
                            type: 'Annual',
                            submissionDate: '2024-01-15',
                            status: 'Submitted' as any,
                            id: `DEC-${officialId}-2024`
                        },
                        {
                            year: 2023,
                            type: 'Annual',
                            submissionDate: '2023-01-10',
                            status: 'Submitted' as any,
                            id: `DEC-${officialId}-2023`
                        },
                        {
                            year: 2022,
                            type: 'Annual',
                            submissionDate: '2022-01-12',
                            status: 'Submitted' as any,
                            id: `DEC-${officialId}-2022`
                        }
                    ];
                    setDeclarations(mockDeclarations);
                    setLoading(false);
                }, 500);
            }
        } else {
            // Normal user view - use propDeclarations
            setDeclarations(propDeclarations);
        }
    }, [propDeclarations]);

    const handleDownloadReceipt = (year: number) => {
        if (isAdminView && targetOfficial) {
            alert(`Downloading receipt for ${targetOfficial.name} - ${year}...`);
        } else {
            alert(`Downloading Acknowledgement Receipt for ${year}...`);
        }
    };

    const handleViewDetails = (declaration: Declaration) => {
        if (isAdminView) {
            alert(`Admin view details for: ${declaration.year}\nOfficial: ${targetOfficial?.name}`);
            // For full implementation:
            // window.location.href = `/declaration/view/${declaration.id || declaration.year}?viewAs=admin&officialId=${targetOfficial?.id}`;
        } else {
            alert(`Viewing details for: ${declaration.year}`);
            // window.location.href = `/declaration/view/${declaration.id || declaration.year}`;
        }
    };

    const handleBackToUserManagement = () => {
        // Clear sessionStorage data
        sessionStorage.removeItem('adminViewData');
        // Navigate back
        window.location.href = '/user-management';
    };

    const handleDACheck = (declaration: Declaration) => {
        if (isAdminView && targetOfficial) {
            alert(`DA Analysis for ${targetOfficial.name} - ${declaration.year}\nWould navigate to DA analysis page.`);
            // window.location.href = `/da-analysis?declarationId=${declaration.id || declaration.year}&officialId=${targetOfficial.id}`;
        }
    };

    // Safe status color function
    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        
        if (statusLower.includes('submit') || statusLower.includes('verify') || statusLower.includes('complete')) {
            return 'bg-green-100 text-green-800';
        } else if (statusLower.includes('pending') || statusLower.includes('review')) {
            return 'bg-yellow-100 text-yellow-800';
        } else if (statusLower.includes('reject') || statusLower.includes('incomplete') || statusLower.includes('flag')) {
            return 'bg-red-100 text-red-800';
        } else {
            return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div>
            {/* Admin View Header */}
            {isAdminView && targetOfficial && (
                <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <button 
                                    onClick={handleBackToUserManagement}
                                    className="flex items-center text-blue-700 hover:text-blue-900 font-medium text-sm"
                                >
                                    <span className="mr-1">←</span>
                                    Back to User Management
                                </button>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                                    ADMIN VIEW
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Declaration History: {targetOfficial.name}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Official ID: {targetOfficial.id} • {declarations.length} declarations
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Original Header - Show only if not admin view */}
            {!isAdminView && (
                <>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Declaration History</h1>
                    <p className="text-text-secondary mb-8">A complete record of all your past submissions.</p>
                </>
            )}
            
            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading declaration history...</p>
                    </div>
                ) : declarations.length === 0 ? (
                    <div className="text-center py-12">
                        <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {isAdminView ? 'No declarations found' : 'No declaration history yet'}
                        </h3>
                        <p className="text-gray-600">
                            {isAdminView 
                                ? 'This official has not submitted any declarations.' 
                                : 'Submit your first asset declaration to get started.'}
                        </p>
                    </div>
                ) : (
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
                                    <tr key={declaration.id || declaration.year} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-text-main">{declaration.year}</td>
                                        <td className="py-4 px-4 text-text-main">{declaration.type}</td>
                                        <td className="py-4 px-4 text-text-secondary">{declaration.submissionDate}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${getStatusColor(declaration.status)}`}>
                                                {declaration.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 flex space-x-3">
                                            <button 
                                                onClick={() => handleViewDetails(declaration)}
                                                className="text-blue-600 hover:underline font-medium text-sm"
                                            >
                                                View Details
                                            </button>
                                            <button 
                                                onClick={() => handleDownloadReceipt(declaration.year)}
                                                className="flex items-center text-gray-600 hover:text-primary font-medium text-sm"
                                                title="Download Official Receipt"
                                            >
                                                <DocumentIcon className="w-4 h-4 mr-1" /> Receipt
                                            </button>
                                            {isAdminView && (
                                                <button 
                                                    onClick={() => handleDACheck(declaration)}
                                                    className="text-red-600 hover:underline font-medium text-sm"
                                                >
                                                    DA Check
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Add back button for admin view */}
                {isAdminView && declarations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button 
                            onClick={handleBackToUserManagement}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            ← Back to User Management
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;