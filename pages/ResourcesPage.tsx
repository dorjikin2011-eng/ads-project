import React from 'react';
import DocumentIcon from '../components/icons/DocumentIcon';
const resources = {
manuals: [
{ title: 'ADS User Manual for Public Officials', link: '#' },
{ title: 'Guide to Filling the Declaration Form', link: '#' },
],
rules: [
{ title: 'Asset Declaration Rules 2022', link: '#' },
{ title: 'Anti-Corruption Act of Bhutan 2011', link: '#' },
]
}
interface ResourceCardProps {
title: string;
// FIX: Added children to props to allow nesting content inside ResourceCard.
children: React.ReactNode;
}
const ResourceCard: React.FC<ResourceCardProps> = ({ title, children }) => (
<div className="bg-white rounded-lg shadow-md p-6">
<h2 className="text-xl font-semibold text-text-main mb-4">{title}</h2>
<div className="space-y-3">
{children}
</div>
</div>
);
interface ResourceLinkProps {
title: string;
link: string;
}
const ResourceLink: React.FC<ResourceLinkProps> = ({ title, link }) => (
<a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">
<DocumentIcon className="w-5 h-5 text-primary mr-3" />
<span className="text-text-main font-medium">{title}</span>
</a>
);
const ResourcesPage = () => {
return (
<div>
<h1 className="text-3xl font-bold text-text-main mb-2">Resources</h1>
<p className="text-text-secondary mb-8">Access user guides, manuals, and relevant legal documents.</p>
code
Code
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResourceCard title="Guides & Manuals">
                {resources.manuals.map(item => <ResourceLink key={item.title} title={item.title} link={item.link} />)}
            </ResourceCard>
            <ResourceCard title="Acts & Rules">
                {resources.rules.map(item => <ResourceLink key={item.title} title={item.title} link={item.link} />)}
            </ResourceCard>
        </div>
    </div>
);
};
export default ResourcesPage;