import React, { useState } from 'react';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
const faqData = [
{
question: 'Who is required to file an asset declaration?',
answer: 'All public officials, their spouses, and dependent children are required to file an annual asset declaration as per the Anti-Corruption Act of Bhutan.'
},
{
question: 'What is the deadline for the annual declaration?',
answer: 'The deadline for the annual asset declaration is February 28th of each year for the preceding calendar year.'
},
{
question: 'What happens if I miss the deadline?',
answer: 'Failing to declare within the stipulated time without a valid reason can result in penalties, including fines calculated on a daily basis and other administrative actions.'
},
{
question: 'How do I value my assets?',
answer: 'Assets should be valued at their acquisition cost. If the acquisition cost is not known, the prevailing market value at the time of declaration should be used. For inherited property, the value assessed by a competent authority should be provided.'
},
{
question: 'Do I need to declare assets that are jointly owned?',
answer: 'Yes, any asset or liability that is jointly owned with another person must be declared, specifying the extent of your share.'
},
];
interface AccordionItemProps {
question: string;
answer: string;
}
const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
const [isOpen, setIsOpen] = useState(false);
code
Code
return (
    <div className="border-b border-gray-200 py-4">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center text-left"
        >
            <h3 className="text-lg font-medium text-text-main">{question}</h3>
            <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div
            className={`grid transition-all duration-500 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
        >
            <div className="overflow-hidden">
                <p className="pt-4 text-text-secondary">
                    {answer}
                </p>
            </div>
        </div>
    </div>
);
};
const FaqPage = () => {
return (
<div>
<h1 className="text-3xl font-bold text-text-main mb-2">Frequently Asked Questions</h1>
<p className="text-text-secondary mb-8">Find quick answers to common queries about the asset declaration process.</p>
code
Code
<div className="bg-white rounded-lg shadow-md p-6">
            {faqData.map((faq) => (
                <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
        </div>
    </div>
);
};
export default FaqPage;