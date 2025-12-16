import React, { useState } from 'react';
import BanknotesIcon from '../components/icons/BanknotesIcon';

interface Penalty {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  referenceNumber: string;
  type: 'Late Filing' | 'Non-Filing' | 'Incomplete Filing';
}

const PaymentPage: () => React.JSX.Element = () => {
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
      type: 'Late Filing'
    },
    {
      id: 'PEN-2024-002',
      description: 'Non-filing penalty for 2022 Annual Declaration',
      amount: 45625,
      dueDate: '2024-05-15',
      status: 'overdue',
      referenceNumber: 'PEN-2024-002',
      type: 'Non-Filing'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [birmsReference, setBirmsReference] = useState('');

  // Calculate totals
  const totalPending = penalties
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const selectedPenaltyData = penalties.find(p => p.id === selectedPenalty);

  // Generate BIRMS reference number
  const generateBirmsReference = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    return `BIRMS-${timestamp}`;
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
        setPenalties(prev => prev.map(p => 
          p.id === selectedPenaltyData.id ? { ...p, status: 'paid' } : p
        ));
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
  const getStatusBadge = (status: Penalty['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status]}`}>
        {labels[status]}
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <BanknotesIcon className="text-primary w-8 h-8 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-text-main">Make a Payment</h1>
          <p className="text-text-secondary">Settle any outstanding penalties related to your declarations.</p>
        </div>
      </div>

      {/* Payment Status Banner */}
      {paymentStatus === 'completed' && (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Penalty Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-text-main mb-4">Outstanding Penalties</h2>
            
            {penalties.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-text-main font-medium">No outstanding penalties</p>
                <p className="text-text-secondary text-sm mt-1">All your dues are cleared.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {penalties.map(penalty => (
                  <div 
                    key={penalty.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPenalty === penalty.id 
                        ? 'border-primary bg-blue-50' 
                        : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPenalty(penalty.id)}
                  >
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
                  </div>
                ))}
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
    </div>
  );
};

export default PaymentPage;