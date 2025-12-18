import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import DeclarationRow from '../components/DeclarationRow';
import { Declaration, DeclarationStatus, UserRole } from '../types';
import FileNewPage from './FileNewPage';
import ProfilePage from './ProfilePage';
import HistoryPage from './HistoryPage';
import FaqPage from './FaqPage';
import ResourcesPage from './ResourcesPage';
import PaymentPage from './PaymentPage';
import WhistleblowingPage from './WhistleblowingPage';
import ContactPage from './ContactPage';
import DocumentIcon from '../components/icons/DocumentIcon';
import WarningIcon from '../components/icons/WarningIcon';
import Modal from '../components/Modal';
import ChatBotIcon from '../components/icons/ChatBotIcon';
import SendIcon from '../components/icons/SendIcon';

interface DashboardPageProps {
  onLogout: () => void;
  userRole?: UserRole;
  onSwitchView?: () => void;
}

// Chatbot message type
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Penalty interface
interface Penalty {
  id: string;
  year: string;
  reason: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Waived';
  dueDate: string;
  paymentDate?: string;
}

// Profile Update Modal Component
interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToProfile: () => void;
}

const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({ isOpen, onClose, onGoToProfile }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile Update Required"
    >
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">ⓘ</span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">Profile Update Required</h3>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
          <p className="text-gray-700 mb-2">Please update your profile</p>
          <p className="text-gray-600 text-sm">
            Click on your profile picture at the top right corner and select "Your Profile" 
            from the dropdown menu to review and update your information.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
          >
            Later
          </button>
          <button
            onClick={onGoToProfile}
            className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-sm transition-colors shadow-sm"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Chatbot quick questions
const quickQuestions = [
  "What assets need to be declared?",
  "How to declare rental income?",
  "What documents are needed?",
  "Deadline for submission?",
  "Technical issue with filing?",
  "Penalty calculation rules?"
];

// Chatbot responses (simulated)
const botResponses: Record<string, string> = {
  "What assets need to be declared?": "Under the Asset Declaration Act, you must declare: 1) Immovable property (land, buildings), 2) Movable property (vehicles, jewelry over Nu.500,000), 3) Financial assets (bank accounts, investments over Nu.100,000), 4) Business interests, 5) Liabilities over Nu.100,000.",
  "How to declare rental income?": "Rental income must be declared under 'Income from Property'. Provide: 1) Property address and type, 2) Annual rental amount, 3) Tenant details if applicable, 4) Supporting documents (rent agreement). Go to Income section in the declaration form.",
  "What documents are needed?": "Required documents: 1) CID copy, 2) Land certificate (if applicable), 3) Vehicle registration, 4) Bank statements, 5) Investment certificates, 6) Business registration, 7) Loan agreements. Scan all documents in PDF format.",
  "Deadline for submission?": "Schedule I: Submit by January 31 annually. Schedule II: Submit within 60 days of appointment/joining. Late submissions may incur penalties. Extensions may be granted with prior approval from CADA.",
  "Technical issue with filing?": "For technical issues: 1) Clear browser cache, 2) Use Chrome/Firefox, 3) Ensure PDFs <10MB, 4) Contact helpdesk@cada.gov.bt or call 02-123456. Provide error screenshot if possible.",
  "Penalty calculation rules?": "Penalties: 1) Late submission: Nu. 1,000 per month, 2) Incomplete declaration: Nu. 5,000, 3) False declaration: Nu. 10,000 + disciplinary action, 4) Non-declaration: Nu. 15,000 + possible termination. Max penalty: Nu. 50,000.",
  "default": "I can help with asset declaration rules, filing procedures, document requirements, deadlines, penalties, and technical issues. What specific question do you have?"
};

const mockDeclarations: Declaration[] = [
  { id: 'DEC-001', year: 2023, type: 'Vacation of Office', submissionDate: '2024-03-15', status: DeclarationStatus.APPROVED },
  { id: 'DEC-002', year: 2022, type: 'Annual', submissionDate: '2023-03-01', status: DeclarationStatus.APPROVED },
  { id: 'DEC-003', year: 2021, type: 'Annual', submissionDate: '2022-02-20', status: DeclarationStatus.APPROVED },
  { id: 'DEC-004', year: 2020, type: 'New Entrant', submissionDate: '2021-01-10', status: DeclarationStatus.APPROVED },
];

// Mock penalty data
const mockPenalties: Penalty[] = [
  { id: 'PEN-001', year: '2022', reason: 'Late Submission (2 months)', amount: 2000, status: 'Paid', dueDate: '2022-04-30', paymentDate: '2022-04-15' },
  { id: 'PEN-002', year: '2023', reason: 'Incomplete Declaration', amount: 5000, status: 'Paid', dueDate: '2023-03-31', paymentDate: '2023-03-20' },
  { id: 'PEN-003', year: '2024', reason: 'Late Submission (1 month)', amount: 1000, status: 'Pending', dueDate: '2024-03-31' },
];

// Interface for DashboardContent props
interface DashboardContentProps {
  setActivePage: (page: string) => void;
}

const DashboardContent = ({ setActivePage }: DashboardContentProps) => {
    const isCleared = mockDeclarations[0].type === 'Vacation of Office' && mockDeclarations[0].status === DeclarationStatus.APPROVED;
    
    const [isAmendmentModalOpen, setAmendmentModalOpen] = useState(false);
    const [amendmentReason, setAmendmentReason] = useState('');
    const [targetDeclaration, setTargetDeclaration] = useState<Declaration | null>(null);
    
    // Calculate penalty statistics
    const penaltyStats = {
      totalImposed: mockPenalties.length,
      totalAmount: mockPenalties.reduce((sum, p) => sum + p.amount, 0),
      paidCount: mockPenalties.filter(p => p.status === 'Paid').length,
      paidAmount: mockPenalties.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
      pendingCount: mockPenalties.filter(p => p.status === 'Pending').length,
      pendingAmount: mockPenalties.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0),
    };

    const handleRequestAmendment = (decl: Declaration) => {
        setTargetDeclaration(decl);
        setAmendmentReason('');
        setAmendmentModalOpen(true);
    };

    const submitAmendmentRequest = () => {
        alert(`Amendment Requested for ${targetDeclaration?.year} Declaration.\nReason: ${amendmentReason}\n\nStatus updated to 'Pending Amendment Approval'.`);
        setAmendmentModalOpen(false);
    };

    const handleViewPenalties = () => {
        setActivePage('history');
        // In a real app, you might navigate to a specific penalties section
        alert('Navigating to penalties section in History page');
    };

    const handlePayNow = (penaltyId?: string) => {
        // Store the payment action in sessionStorage
        sessionStorage.setItem('paymentAction', 'make-payment');
        
        // Store penalty ID if provided
        if (penaltyId) {
            sessionStorage.setItem('selectedPenaltyId', penaltyId);
        }
        
        // Set active page to payment
        setActivePage('payment');
    };

    const handleViewPaymentHistory = () => {
        // Store the payment action in sessionStorage
        sessionStorage.setItem('paymentAction', 'payment-history');
        
        // Set active page to payment
        setActivePage('payment');
    };

    return (
      <>
        {/* Amendment Modal */}
        <Modal
            isOpen={isAmendmentModalOpen}
            onClose={() => setAmendmentModalOpen(false)}
            title="Request Amendment"
        >
            <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800">
                    <strong>Note:</strong> Approved declarations are locked. Requesting an amendment requires administrative approval. 
                    Once approved, you will be able to edit your submission.
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Amendment</label>
                    <textarea 
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                        rows={4}
                        placeholder="e.g., Forgot to declare fixed deposit account..."
                        value={amendmentReason}
                        onChange={(e) => setAmendmentReason(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setAmendmentModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">Cancel</button>
                    <button 
                        onClick={submitAmendmentRequest} 
                        disabled={!amendmentReason}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark font-bold text-sm disabled:opacity-50"
                    >
                        Submit Request
                    </button>
                </div>
            </div>
        </Modal>

        <h1 className="text-3xl font-bold text-text-main mb-2">Welcome Back, Kinley!</h1>
        <p className="text-text-secondary mb-8">Here's a summary of your asset declaration status.</p>

        {/* Certificate Banner */}
        {isCleared && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex justify-between items-center shadow-sm">
                <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <DocumentIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-green-900">Asset Declaration Clearance Certificate Available</h3>
                        <p className="text-green-700 text-sm">Your vacation of office declaration has been verified. You can now download your certificate.</p>
                    </div>
                </div>
                <button className="px-6 py-3 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700 transition">
                    Download Certificate
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Next Declaration Due"
            value={isCleared ? "None" : "Feb 28, 2025"}
            subtitle={isCleared ? "Office Vacated" : "Annual Declaration for 2024"}
            variant="primary"
          />
          <DashboardCard
            title="Last Submission"
            value={mockDeclarations[0].submissionDate}
            subtitle={mockDeclarations[0].type}
            variant="success"
          />
          <DashboardCard
            title="Declarations Filed"
            value={mockDeclarations.length.toString()}
            subtitle="Since joining service"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-main mb-4">Compliance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="Late Declarations" value="0" subtitle="0 submission past due" variant="success" />
            <DashboardCard title="Incomplete Declarations" value="0" subtitle="All submissions complete" variant="success" />
            <DashboardCard title="False Declarations" value="0" subtitle="No issues found" variant="success" />
            <DashboardCard title="Non-Declarations" value="0" subtitle="No action required" variant="success" />
          </div>
        </div>

        {/* Penalty Compliance Dashboard Card */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-main">Penalty Compliance</h2>
            {penaltyStats.pendingCount > 0 && (
              <button 
                onClick={handleViewPenalties}
                className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <WarningIcon className="w-4 h-4" />
                View Pending Penalties
              </button>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Penalties Imposed Card */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{penaltyStats.totalImposed}</h3>
                    <p className="text-sm text-gray-600">Penalties Imposed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-700">Nu. {penaltyStats.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Amount</p>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  {penaltyStats.paidCount} paid • {penaltyStats.pendingCount} pending
                </div>
              </div>

              {/* Penalties Paid Card */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{penaltyStats.paidCount}</h3>
                    <p className="text-sm text-gray-600">Penalties Paid</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-700">Nu. {penaltyStats.paidAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Paid</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Good Standing
                  </span>
                </div>
              </div>

              {/* Penalties Pending Card */}
              <div className={`border-l-4 ${penaltyStats.pendingCount > 0 ? 'border-red-500' : 'border-gray-300'} pl-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-lg font-bold ${penaltyStats.pendingCount > 0 ? 'text-red-700' : 'text-gray-900'}`}>
                      {penaltyStats.pendingCount}
                    </h3>
                    <p className="text-sm text-gray-600">Penalties Pending</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${penaltyStats.pendingCount > 0 ? 'text-red-700' : 'text-gray-500'}`}>
                      Nu. {penaltyStats.pendingAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Due Amount</p>
                  </div>
                </div>
                <div className="mt-4">
                  {penaltyStats.pendingCount > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Action Required
                      </span>
                      <button 
                        onClick={() => handlePayNow()}
                        className="text-xs font-medium text-red-600 hover:text-red-800 underline"
                      >
                        Pay Now
                      </button>
                    </div>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      No Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pending Penalties Details */}
            {penaltyStats.pendingCount > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Pending Penalties Details</h4>
                <div className="space-y-3">
                  {mockPenalties
                    .filter(p => p.status === 'Pending')
                    .map(penalty => (
                      <div key={penalty.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{penalty.reason}</p>
                          <p className="text-xs text-gray-600">Due: {penalty.dueDate} • Year: {penalty.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-700">Nu. {penalty.amount.toLocaleString()}</p>
                          <button 
                            onClick={() => handlePayNow(penalty.id)}
                            className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Penalty Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Compliance Status: </span>
                  {penaltyStats.pendingCount === 0 ? (
                    <span className="text-green-600 font-bold">Fully Compliant</span>
                  ) : (
                    <span className="text-red-600 font-bold">Action Required</span>
                  )}
                </div>
                <button 
                  onClick={handleViewPaymentHistory}
                  className="text-sm font-medium text-primary hover:text-primary-dark"
                >
                  View Payment History →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-text-main mb-4">Recent Declarations History</h2>
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
                {mockDeclarations.slice(0, 3).map(declaration => (
                  <tr key={declaration.year} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4 text-text-main">{declaration.year}</td>
                      <td className="py-4 px-4 text-text-main">{declaration.type}</td>
                      <td className="py-4 px-4 text-text-secondary">{declaration.submissionDate}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${
                            declaration.status === DeclarationStatus.APPROVED ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>{declaration.status}</span>
                      </td>
                      <td className="py-4 px-4 flex space-x-3">
                        <button className="text-blue-600 hover:underline font-medium text-sm">View</button>
                        {declaration.status === DeclarationStatus.APPROVED && (
                            <button 
                                onClick={() => handleRequestAmendment(declaration)}
                                className="text-orange-600 hover:underline font-medium text-sm"
                            >
                                Request Amendment
                            </button>
                        )}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <button onClick={() => setActivePage('history')} className="text-sm font-medium text-accent hover:underline">
                View All History &rarr;
              </button>
            </div>
          </div>
        </div>
      </>
    );
};

// Chatbot Component
const AssetDeclarationChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Asset Declaration Assistant. I can help with rules, FAQs, guidelines, penalties, and technical issues. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const responseText = botResponses[messageText] || botResponses.default;
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-primary rounded-full shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center"
      >
        <ChatBotIcon className="w-8 h-8 text-white" />
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl flex flex-col h-[80vh] max-h-[600px]">
            {/* Header */}
            <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <ChatBotIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Asset Declaration Assistant</h3>
                  <p className="text-sm text-primary-light">Online 24/7</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-light' : 'text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Questions */}
              {messages.length <= 2 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 text-center">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs bg-white border border-primary text-primary rounded-full px-3 py-1.5 hover:bg-primary hover:text-white transition"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question about asset declaration..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-primary text-white rounded-full p-3 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                For complex issues, contact <a href="#" className="text-primary hover:underline">helpdesk@cada.gov.bt</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, userRole, onSwitchView }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [profilePicture, setProfilePicture] = useState('https://picsum.photos/100');
  const [isAdminHistoryView, setIsAdminHistoryView] = useState(false);
  const [adminHistoryData, setAdminHistoryData] = useState<{
    officialId: string;
    officialName: string;
    viewerRole: UserRole;
  } | null>(null);
  
  // Profile Update Modal state
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  
  // Check for admin history view on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewAs = params.get('viewAs');
    const officialId = params.get('officialId');
    const section = params.get('section');
    
    if (viewAs === 'admin' && officialId && section === 'history') {
      try {
        const storedData = sessionStorage.getItem('adminViewData');
        if (storedData) {
          const data = JSON.parse(storedData);
          if (data.officialId === officialId) {
            // Set admin history view mode and switch to history page
            setIsAdminHistoryView(true);
            setAdminHistoryData({
              officialId: data.officialId,
              officialName: data.officialName,
              viewerRole: data.viewerRole
            });
            setActivePage('history');
            
            // Clear URL parameters to prevent reload issues
            window.history.replaceState({}, '', '/dashboard');
          }
        }
      } catch (e) {
        console.error('Error reading admin view data:', e);
      }
    }
  }, []);

  // Show profile update modal when dashboard loads (for declarants)
  useEffect(() => {
    // Only show for declarants (not admins) and not in admin history view
    if (userRole !== 'admin' && !isAdminHistoryView && activePage === 'dashboard') {
      // Check if user has recently dismissed the modal
      const hasDismissed = sessionStorage.getItem('profileUpdateModalDismissed');
      const hasClickedGoToProfile = sessionStorage.getItem('profileUpdateClickedGoToProfile');
      
      // Only show if not dismissed in this session and not already clicked "Go to Profile"
      if (!hasDismissed && !hasClickedGoToProfile) {
        // Add a small delay for better UX
        const timer = setTimeout(() => {
          setShowProfileUpdateModal(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [userRole, isAdminHistoryView, activePage]);

  const handleGoToProfile = () => {
    // Mark that user clicked "Go to Profile" to prevent showing again
    sessionStorage.setItem('profileUpdateClickedGoToProfile', 'true');
    setShowProfileUpdateModal(false);
    setActivePage('profile');
  };

  const handleCloseProfileModal = () => {
    // Mark as dismissed for this session
    sessionStorage.setItem('profileUpdateModalDismissed', 'true');
    setShowProfileUpdateModal(false);
  };

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard': 
        return <DashboardContent setActivePage={setActivePage} />;
      case 'filenew': return <FileNewPage />;
      case 'history': 
        if (isAdminHistoryView && adminHistoryData) {
          const adminDeclarations: Declaration[] = [
            { 
              id: `DEC-${adminHistoryData.officialId}-2024`, 
              year: 2024, 
              type: 'Annual', 
              submissionDate: '2024-01-15', 
              status: DeclarationStatus.APPROVED 
            },
            { 
              id: `DEC-${adminHistoryData.officialId}-2023`, 
              year: 2023, 
              type: 'Annual', 
              submissionDate: '2023-01-10', 
              status: DeclarationStatus.APPROVED 
            },
            { 
              id: `DEC-${adminHistoryData.officialId}-2022`, 
              year: 2022, 
              type: 'Annual', 
              submissionDate: '2022-01-12', 
              status: DeclarationStatus.APPROVED 
            },
          ];
          
          return (
            <div>
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <button 
                        onClick={() => {
                          setIsAdminHistoryView(false);
                          setAdminHistoryData(null);
                          setActivePage('dashboard');
                        }}
                        className="flex items-center text-blue-700 hover:text-blue-900 font-medium text-sm"
                      >
                        <span className="mr-1">←</span>
                        Back to Dashboard
                      </button>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                        ADMIN VIEW
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Declaration History: {adminHistoryData.officialName}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Official ID: {adminHistoryData.officialId} • {adminDeclarations.length} declarations
                    </p>
                  </div>
                </div>
              </div>
              
              <HistoryPage declarations={adminDeclarations} />
            </div>
          );
        }
        return <HistoryPage declarations={mockDeclarations} />;
      case 'profile': return <ProfilePage profilePicture={profilePicture} setProfilePicture={setProfilePicture} />;
      case 'faq': return <FaqPage />;
      case 'resources': return <ResourcesPage />;
      case 'payment': return <PaymentPage />;
      case 'whistleblowing': return <WhistleblowingPage />;
      case 'contact': return <ContactPage />;
      default: 
        return <DashboardContent setActivePage={setActivePage} />;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <Header 
        onLogout={onLogout} 
        activePage={activePage} 
        setActivePage={setActivePage} 
        profilePicture={profilePicture}
        userRole={userRole}
        onSwitchView={onSwitchView}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="container mx-auto">
          {renderContent()}
        </div>
      </main>
      
      {/* Profile Update Modal - Only show for declarants */}
      {userRole !== 'admin' && !isAdminHistoryView && (
        <ProfileUpdateModal
          isOpen={showProfileUpdateModal}
          onClose={handleCloseProfileModal}
          onGoToProfile={handleGoToProfile}
        />
      )}
      
      {/* Chatbot - Only show for declarants (not for admin view) */}
      {userRole !== 'admin' && !isAdminHistoryView && (
        <AssetDeclarationChatbot />
      )}
    </div>
  );
};

export default DashboardPage;

