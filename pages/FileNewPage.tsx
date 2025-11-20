import React, { useState, useRef } from 'react';
import ProgressBar from '../components/ProgressBar';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';
import PaperClipIcon from '../components/icons/PaperClipIcon';
import Modal from '../components/Modal';
// --- Type Definitions ---
interface DocumentFile extends File {
id: string;
}
interface Asset {
id: string;
type: string;
description: string;
value: string;
// New detailed fields
dateOfAcquisition: string;
acquiredFrom: string;
sourceOfFunding: string;
// Type-specific fields
location?: string;
plotNo?: string;
make?: string;
model?: string;
registrationNo?: string;
bankName?: string;
accountNo?: string;
// Documents
documents: DocumentFile[];
}
interface Liability {
id: string;
type: string;
institution: string;
amount: string;
dateOfLiability: string;
purpose: string;
documents: DocumentFile[];
}
interface Income {
id: string;
source: string;
amount: string;
date: string;
documents: DocumentFile[];
}
interface Expenditure {
id: string;
description: string;
amount: string;
date: string;
documents: DocumentFile[];
}
interface AdditionalPost {
id: string;
organisation: string;
position: string;
details: string;
documents: DocumentFile[];
}
interface PostEmployment {
id: string;
organisation: string;
details: string;
startDate: string;
documents: DocumentFile[];
}
type FormErrors = { [key: string]: { [key: string]: string } };
// --- Reusable Components ---
const FormInput = ({ label, id, error, ...props }: any) => (
<div>
<label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
<input id={id} {...props} className={mt-1 w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-transparent transition ${error ? 'border-red-500' : 'border-gray-300'}} />
{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
</div>
);
const FormSelect = ({ label, id, error, children, ...props }: any) => (
<div>
<label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
<select id={id} {...props} className={mt-1 w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-transparent transition ${error ? 'border-red-500' : 'border-gray-300'}}>
{children}
</select>
{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
</div>
);
const FileUpload = ({ documents, onFileChange, onFileRemove }: { documents: DocumentFile[], onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onFileRemove: (fileId: string) => void }) => {
const fileInputRef = useRef<HTMLInputElement>(null);
return (
<div className="md:col-span-12 mt-2">
<button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 text-xs font-medium text-accent hover:text-primary">
<PaperClipIcon />
<span>Attach Supporting Documents</span>
</button>
<input type="file" multiple ref={fileInputRef} onChange={onFileChange} className="hidden" />
<div className="mt-2 space-y-1">
{documents.map(file => (
<div key={file.id} className="flex items-center justify-between text-xs bg-gray-100 p-1.5 rounded">
<span className="text-text-secondary">{file.name}</span>
<button type="button" onClick={() => onFileRemove(file.id)} className="text-red-500 hover:text-red-700">
<TrashIcon className="w-4 h-4" />
</button>
</div>
))}
</div>
</div>
);
};
// --- Step Components ---
const InstructionsStep = () => (
<div>
<h2 className="text-xl font-semibold text-text-main mb-4">Instructions for Filing</h2>
<div className="space-y-3 text-text-secondary">
<p>Welcome to the Asset Declaration System. Please read the following instructions carefully before proceeding.</p>
<ul className="list-disc list-inside space-y-2 pl-4">
<li>Ensure all information provided is accurate and complete to the best of your knowledge.</li>
<li>You must declare all assets and liabilities for yourself, your spouse, and your dependent children.</li>
<li>Values should be reported in Bhutanese Ngultrum (Nu.).</li>
<li>Upload supporting documents where necessary (e.g., sale deeds, loan agreements).</li>
<li>Refer to the 'Resources' page for detailed guides and legal acts if you have any questions.</li>
</ul>
<p className="font-semibold text-text-main pt-2">Filing false or incomplete information is an offense and may lead to penalties.</p>
</div>
</div>
);
const PersonalInfoStep = () => (
<div>
<h2 className="text-xl font-semibold text-text-main mb-4">Confirm Personal Information</h2>
<p className="text-text-secondary mb-6">This information is pre-filled from your profile. Please ensure it is correct before proceeding.</p>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg border">
<div>
<label className="block text-sm font-medium text-text-secondary">Full Name</label>
<p className="mt-1 text-text-main font-medium">Kinley Wangchuk</p>
</div>
<div>
<label className="block text-sm font-medium text-text-secondary">Official ID</label>
<p className="mt-1 text-text-main font-medium">12345</p>
</div>
</div>
</div>
);
const AssetsStep = ({ data, onAdd, onRemove, onChange, onFileChange, onFileRemove, errors }: any) => {
const renderAssetFields = (asset: Asset) => {
switch (asset.type) {
case 'Land':
return <>
<FormInput label="Location" value={asset.location} onChange={(e: any) => onChange(asset.id, 'location', e.target.value)} placeholder="e.g., Thimphu" />
<FormInput label="Plot No." value={asset.plotNo} onChange={(e: any) => onChange(asset.id, 'plotNo', e.target.value)} placeholder="e.g., TH-1-1234" />
</>;
case 'Vehicle':
return <>
<FormInput label="Make" value={asset.make} onChange={(e: any) => onChange(asset.id, 'make', e.target.value)} placeholder="e.g., Toyota" />
<FormInput label="Model" value={asset.model} onChange={(e: any) => onChange(asset.id, 'model', e.target.value)} placeholder="e.g., Hilux" />
<FormInput label="Registration No." value={asset.registrationNo} onChange={(e: any) => onChange(asset.id, 'registrationNo', e.target.value)} placeholder="e.g., BP-1-A1234" />
</>;
case 'Bank Account':
return <>
<FormInput label="Bank Name" value={asset.bankName} onChange={(e: any) => onChange(asset.id, 'bankName', e.target.value)} placeholder="e.g., Bank of Bhutan" />
<FormInput label="Account No." value={asset.accountNo} onChange={(e: any) => onChange(asset.id, 'accountNo', e.target.value)} placeholder="e.g., 1020304050" />
</>;
default:
return null;
}
};
code
Code
return (
<div>
    <h2 className="text-xl font-semibold text-text-main mb-4">Declare Your Assets</h2>
    <p className="text-text-secondary mb-6">List all assets owned by you, your spouse, and dependent children. This includes land, buildings, vehicles, cash, bank deposits, shares, etc.</p>
    <div className="space-y-4">
        {data.map((asset: Asset, index: number) => (
            <div key={asset.id} className="p-4 bg-gray-50 rounded-md border relative">
                <button onClick={() => onRemove(asset.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full transition">
                    <TrashIcon className="w-5 h-5"/>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormSelect label="Asset Type" value={asset.type} onChange={(e: any) => onChange(asset.id, 'type', e.target.value)} error={errors?.[asset.id]?.type}>
                        <option>Land</option><option>Building</option><option>Vehicle</option><option>Bank Account</option><option>Shares & Bonds</option><option>Other</option>
                    </FormSelect>
                    <FormInput label="Description" placeholder="e.g. Residential Building" value={asset.description} onChange={(e: any) => onChange(asset.id, 'description', e.target.value)} error={errors?.[asset.id]?.description}/>
                    <FormInput label="Value (Nu.)" type="number" placeholder="500000" value={asset.value} onChange={(e: any) => onChange(asset.id, 'value', e.target.value)} error={errors?.[asset.id]?.value}/>
                    <FormInput label="Date of Acquisition" type="date" value={asset.dateOfAcquisition} onChange={(e: any) => onChange(asset.id, 'dateOfAcquisition', e.target.value)} error={errors?.[asset.id]?.dateOfAcquisition}/>
                    <FormInput label="Acquired From" placeholder="e.g., Inheritance, Seller Name" value={asset.acquiredFrom} onChange={(e: any) => onChange(asset.id, 'acquiredFrom', e.target.value)} error={errors?.[asset.id]?.acquiredFrom}/>
                    <FormInput label="Source of Funding" placeholder="e.g., Personal Savings, Loan" value={asset.sourceOfFunding} onChange={(e: any) => onChange(asset.id, 'sourceOfFunding', e.target.value)} error={errors?.[asset.id]?.sourceOfFunding}/>
                    {renderAssetFields(asset)}
                </div>
                <FileUpload documents={asset.documents} onFileChange={(e) => onFileChange(asset.id, e)} onFileRemove={(fileId) => onFileRemove(asset.id, fileId)} />
            </div>
        ))}
        <button onClick={onAdd} className="flex items-center space-x-2 text-sm font-medium text-accent hover:text-primary pt-2">
            <PlusIcon />
            <span>Add Asset</span>
        </button>
    </div>
</div>
);
};
const LiabilitiesStep = ({ data, onAdd, onRemove, onChange, onFileChange, onFileRemove, errors }: any) => (
<div>
<h2 className="text-xl font-semibold text-text-main mb-4">Declare Your Liabilities</h2>
<p className="text-text-secondary mb-6">List all outstanding loans, mortgages, and other debts.</p>
<div className="space-y-4">
{data.map((liability: Liability) => (
<div key={liability.id} className="p-4 bg-gray-50 rounded-md border relative">
<button onClick={() => onRemove(liability.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full transition"><TrashIcon className="w-5 h-5"/></button>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<FormSelect label="Liability Type" value={liability.type} onChange={(e: any) => onChange(liability.id, 'type', e.target.value)} error={errors?.[liability.id]?.type}>
<option>Home Loan</option><option>Vehicle Loan</option><option>Personal Loan</option><option>Credit Card Debt</option><option>Other</option>
</FormSelect>
<FormInput label="Lending Institution" placeholder="e.g. Bank of Bhutan" value={liability.institution} onChange={(e: any) => onChange(liability.id, 'institution', e.target.value)} error={errors?.[liability.id]?.institution}/>
<FormInput label="Outstanding Amount (Nu.)" type="number" placeholder="250000" value={liability.amount} onChange={(e: any) => onChange(liability.id, 'amount', e.target.value)} error={errors?.[liability.id]?.amount}/>
<FormInput label="Date of Liability" type="date" value={liability.dateOfLiability} onChange={(e: any) => onChange(liability.id, 'dateOfLiability', e.target.value)} error={errors?.[liability.id]?.dateOfLiability}/>
<FormInput label="Purpose of Liability" placeholder="e.g. Home Construction" value={liability.purpose} onChange={(e: any) => onChange(liability.id, 'purpose', e.target.value)} error={errors?.[liability.id]?.purpose}/>
</div>
<FileUpload documents={liability.documents} onFileChange={(e) => onFileChange(liability.id, e)} onFileRemove={(fileId) => onFileRemove(liability.id, fileId)} />
</div>
))}
<button onClick={onAdd} className="flex items-center space-x-2 text-sm font-medium text-accent hover:text-primary pt-2">
<PlusIcon /><span>Add Liability</span>
</button>
</div>
</div>
);
const GenericFormStep = ({ title, description, data, onAdd, onRemove, onChange, onFileChange, onFileRemove, fields, addLabel, errors }: any) => (
<div>
<h2 className="text-xl font-semibold text-text-main mb-4">{title}</h2>
<p className="text-text-secondary mb-6">{description}</p>
<div className="space-y-4">
{data.map((item: any) => (
<div key={item.id} className="p-4 bg-gray-50 rounded-md border relative">
<button onClick={() => onRemove(item.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full transition"><TrashIcon className="w-5 h-5"/></button>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{fields.map((field: any) => (
<FormInput
key={field.name}
label={field.label}
type={field.type || 'text'}
placeholder={field.placeholder}
value={item[field.name]}
onChange={(e: any) => onChange(item.id, field.name, e.target.value)}
error={errors?.[item.id]?.[field.name]}
/>
))}
</div>
<FileUpload documents={item.documents} onFileChange={(e) => onFileChange(item.id, e)} onFileRemove={(fileId) => onFileRemove(item.id, fileId)} />
</div>
))}
<button onClick={onAdd} className="flex items-center space-x-2 text-sm font-medium text-accent hover:text-primary pt-2">
<PlusIcon /><span>{addLabel}</span>
</button>
</div>
</div>
);
const SummaryStep = ({ allData }: any) => (
<div>
<h2 className="text-xl font-semibold text-text-main mb-4">Summary & Review</h2>
<p className="text-text-secondary mb-6">Please review all the information carefully before proceeding to the final affidavit.</p>
code
Code
<div className="space-y-6">
        {Object.entries(allData).map(([sectionTitle, sectionData]: any) => (
            (sectionData.length > 0) && (
                <div key={sectionTitle}>
                    <h3 className="text-lg font-semibold text-text-main border-b pb-2 mb-3 capitalize">{sectionTitle} Declared</h3>
                    <ul className="space-y-3">
                        {sectionData.map((item: any) => (
                            <li key={item.id} className="p-3 bg-gray-50 rounded text-sm">
                                <p className="font-semibold">{item.description || item.type || item.source || item.organisation}</p>
                                <p className="text-text-secondary">{item.institution || `Amount: Nu. ${item.amount || item.value}`}</p>
                                {item.documents.length > 0 && 
                                    <p className="text-xs text-blue-600 mt-1">
                                        {item.documents.length} document(s) attached.
                                    </p>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            )
        ))}
    </div>
</div>
);
const ConfirmationStep = () => (
<div className="text-center py-12">
<svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
<h2 className="text-2xl font-bold text-text-main mb-2">Declaration Submitted Successfully!</h2>
<p className="text-text-secondary">Your asset declaration has been submitted for review. A confirmation has been sent to your registered email.</p>
</div>
);
// --- Main Component ---
const declarationSteps = [
"Instructions", "Personal Info", "Assets", "Liabilities", "Income", "Expenditure",
"Additional Posts", "Post-Employment", "Summary & Submit", "Confirmation",
];
const FileNewPage = () => {
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
code
Code
// Form state
const [assets, setAssets] = useState<Asset[]>([]);
const [liabilities, setLiabilities] = useState<Liability[]>([]);
const [incomes, setIncomes] = useState<Income[]>([]);
const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
const [additionalPosts, setAdditionalPosts] = useState<AdditionalPost[]>([]);
const [postEmployments, setPostEmployments] = useState<PostEmployment[]>([]);

const [errors, setErrors] = useState<FormErrors>({});
const [isAffidavitModalOpen, setAffidavitModalOpen] = useState(false);
const [affidavitAgreed, setAffidavitAgreed] = useState(false);


// --- Generic Handlers ---
const createItemHandler = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, newItem: T) => () => {
    setter(prev => [...prev, { ...newItem, id: crypto.randomUUID(), documents: [] }]);
};
const createRemoveHandler = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>) => (id: string) => {
    setter(prev => prev.filter(item => item.id !== id));
};
const createChangeHandler = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>) => (id: string, field: keyof T, value: any) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
};
const createFileUploadHandler = <T extends {id: string, documents: DocumentFile[]}>(setter: React.Dispatch<React.SetStateAction<T[]>>) => 
    (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const newFiles = Array.from(e.target.files).map(file => Object.assign(file, { id: crypto.randomUUID() }));
        setter(prev => prev.map(item => 
            item.id === id ? { ...item, documents: [...item.documents, ...newFiles] } : item
        ));
    }
};
const createFileRemoveHandler = <T extends {id: string, documents: DocumentFile[]}>(setter: React.Dispatch<React.SetStateAction<T[]>>) => 
    (id: string, fileId: string) => {
    setter(prev => prev.map(item => 
        item.id === id ? { ...item, documents: item.documents.filter(f => f.id !== fileId) } : item
    ));
};

const validateCurrentStep = () => {
    const newErrors: FormErrors = {};
    const step = declarationSteps[currentStepIndex];
    let data: any[] = [];
    let requiredFields: string[] = [];
    
    if (step === 'Assets') { data = assets; requiredFields = ['type', 'description', 'value', 'dateOfAcquisition', 'acquiredFrom', 'sourceOfFunding']; }
    else if (step === 'Liabilities') { data = liabilities; requiredFields = ['type', 'institution', 'amount', 'dateOfLiability', 'purpose']; }
    else if (step === 'Income') { data = incomes; requiredFields = ['source', 'amount', 'date']; }
    else if (step === 'Expenditure') { data = expenditures; requiredFields = ['description', 'amount', 'date']; }
    else if (step === 'Additional Posts') { data = additionalPosts; requiredFields = ['organisation', 'position', 'details']; }
    else if (step === 'Post-Employment') { data = postEmployments; requiredFields = ['organisation', 'details', 'startDate']; }

    data.forEach(item => {
        newErrors[item.id] = {};
        requiredFields.forEach(field => {
            if (!item[field] || item[field].trim() === '') {
                newErrors[item.id][field] = 'This field is required.';
            }
        });
        if (Object.keys(newErrors[item.id]).length === 0) {
            delete newErrors[item.id];
        }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleNext = () => {
    if (!validateCurrentStep()) return;

    const currentStep = declarationSteps[currentStepIndex];
    if (currentStepIndex < declarationSteps.length - 1) {
        setCompletedSteps(prev => new Set(prev).add(currentStep));
        if (declarationSteps[currentStepIndex] === 'Summary & Submit') {
            setAffidavitModalOpen(true);
        } else {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    }
};

const handleBack = () => {
    if (currentStepIndex > 0) {
        setCurrentStepIndex(currentStepIndex - 1);
    }
};

const handleFinalSubmit = () => {
    if (affidavitAgreed) {
        setAffidavitModalOpen(false);
        setCompletedSteps(prev => new Set(prev).add('Summary & Submit'));
        setCurrentStepIndex(currentStepIndex + 1);
    }
};

const renderStepContent = () => {
    switch (currentStepIndex) {
        case 0: return <InstructionsStep />;
        case 1: return <PersonalInfoStep />;
        case 2: return <AssetsStep data={assets} onAdd={createItemHandler(setAssets, {type: 'Land', description: ''} as Asset)} onRemove={createRemoveHandler(setAssets)} onChange={createChangeHandler(setAssets)} onFileChange={createFileUploadHandler(setAssets)} onFileRemove={createFileRemoveHandler(setAssets)} errors={errors} />;
        case 3: return <LiabilitiesStep data={liabilities} onAdd={createItemHandler(setLiabilities, {type: 'Home Loan'} as Liability)} onRemove={createRemoveHandler(setLiabilities)} onChange={createChangeHandler(setLiabilities)} onFileChange={createFileUploadHandler(setLiabilities)} onFileRemove={createFileRemoveHandler(setLiabilities)} errors={errors} />;
        case 4: return <GenericFormStep title="Declare Your Income" description="List all sources of income for the declaration period." data={incomes} onAdd={createItemHandler(setIncomes, {} as Income)} onRemove={createRemoveHandler(setIncomes)} onChange={createChangeHandler(setIncomes)} onFileChange={createFileUploadHandler(setIncomes)} onFileRemove={createFileRemoveHandler(setIncomes)} addLabel="Add Income Source" fields={[{name: 'source', label: 'Source of Income', placeholder: 'e.g., Salary, Rental'}, {name: 'amount', label: 'Amount (Nu.)', type: 'number', placeholder: '100000'}, {name: 'date', label: 'Date Received', type: 'date'}]} errors={errors} />;
        case 5: return <GenericFormStep title="Declare Major Expenditures" description="List any major expenditures incurred during the period (e.g., purchase of property, vehicle)." data={expenditures} onAdd={createItemHandler(setExpenditures, {} as Expenditure)} onRemove={createRemoveHandler(setExpenditures)} onChange={createChangeHandler(setExpenditures)} onFileChange={createFileUploadHandler(setExpenditures)} onFileRemove={createFileRemoveHandler(setExpenditures)} addLabel="Add Expenditure" fields={[{name: 'description', label: 'Description', placeholder: 'e.g., Land Purchase'}, {name: 'amount', label: 'Amount (Nu.)', type: 'number', placeholder: '500000'}, {name: 'date', label: 'Date of Expenditure', type: 'date'}]} errors={errors} />;
        case 6: return <GenericFormStep title="Additional Posts Held" description="Declare any other official, professional, or commercial positions held." data={additionalPosts} onAdd={createItemHandler(setAdditionalPosts, {} as AdditionalPost)} onRemove={createRemoveHandler(setAdditionalPosts)} onChange={createChangeHandler(setAdditionalPosts)} onFileChange={createFileUploadHandler(setAdditionalPosts)} onFileRemove={createFileRemoveHandler(setAdditionalPosts)} addLabel="Add Post" fields={[{name: 'organisation', label: 'Organisation', placeholder: 'e.g., Royal University of Bhutan'}, {name: 'position', label: 'Position / Title', placeholder: 'e.g., Board Member'}, {name: 'details', label: 'Details / Responsibilities', placeholder: 'Provide brief details'}]} errors={errors} />;
        case 7: return <GenericFormStep title="Post-Employment Plans" description="Declare any agreements or plans for future employment after leaving public service." data={postEmployments} onAdd={createItemHandler(setPostEmployments, {} as PostEmployment)} onRemove={createRemoveHandler(setPostEmployments)} onChange={createChangeHandler(setPostEmployments)} onFileChange={createFileUploadHandler(setPostEmployments)} onFileRemove={createFileRemoveHandler(setPostEmployments)} addLabel="Add Plan" fields={[{name: 'organisation', label: 'Future Employer / Organisation', placeholder: 'e.g., Private Consultancy Firm'}, {name: 'details', label: 'Nature of Employment / Role', placeholder: 'e.g., Senior Consultant'}, {name: 'startDate', label: 'Anticipated Start Date', type: 'date'}]} errors={errors} />;
        case 8: return <SummaryStep allData={{ assets, liabilities, incomes, expenditures, additionalPosts, postEmployments }} />;
        case 9: return <ConfirmationStep />;
        default: return <div>Unknown Step</div>;
    }
};

return (
    <div>
         <Modal
            isOpen={isAffidavitModalOpen}
            onClose={() => setAffidavitModalOpen(false)}
            title="Sworn Affidavit"
        >
            <div className="space-y-4 text-text-secondary">
                <p>I, <strong>Kinley Wangchuk</strong>, holding Official ID <strong>12345</strong>, do hereby solemnly affirm and declare that the information furnished in this declaration, including all attached documents, is true, complete, and correct to the best of my knowledge and belief.</p>
                <p>I understand that any false, misleading, or incomplete information provided herein is an offense under the Anti-Corruption Act of Bhutan and may subject me to administrative penalties and/or criminal prosecution.</p>
                <div className="pt-4">
                    <label className="flex items-start space-x-3">
                        <input type="checkbox" checked={affidavitAgreed} onChange={(e) => setAffidavitAgreed(e.target.checked)} className="h-5 w-5 mt-1 text-primary focus:ring-accent border-gray-300 rounded shrink-0" />
                        <span>I have read, understood, and agree to the terms of this affidavit.</span>
                    </label>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button onClick={handleFinalSubmit} disabled={!affidavitAgreed} className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    Confirm & Submit
                </button>
            </div>
        </Modal>
        
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <ProgressBar steps={declarationSteps} currentStepIndex={currentStepIndex} completedSteps={completedSteps} />
            <div className="mt-8">{renderStepContent()}</div>
            
            {currentStepIndex < declarationSteps.length - 1 && (
                <div className="mt-8 pt-6 border-t flex justify-between items-center">
                    <button onClick={handleBack} disabled={currentStepIndex === 0} className="px-6 py-2 border border-gray-300 rounded-md text-text-main hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                    <button onClick={handleNext} className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition text-sm">
                        {declarationSteps[currentStepIndex] === 'Summary & Submit' ? 'Proceed to Affidavit' : 'Save & Continue'}
                    </button>
                </div>
            )}
        </div>
    </div>
);
};
export default FileNewPage;