import React, { useState, useEffect } from 'react';
import BanknotesIcon from '../components/icons/BanknotesIcon';

interface Penalty {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  referenceNumber: string;
  type: 'Late Filing' | 'Non-Filing' | 'Incomplete Filing';
  paymentDate?: string;
  transactionId?: string;
  paymentMethod?: string;
  daysOverdue?: number; // Added for calculation details
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  penaltyId: string;
  description: string;
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  paymentMethod: string;
  referenceNumber: string;
}

const PaymentPage: React.FC = () => {
  // Read the payment action from sessionStorage to determine active tab
  const [activeTab, setActiveTab] = useState<'make-payment' | 'payment-history'>('make-payment');
  const [selectedPenalty, setSelectedPenalty] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'birms'>('birms');
  const [penalties, setPenalties] = useState<Penalty[]>([
    {
      id: 'PEN-2024-001',
      description: 'Late filing penalty for 2023 Annual Declaration',
      amount: 1875,
      dueDate: '2024-06-30',
      status: 'pending',
      referenceNumber: 'PEN-2024-001',
      type: 'Late Filing',
      daysOverdue: 15 // 15 × 125 = 1875
    },
    {
      id: 'PEN-2024-002',
      description: 'Non-filing penalty for 2022 Annual Declaration',
      amount: 45625,
      dueDate: '2024-05-15',
      status: 'overdue',
      referenceNumber: 'PEN-2024-002',
      type: 'Non-Filing',
      // daysOverdue not needed for non-filing (fixed 365 days)
    },
    {
      id: 'PEN-2023-001',
      description: 'Late filing penalty for 2022 Annual Declaration',
      amount: 3000,
      dueDate: '2023-12-31',
      status: 'paid',
      referenceNumber: 'PEN-2023-001',
      type: 'Late Filing',
      daysOverdue: 24, // 24 × 125 = 3000
      paymentDate: '2023-12-15',
      transactionId: 'TX-2023-001',
      paymentMethod: 'BIRMS'
    }
  ]);

  // Payment history data
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: 'PAY-001',
      date: '2023-12-15',
      amount: 3000,
      penaltyId: 'PEN-2023-001',
      description: 'Late filing penalty for 2022 Annual Declaration',
      transactionId: 'TX-2023-001',
      status: 'success',
      paymentMethod: 'BIRMS Online',
      referenceNumber: 'REF-2023-001'
    },
    {
      id: 'PAY-002',
      date: '2022-11-20',
      amount: 5000,
      penaltyId: 'PEN-2022-001',
      description: 'Non-filing penalty for 2021 Annual Declaration',
      transactionId: 'TX-2022-001',
      status: 'success',
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'REF-2022-001'
    },
    {
      id: 'PAY-003',
      date: '2024-01-10',
      amount: 1875,
      penaltyId: 'PEN-2024-001',
      description: 'Late filing penalty for 2023 Annual Declaration',
      transactionId: 'TX-2024-001',
      status: 'pending',
      paymentMethod: 'BIRMS Online',
      referenceNumber: 'REF-2024-001'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [birmsReference, setBirmsReference] = useState('');

  // Read tab preference from sessionStorage on component mount
  useEffect(() => {
    const paymentAction = sessionStorage.getItem('paymentAction');
    
    if (paymentAction === 'make-payment' || paymentAction === 'payment-history') {
      setActiveTab(paymentAction as 'make-payment' | 'payment-history');
      // Clear the stored action after reading
      sessionStorage.removeItem('paymentAction');
    }
    
    // Read selected penalty ID if provided
    const selectedPenaltyId = sessionStorage.getItem('selectedPenaltyId');
    if (selectedPenaltyId) {
      setSelectedPenalty(selectedPenaltyId);
      sessionStorage.removeItem('selectedPenaltyId');
    }
  }, []);

  // Calculate totals
  const totalPending = penalties
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const selectedPenaltyData = penalties.find(p => p.id === selectedPenalty);

  // Calculate payment history totals
  const totalPaid = paymentHistory
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = paymentHistory.filter(p => p.status === 'pending');

  // Generate BIRMS reference number
  const generateBirmsReference = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    return `BIRMS-${timestamp}`;
  };

  // Penalty Calculation Logic - Show how amount was arrived at
  const getPenaltyCalculationDetails = (penalty: Penalty) => {
    const wage = 125; // Daily wage rate
    
    if (penalty.type === 'Late Filing') {
      // For Late Filing, calculate based on days overdue
      const daysOverdue = penalty.daysOverdue || Math.round(penalty.amount / wage);
      return {
        title: 'Late Filing Penalty Calculation',
        description: 'You missed the May 31st deadline for annual declaration.',
        formula: `${daysOverdue} days overdue × Nu. ${wage} (daily wage rate)`,
        calculation: `${daysOverdue} × ${wage} = Nu. ${penalty.amount}`,
        details: [
          `Deadline: May 31st`,
          `Days overdue: ${daysOverdue} days`,
          `Daily wage rate: Nu. ${wage}`,
          `Total penalty: Nu. ${penalty.amount}`
        ]
      };
    } 
    
    if (penalty.type === 'Non-Filing') {
      return {
        title: 'Non-Filing Penalty Calculation',
        description: 'You did not file your declaration by June 30th, which is considered non-declaration.',
        formula: `365 days × Nu. ${wage} (full year penalty)`,
        calculation: `365 × ${wage} = Nu. ${penalty.amount}`,
        details: [
          `Initial deadline: May 31st`,
          `Non-filing threshold: June 30th`,
          `Full year penalty: 365 days`,
          `Daily wage rate: Nu. ${wage}`,
          `Total penalty: Nu. ${penalty.amount}`
        ]
      };
    }
    
    if (penalty.type === 'Incomplete Filing') {
      return {
        title: 'Incomplete Filing Penalty Calculation',
        description: 'Your declaration submission was incomplete or had errors.',
        formula: `30 days × Nu. ${wage} (standard penalty)`,
        calculation: `30 × ${wage} = Nu. ${penalty.amount}`,
        details: [
          `Standard penalty: 30 days`,
          `Daily wage rate: Nu. ${wage}`,
          `Total penalty: Nu. ${penalty.amount}`
        ]
      };
    }
    
    return {
      title: 'Penalty Calculation',
      description: 'Administrative penalty for non-compliance.',
      formula: 'Fixed penalty amount',
      calculation: `Nu. ${penalty.amount}`,
      details: [`Total penalty: Nu. ${penalty.amount}`]
    };
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPenaltyData && totalPending > 0) {
      alert('Please select a penalty to pay');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    // Simulate API call delay
    setTimeout(() => {
      const reference = generateBirmsReference();
      setBirmsReference(reference);
      
      // Open BIRMS payment page in new tab
      const birmsUrl = 'https://birms.drc.gov.bt/payment-advice/receipt/payment';
      const paymentData = {
        amount: selectedPenaltyData?.amount || totalPending,
        reference: reference,
        description: selectedPenaltyData?.description || 'Asset Declaration Penalty',
        payerId: 'USER_ID_HERE', // Replace with actual user ID
        payerName: 'USER_NAME_HERE', // Replace with actual user name
        serviceCode: 'ADC-FINE', // Asset Declaration Commission Fine
      };

      // Create form for BIRMS submission
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = birmsUrl;
      form.target = '_blank';
      
      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setPaymentStatus('completed');
      setIsLoading(false);

      // Update local penalty status after successful payment
      if (selectedPenaltyData) {
        const updatedPenalties = penalties.map(p => 
          p.id === selectedPenaltyData.id ? { 
            ...p, 
            status: 'paid' as const,
            paymentDate: new Date().toISOString().split('T')[0],
            transactionId: reference,
            paymentMethod: 'BIRMS'
          } : p
        );
        setPenalties(updatedPenalties);

        // Add to payment history
        const newPayment: PaymentHistory = {
          id: `PAY-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: selectedPenaltyData.amount,
          penaltyId: selectedPenaltyData.id,
          description: selectedPenaltyData.description,
          transactionId: reference,
          status: 'pending', // Will be confirmed after BIRMS verification
          paymentMethod: 'BIRMS Online',
          referenceNumber: reference
        };
        setPaymentHistory(prev => [newPayment, ...prev]);
      }
    }, 2000);
  };

  // Handle BIRMS redirect with payment verification
  const handleBirmsRedirect = () => {
    window.open('https://birms.drc.gov.bt/payment-advice/receipt/payment', '_blank');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `Nu. ${amount.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    const labels: Record<string, string> = {
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      success: 'Successful',
      failed: 'Failed'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Inline SVG Icons
  const ExternalLinkIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );

  const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const InfoIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const HistoryIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const DownloadIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const CalculatorIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  // Render Make Payment Tab
  const renderMakePaymentTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Penalty Summary */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-text-main mb-4">Outstanding Penalties</h2>
          
          {penalties.filter(p => p.status === 'pending' || p.status === 'overdue').length === 0 ? (
            <div className="text-center py-8">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-text-main font-medium">No outstanding penalties</p>
              <p className="text-text-secondary text-sm mt-1">All your dues are cleared.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {penalties
                .filter(p => p.status === 'pending' || p.status === 'overdue')
                .map(penalty => {
                  const calculationDetails = getPenaltyCalculationDetails(penalty);
                  return (
                    <div 
                      key={penalty.id}
                      className={`border rounded-lg cursor-pointer transition-all ${
                        selectedPenalty === penalty.id 
                          ? 'border-primary bg-blue-50' 
                          : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPenalty(penalty.id)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-text-main">{penalty.description}</h3>
                            <div className="flex items-center gap-3 mt-2">
                              {getStatusBadge(penalty.status)}
                              <span className="text-sm text-text-secondary">
                                Due: {formatDate(penalty.dueDate)}
                              </span>
                              <span className="text-sm text-text-secondary">
                                Ref: {penalty.referenceNumber}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-text-main">
                              {formatCurrency(penalty.amount)}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                              {penalty.type}
                            </div>
                          </div>
                        </div>
                        
                        {/* Penalty Calculation Details (shown when selected) */}
                        {selectedPenalty === penalty.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-start">
                              <CalculatorIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-medium text-blue-800 text-sm mb-1">
                                  {calculationDetails.title}
                                </h4>
                                <p className="text-blue-700 text-xs mb-2">
                                  {calculationDetails.description}
                                </p>
                                <div className="bg-white p-3 rounded border border-blue-100">
                                  <div className="font-mono text-blue-900 text-sm">
                                    {calculationDetails.formula}
                                  </div>
                                  <div className="font-bold text-blue-900 text-lg mt-2">
                                    = {calculationDetails.calculation}
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-blue-700">
                                  <p className="font-medium mb-1">Calculation breakdown:</p>
                                  <ul className="list-disc list-inside space-y-1">
                                    {calculationDetails.details.map((detail, index) => (
                                      <li key={index}>{detail}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Total Summary */}
          {totalPending > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-text-secondary">Total Outstanding</p>
                  <p className="text-xs text-text-secondary">
                    {penalties.filter(p => p.status === 'pending' || p.status === 'overdue').length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-text-main">
                    {formatCurrency(totalPending)}
                  </p>
                  <button
                    onClick={() => {
                      // Select all pending penalties
                      const pendingIds = penalties
                        .filter(p => p.status === 'pending' || p.status === 'overdue')
                        .map(p => p.id);
                      if (pendingIds.length > 0) {
                        setSelectedPenalty(pendingIds[0]);
                      }
                    }}
                    className="text-sm text-primary hover:underline mt-1"
                  >
                    Pay All Outstanding
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BIRMS Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <InfoIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-800">About BIRMS Payment</h3>
              <p className="text-blue-700 text-sm mt-1">
                Bhutan Integrated Revenue Management System (BIRMS) is the official government 
                payment gateway. You will be redirected to BIRMS to complete your payment securely.
              </p>
              <p className="text-blue-700 text-sm mt-2">
                <strong>Payment Methods Available:</strong> Bank Transfer, Credit/Debit Cards, 
                Mobile Banking (if enabled).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Payment Form */}
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-xl font-bold text-text-main mb-4">Payment Details</h2>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-6">
              {/* Selected Penalty */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Selected Penalty
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                  {selectedPenaltyData ? (
                    <div>
                      <p className="font-medium text-text-main">{selectedPenaltyData.description}</p>
                      <p className="text-sm text-text-secondary mt-1">
                        Amount: <span className="font-bold">{formatCurrency(selectedPenaltyData.amount)}</span>
                      </p>
                    </div>
                  ) : totalPending > 0 ? (
                    <p className="text-text-secondary">Select a penalty from the list</p>
                  ) : (
                    <p className="text-text-secondary">No penalties to pay</p>
                  )}
                </div>
              </div>

              {/* Penalty Calculation Details */}
              {selectedPenaltyData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CalculatorIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-800 text-sm">
                        Penalty Calculation
                      </h4>
                      <div className="mt-2 bg-white p-3 rounded border border-blue-100">
                        <div className="font-mono text-blue-900 text-sm text-center">
                          {getPenaltyCalculationDetails(selectedPenaltyData).formula}
                        </div>
                        <div className="font-bold text-blue-900 text-lg text-center mt-2">
                          = {getPenaltyCalculationDetails(selectedPenaltyData).calculation}
                        </div>
                      </div>
                      <p className="text-blue-700 text-xs mt-2">
                        {getPenaltyCalculationDetails(selectedPenaltyData).description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Amount Due (Nu.)
                </label>
                <input
                  type="text"
                  value={selectedPenaltyData ? formatCurrency(selectedPenaltyData.amount) : formatCurrency(totalPending)}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 font-bold text-lg text-center"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${
                    paymentMethod === 'birms' 
                      ? 'border-primary bg-blue-50' 
                      : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      className="h-4 w-4 text-primary focus:ring-primary" 
                      checked={paymentMethod === 'birms'}
                      onChange={() => setPaymentMethod('birms')}
                    />
                    <div className="ml-3">
                      <span className="text-text-main font-medium">BIRMS Online Payment</span>
                      <p className="text-xs text-text-secondary mt-1">
                        Secure government payment gateway
                      </p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${
                    paymentMethod === 'bank' 
                      ? 'border-primary bg-blue-50' 
                      : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      className="h-4 w-4 text-primary focus:ring-primary" 
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                    />
                    <div className="ml-3">
                      <span className="text-text-main font-medium">Bank Transfer</span>
                      <p className="text-xs text-text-secondary mt-1">
                        Manual bank transfer (requires verification)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || (totalPending === 0 && !selectedPenaltyData)}
                  className={`w-full py-3 px-4 rounded-md font-bold transition duration-300 flex items-center justify-center ${
                    isLoading || (totalPending === 0 && !selectedPenaltyData)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ExternalLinkIcon className="w-5 h-5 mr-2" />
                      Proceed to BIRMS Payment
                    </>
                  )}
                </button>
                
                {paymentMethod === 'bank' && (
                  <p className="text-xs text-text-secondary text-center mt-2">
                    For bank transfer, contact your agency administrator
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Direct BIRMS Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-text-secondary mb-2">Need to check payment status?</p>
            <button
              type="button"
              onClick={handleBirmsRedirect}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-text-main hover:bg-gray-50 transition flex items-center justify-center"
            >
              <ExternalLinkIcon className="w-4 h-4 mr-2" />
              Visit BIRMS Portal Directly
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Payment History Tab
  const renderPaymentHistoryTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-main">Payment History</h2>
          <p className="text-text-secondary">Record of all your penalty payments</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-text-secondary">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">Total Payments</p>
          <p className="text-2xl font-bold text-blue-900">{paymentHistory.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">Successful Payments</p>
          <p className="text-2xl font-bold text-green-900">
            {paymentHistory.filter(p => p.status === 'success').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">Pending Verification</p>
          <p className="text-2xl font-bold text-yellow-900">{pendingPayments.length}</p>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">Date</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">Description</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">Transaction ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">Amount</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">Method</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-text-secondary">
                  No payment history available
                </td>
              </tr>
            ) : (
              paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-text-main">{formatDate(payment.date)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-text-main">{payment.description}</div>
                    <div className="text-xs text-text-secondary">Ref: {payment.referenceNumber}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-mono text-sm text-text-main">{payment.transactionId}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-text-main">{formatCurrency(payment.amount)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-text-main">{payment.paymentMethod}</div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary-dark text-sm font-medium">
                        View Receipt
                      </button>
                      {payment.status === 'pending' && (
                        <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                          Check Status
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Paid Penalties */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-text-main mb-4">Recently Paid Penalties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {penalties
            .filter(p => p.status === 'paid')
            .slice(0, 4)
            .map(penalty => {
              const calculationDetails = getPenaltyCalculationDetails(penalty);
              return (
                <div key={penalty.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-text-main">{penalty.type}</h4>
                      <p className="text-sm text-text-secondary mt-1">{penalty.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Paid
                        </span>
                        <span className="text-xs text-text-secondary">
                          {penalty.paymentDate && formatDate(penalty.paymentDate)}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Calculation: </span>
                        {calculationDetails.formula}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-main">{formatCurrency(penalty.amount)}</div>
                      <div className="text-xs text-text-secondary mt-1">
                        {penalty.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <BanknotesIcon className="text-primary w-8 h-8 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-text-main">Payment Management</h1>
          <p className="text-text-secondary">Settle and track penalty payments</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('make-payment')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'make-payment'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            <div className="flex items-center">
              <ExternalLinkIcon className="w-4 h-4 mr-2" />
              Make Payment
            </div>
          </button>
          <button
            onClick={() => setActiveTab('payment-history')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'payment-history'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-main'
            }`}
          >
            <div className="flex items-center">
              <HistoryIcon className="w-4 h-4 mr-2" />
              Payment History
            </div>
          </button>
        </div>
      </div>

      {/* Payment Status Banner */}
      {paymentStatus === 'completed' && activeTab === 'make-payment' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h3 className="font-bold text-green-800">Payment Initiated Successfully!</h3>
              <p className="text-green-700 text-sm">
                Reference: <span className="font-mono font-bold">{birmsReference}</span>
              </p>
              <p className="text-green-700 text-sm mt-1">
                You have been redirected to BIRMS payment portal. Please complete the payment there.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'make-payment' ? renderMakePaymentTab() : renderPaymentHistoryTab()}
    </div>
  );
};

export default PaymentPage;