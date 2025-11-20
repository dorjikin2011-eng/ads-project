import React from 'react';
const WhistleblowingPage = () => {
return (
<div>
<h1 className="text-3xl font-bold text-text-main mb-2">Whistleblowing</h1>
<p className="text-text-secondary mb-8">Report any integrity concerns or acts of corruption confidentially.</p>
code
Code
<div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-accent p-4 mb-8 rounded-r-lg">
                <h3 className="font-bold text-accent">Your report is confidential</h3>
                <p className="text-sm text-text-secondary mt-1">
                    The Anti-Corruption Commission is committed to protecting the identity of whistleblowers. 
                    You can choose to remain anonymous. All information provided will be treated with the utmost confidentiality.
                </p>
            </div>

            <form>
                <div className="space-y-6">
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-1">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            placeholder="Briefly describe the nature of the issue"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-text-secondary mb-1">
                            Details of the Report
                        </label>
                        <textarea
                            id="details"
                            rows={8}
                            placeholder="Please provide as much detail as possible, including names, dates, places, and any evidence you may have."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                        ></textarea>
                    </div>
                     <div>
                        <label htmlFor="attachment" className="block text-sm font-medium text-text-secondary mb-1">
                            Attach Evidence (Optional)
                        </label>
                        <input
                            type="file"
                            id="attachment"
                            className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
                        >
                            Submit Report Confidentially
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
);
};
export default WhistleblowingPage;