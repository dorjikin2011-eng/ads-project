import React from 'react';
const ContactPage = () => {
return (
<div>
<h1 className="text-3xl font-bold text-text-main mb-2">Get in Touch</h1>
<p className="text-text-secondary mb-8">We're here to help. Contact us for any support or inquiries.</p>
code
Code
<div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left side: Info & Map */}
                <div className="p-8 bg-gray-50">
                    <h2 className="text-xl font-semibold text-text-main mb-6">Contact Information</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-text-main">Address</h3>
                            <p className="text-text-secondary mt-1">
                                Anti-Corruption Commission of Bhutan<br/>
                                Lhadro Lam, P.O. Box 1113<br/>
                                Thimphu, Bhutan
                            </p>
                        </div>
                         <div>
                            <h3 className="font-semibold text-text-main">Phone</h3>
                            <p className="text-text-secondary mt-1">+975-2-337423</p>
                            <p className="text-text-secondary">+975-2-334863</p>
                        </div>
                         <div>
                            <h3 className="font-semibold text-text-main">Email</h3>
                            <p className="text-text-secondary mt-1">contact@acc.org.bt</p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-lg overflow-hidden border border-gray-200">
                         <img 
                            src="https://www.acc.org.bt/wp-content/uploads/2021/08/ACC-Location.png" 
                            alt="Location map of ACC Bhutan"
                            className="w-full h-64 object-cover" 
                        />
                    </div>
                </div>

                {/* Right side: Contact Form */}
                <div className="p-8">
                     <h2 className="text-xl font-semibold text-text-main mb-6">Send us a Message</h2>
                     <form>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Your full name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject-contact" className="block text-sm font-medium text-text-secondary mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject-contact"
                                    placeholder="What is your message about?"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition"
                                ></textarea>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
);
};
export default ContactPage;