import React from 'react';
const PaymentPage = () => {
return (
<div>
<h1 className="text-3xl font-bold text-text-main mb-2">Make a Payment</h1>
<p className="text-text-secondary mb-8">Settle any outstanding penalties related to your declarations.</p>
code
Code
<div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <form>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="penalty" className="block text-sm font-medium text-text-secondary mb-1">
                            Select Penalty to Pay
                        </label>
                        <select
                            id="penalty"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                        >
                            <option>No outstanding penalties</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">
                            Amount (Nu.)
                        </label>
                        <input
                            type="text"
                            id="amount"
                            value="0.00"
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Choose Payment Method
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-accent">
                                <input type="radio" name="paymentMethod" className="h-4 w-4 text-primary focus:ring-accent" defaultChecked />
                                <span className="ml-3 text-text-main font-medium">Bank Transfer</span>
                            </label>
                            <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:border-accent">
                                <input type="radio" name="paymentMethod" className="h-4 w-4 text-primary focus:ring-accent" />
                                <span className="ml-3 text-text-main font-medium">Credit/Debit Card</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
);
};
export default PaymentPage;