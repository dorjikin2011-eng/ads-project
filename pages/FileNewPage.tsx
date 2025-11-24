import React, { useState, useRef } from 'react';
import ProgressBar from '../components/ProgressBar';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';
import PaperClipIcon from '../components/icons/PaperClipIcon';
import Modal from '../components/Modal';

// --- Helper ---
const generateId = () => Math.random().toString(36).substring(2, 15);

// --- Types based on PDF ---
interface DocumentFile extends File { id: string; }

// Page 2: Personal & Family
interface PersonalInfo {
    reason: 'Assumption of Office' | 'Annual Declaration' | 'Vacation of Office';
    name: string;
    cid: string;
    dob: string;
    sex: string;
    maritalStatus: string;
    permanentAddress: string; // Dzongkhag/Gewog/Village
    employmentDetails: string; // EID, Agency, Position, Grade
    contact: string; // Mobile/Email
    spouseCovered: boolean;
}

interface FamilyMember {
    id: string;
    relationship: 'Spouse' | 'Child' | 'Dependent';
    name: string;
    cid: string;
    dob: string;
    sex: string;
    maritalStatus: string;
    employment: string;
    contact: string;
    isCovered?: boolean; // For spouse
}

// Page 3: Jobs
interface AdditionalJob {
    id: string;
    relationship: string; // Self/Spouse/Child
    name: string;
    cid: string;
    agency: string;
    positionTitle: string;
    incomeAmount: string;
    documents: DocumentFile[];
}

interface PostEmployment {
    id: string;
    relationship: string;
    name: string;
    cid: string;
    newPosition: string; // Agency/Title
    commercialActivity: string;
    offerAccepted: 'Yes' | 'No';
    documents: DocumentFile[];
}

// Page 4: Immovable
interface ImmovableAsset {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    type: 'Land' | 'Building' | 'Flat' | 'House';
    thramNo: string;
    plotNo: string;
    size: string;
    location: string;
    acquisitionDate: string;
    acquisitionMode: string; // Purchase/Inheritance/Gift
    cost: string;
    sourceOfFinance: string;
    acquiredFrom: string; // Name & CID
    registeredOwner: string; // Name & CID
    documents: DocumentFile[];
}

// Page 5 & 6: Movable
interface ShareStock {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    company: string;
    location: string;
    numberOfShares: string;
    transactionId: string;
    acquisitionDate: string;
    acquisitionMode: string;
    cost: string;
    sourceOfFinance: string;
    acquiredFrom: string;
    documents: DocumentFile[];
}

interface Vehicle {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    type: string; // Car/Heavy Machinery
    make: string;
    registrationNo: string;
    model: string;
    acquisitionDate: string;
    acquisitionMode: string;
    cost: string;
    sourceOfFinance: string;
    acquiredFrom: string;
    registeredOwner: string;
    documents: DocumentFile[];
}

// Page 6, 7, 8: Other Assets
interface VirtualAsset {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    type: string; // Bitcoin/Eth
    qty: string;
    acquisitionDate: string;
    cost: string;
    sourceOfFinance: string;
    acquiredFrom: string;
    documents: DocumentFile[];
}

interface PersonalSaving {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    type: 'Bank Deposit' | 'Cash in Hand' | 'Money Lent' | 'Foreign Exchange';
    bankName: string;
    location: string;
    accountNumber: string; // Type of Account & Number
    balance: string;
    source: string;
    documents: DocumentFile[];
}

interface ConvertibleAsset {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    type: string; // Gold/Jewelry/Art
    acquisitionDate: string;
    acquisitionMode: string;
    cost: string;
    sourceOfFinance: string;
    acquiredFrom: string;
    documents: DocumentFile[];
}

interface CommercialActivity {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    type: string; // Business/IP
    licenseNo: string;
    location: string;
    operationStatus: string;
    acquisitionDate: string;
    acquisitionMode: string;
    cost: string;
    sourceOfFinance: string;
    acquiredFrom: string;
    documents: DocumentFile[];
}

// Page 9: Income & Liability
interface Income {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    salary: string;
    business: string;
    rental: string;
    dividends: string;
    hiringCharges: string;
    interest: string;
    cashCrop: string;
    tada: string;
    others: string;
    documents: DocumentFile[];
}

interface Liability {
    id: string;
    ownerRelationship: string;
    ownerName: string;
    ownerCid: string;
    type: 'Bank Loan' | 'Private Borrowing';
    sanctionedAmount: string;
    actualReceived: string;
    lenderDetails: string; // Bank Name or Individual Name/CID
    borrowingDate: string;
    documents: DocumentFile[];
}

// Page 10 & 11: Expenditure
interface EducationalExpense {
    id: string;
    relationship: string;
    name: string;
    amount: string;
    institution: string; // School/College
    courseLevel: string;
    documents: DocumentFile[];
}

interface OtherExpense {
    id: string;
    category: 'Rental' | 'Insurance' | 'Loan Repayment' | 'Mandatory Deduction (PF/GIS/TDS)' | 'Travel' | 'Vacation' | 'Donation' | 'Medical' | 'Rituals' | 'Other';
    details: string;
    amount: string;
    documents: DocumentFile[];
}

// --- Reusable Components ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6 border-b pb-2">
        <h2 className="text-xl font-bold text-primary-dark">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
    </div>
);

const FormInput = ({ label, id, ...props }: any) => (
    <div>
        <label htmlFor={id} className="block text-xs font-semibold text-text-secondary mb-1 uppercase">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
    </div>
);

const FormSelect = ({ label, id, children, ...props }: any) => (
    <div>
        <label htmlFor={id} className="block text-xs font-semibold text-text-secondary mb-1 uppercase">{label}</label>
        <select id={id} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
            {children}
        </select>
    </div>
);

const FileUpload = ({ documents, onFileChange, onFileRemove }: { documents: DocumentFile[], onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onFileRemove: (fileId: string) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
            <div className="flex flex-wrap gap-2 mb-2">
                {documents.map(file => (
                    <span key={file.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {file.name}
                        <button type="button" onClick={() => onFileRemove(file.id)} className="ml-1 text-blue-400 hover:text-blue-600"><TrashIcon className="w-3 h-3" /></button>
                    </span>
                ))}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center text-xs font-medium text-accent hover:text-primary">
                <PaperClipIcon className="w-4 h-4 mr-1" /> Attach Evidence
            </button>
            <input type="file" multiple ref={fileInputRef} onChange={onFileChange} className="hidden" />
        </div>
    );
};

// --- Asset Item Wrapper (Card style for array items) ---
const ItemCard = ({ title, onRemove, children }: { title: string, onRemove: () => void, children: React.ReactNode }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 relative">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <h4 className="text-sm font-bold text-gray-700">{title}</h4>
            <button onClick={onRemove} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"><TrashIcon className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const FileNewPage = () => {
    const steps = [
        "Guidelines", "Personal Info", "Family Details", "Employment", 
        "Immovable Assets", "Movable Assets", "Other Assets", 
        "Income & Liabilities", "Expenditure", "Affidavit"
    ];
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [isAffidavitModalOpen, setAffidavitModalOpen] = useState(false);
    const [affidavitAgreed, setAffidavitAgreed] = useState(false);

    // --- DATA STATES ---
    const [personal, setPersonal] = useState<PersonalInfo>({
        reason: 'Annual Declaration', name: 'Kinley Wangchuk', cid: '12345', dob: '1985-06-15', sex: 'Male', 
        maritalStatus: 'Married', permanentAddress: 'Thimphu', employmentDetails: 'Rev. Officer', contact: '17123456', spouseCovered: false
    });
    const [family, setFamily] = useState<FamilyMember[]>([]);
    const [addJobs, setAddJobs] = useState<AdditionalJob[]>([]);
    const [postJobs, setPostJobs] = useState<PostEmployment[]>([]);
    const [immovable, setImmovable] = useState<ImmovableAsset[]>([]);
    const [shares, setShares] = useState<ShareStock[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [virtual, setVirtual] = useState<VirtualAsset[]>([]);
    const [savings, setSavings] = useState<PersonalSaving[]>([]);
    const [convertible, setConvertible] = useState<ConvertibleAsset[]>([]);
    const [commercial, setCommercial] = useState<CommercialActivity[]>([]);
    const [income, setIncome] = useState<Income[]>([]);
    const [liabilities, setLiabilities] = useState<Liability[]>([]);
    const [eduExp, setEduExp] = useState<EducationalExpense[]>([]);
    const [otherExp, setOtherExp] = useState<OtherExpense[]>([]);

    // --- HELPERS ---
    // Generate options for "Owner/Relationship" dropdowns based on Family Members added in Step 2
    const getRelationOptions = () => (
        <>
            <option value="Self">Self ({personal.name})</option>
            {family.map(f => <option key={f.id} value={f.relationship}>{f.relationship} ({f.name})</option>)}
        </>
    );

    // Generic handlers
    const handleAdd = (setter: any, initial: any) => {
        setter((prev: any) => [...prev, { ...initial, id: generateId(), documents: [] }]);
    };
    const handleRemove = (setter: any, id: string) => {
        setter((prev: any) => prev.filter((i: any) => i.id !== id));
    };
    const handleChange = (setter: any, id: string, field: string, value: string) => {
        setter((prev: any) => prev.map((i: any) => i.id === id ? { ...i, [field]: value } : i));
    };
    const handleFile = (setter: any, id: string, e: any) => {
        if(e.target.files) {
            const files = Array.from(e.target.files).map((f: any) => Object.assign(f, {id: generateId()}));
            setter((prev: any) => prev.map((i: any) => i.id === id ? {...i, documents: [...i.documents, ...files]} : i));
        }
    };
    const handleFileRemove = (setter: any, itemId: string, fileId: string) => {
        setter((prev: any) => prev.map((i: any) => i.id === itemId ? {...i, documents: i.documents.filter((d: any) => d.id !== fileId)} : i));
    };

    // --- STEP RENDERERS ---

    const renderPersonalInfo = () => (
        <div>
            <SectionHeader title="Reason for Declaration" subtitle="Select the appropriate type" />
            <div className="mb-6 bg-blue-50 p-4 rounded-md">
                <div className="flex gap-6">
                    {['Assumption of Office', 'Annual Declaration', 'Vacation of Office'].map(type => (
                        <label key={type} className="flex items-center cursor-pointer">
                            <input type="radio" name="reason" checked={personal.reason === type} onChange={() => setPersonal({...personal, reason: type as any})} className="h-4 w-4 text-primary focus:ring-primary" />
                            <span className="ml-2 text-sm font-medium text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            <SectionHeader title="Details of Declarant" subtitle="Your personal information as per records" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Name" id="p_name" value={personal.name} onChange={(e:any) => setPersonal({...personal, name: e.target.value})} />
                <FormInput label="CID / Work Permit" id="p_cid" value={personal.cid} onChange={(e:any) => setPersonal({...personal, cid: e.target.value})} />
                <FormInput label="Date of Birth" id="p_dob" type="date" value={personal.dob} onChange={(e:any) => setPersonal({...personal, dob: e.target.value})} />
                <FormInput label="Sex" id="p_sex" value={personal.sex} onChange={(e:any) => setPersonal({...personal, sex: e.target.value})} />
                <FormInput label="Marital Status" id="p_status" value={personal.maritalStatus} onChange={(e:any) => setPersonal({...personal, maritalStatus: e.target.value})} />
                <FormInput label="Permanent Address" id="p_addr" placeholder="Dzongkhag, Gewog, Village" value={personal.permanentAddress} onChange={(e:any) => setPersonal({...personal, permanentAddress: e.target.value})} />
                <FormInput label="Employment Details" id="p_emp" placeholder="EID, Agency, Position, Level" value={personal.employmentDetails} onChange={(e:any) => setPersonal({...personal, employmentDetails: e.target.value})} />
                <FormInput label="Contact Details" id="p_contact" placeholder="Mobile / Email" value={personal.contact} onChange={(e:any) => setPersonal({...personal, contact: e.target.value})} />
                <div className="md:col-span-3 mt-2 p-3 bg-gray-100 rounded">
                    <label className="flex items-center">
                        <input type="checkbox" checked={personal.spouseCovered} onChange={(e) => setPersonal({...personal, spouseCovered: e.target.checked})} className="h-4 w-4 text-primary rounded" />
                        <span className="ml-2 text-sm font-bold text-gray-800">Is your spouse also a covered person (Public Official)?</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderFamily = () => (
        <div>
            <SectionHeader title="Family Details" subtitle="Spouse, Children and Dependents" />
            <div className="space-y-4">
                {family.map((mem) => (
                    <ItemCard key={mem.id} title={`${mem.relationship}: ${mem.name}`} onRemove={() => handleRemove(setFamily, mem.id)}>
                        <FormSelect label="Relationship" value={mem.relationship} onChange={(e:any) => handleChange(setFamily, mem.id, 'relationship', e.target.value)}>
                            <option>Spouse</option><option>Child</option><option>Dependent</option>
                        </FormSelect>
                        <FormInput label="Name" value={mem.name} onChange={(e:any) => handleChange(setFamily, mem.id, 'name', e.target.value)} />
                        <FormInput label="CID / Permit No" value={mem.cid} onChange={(e:any) => handleChange(setFamily, mem.id, 'cid', e.target.value)} />
                        <FormInput label="Date of Birth" type="date" value={mem.dob} onChange={(e:any) => handleChange(setFamily, mem.id, 'dob', e.target.value)} />
                        <FormInput label="Marital Status" value={mem.maritalStatus} onChange={(e:any) => handleChange(setFamily, mem.id, 'maritalStatus', e.target.value)} />
                        <FormInput label="Employment Details" placeholder="Agency, Position" value={mem.employment} onChange={(e:any) => handleChange(setFamily, mem.id, 'employment', e.target.value)} />
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setFamily, {relationship: 'Spouse', name: '', cid: '', dob: '', employment: ''})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Family Member</button>
            </div>
        </div>
    );

    const renderEmployment = () => (
        <div className="space-y-8">
            <div>
                <SectionHeader title="Additional Job / Employment" subtitle="Apart from current office (Paid or Unpaid)" />
                {addJobs.map(job => (
                    <ItemCard key={job.id} title="Additional Job" onRemove={() => handleRemove(setAddJobs, job.id)}>
                        <FormSelect label="Relationship" value={job.relationship} onChange={(e:any) => handleChange(setAddJobs, job.id, 'relationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormInput label="Agency / Organization" value={job.agency} onChange={(e:any) => handleChange(setAddJobs, job.id, 'agency', e.target.value)} />
                        <FormInput label="Position Title" value={job.positionTitle} onChange={(e:any) => handleChange(setAddJobs, job.id, 'positionTitle', e.target.value)} />
                        <FormInput label="Income (Amount)" value={job.incomeAmount} onChange={(e:any) => handleChange(setAddJobs, job.id, 'incomeAmount', e.target.value)} />
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setAddJobs, {relationship: 'Self', agency: '', positionTitle: '', incomeAmount: ''})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Job</button>
            </div>
            <div>
                <SectionHeader title="Post-Employment Arrangement" subtitle="Plans after separation from current office" />
                {postJobs.map(job => (
                    <ItemCard key={job.id} title="Post-Employment Plan" onRemove={() => handleRemove(setPostJobs, job.id)}>
                        <FormSelect label="Relationship" value={job.relationship} onChange={(e:any) => handleChange(setPostJobs, job.id, 'relationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormInput label="New Position / Agency" value={job.newPosition} onChange={(e:any) => handleChange(setPostJobs, job.id, 'newPosition', e.target.value)} />
                        <FormInput label="Commercial Activity" value={job.commercialActivity} onChange={(e:any) => handleChange(setPostJobs, job.id, 'commercialActivity', e.target.value)} />
                        <FormSelect label="Offer Accepted?" value={job.offerAccepted} onChange={(e:any) => handleChange(setPostJobs, job.id, 'offerAccepted', e.target.value)}><option>Yes</option><option>No</option></FormSelect>
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setPostJobs, {relationship: 'Self', newPosition: '', commercialActivity: '', offerAccepted: 'No'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Plan</button>
            </div>
        </div>
    );

    const renderImmovable = () => (
        <div>
            <SectionHeader title="Immovable Properties" subtitle="Land, Building, House, Flat (Sec 6.1)" />
            {immovable.map(item => (
                <ItemCard key={item.id} title={`${item.type} - ${item.thramNo}`} onRemove={() => handleRemove(setImmovable, item.id)}>
                    <FormSelect label="Owner" value={item.ownerRelationship} onChange={(e:any) => handleChange(setImmovable, item.id, 'ownerRelationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                    <FormSelect label="Type" value={item.type} onChange={(e:any) => handleChange(setImmovable, item.id, 'type', e.target.value)}><option>Land</option><option>Building</option><option>Flat</option><option>House</option></FormSelect>
                    <FormInput label="Thram / Plot / House No" value={item.thramNo} onChange={(e:any) => handleChange(setImmovable, item.id, 'thramNo', e.target.value)} />
                    <FormInput label="Size / Qty" value={item.size} onChange={(e:any) => handleChange(setImmovable, item.id, 'size', e.target.value)} />
                    <FormInput label="Location" value={item.location} onChange={(e:any) => handleChange(setImmovable, item.id, 'location', e.target.value)} />
                    <FormInput label="Date of Acquisition" type="date" value={item.acquisitionDate} onChange={(e:any) => handleChange(setImmovable, item.id, 'acquisitionDate', e.target.value)} />
                    <FormInput label="Mode of Acquisition" placeholder="Purchase, Gift, Inheritance" value={item.acquisitionMode} onChange={(e:any) => handleChange(setImmovable, item.id, 'acquisitionMode', e.target.value)} />
                    <FormInput label="Cost (Nu.)" type="number" value={item.cost} onChange={(e:any) => handleChange(setImmovable, item.id, 'cost', e.target.value)} />
                    <FormInput label="Source of Finance" value={item.sourceOfFinance} onChange={(e:any) => handleChange(setImmovable, item.id, 'sourceOfFinance', e.target.value)} />
                    <FormInput label="Acquired From (Name & CID)" value={item.acquiredFrom} onChange={(e:any) => handleChange(setImmovable, item.id, 'acquiredFrom', e.target.value)} />
                    <FormInput label="Registered Owner Name/CID" value={item.registeredOwner} onChange={(e:any) => handleChange(setImmovable, item.id, 'registeredOwner', e.target.value)} />
                    <div className="md:col-span-3"><FileUpload documents={item.documents} onFileChange={(e) => handleFile(setImmovable, item.id, e)} onFileRemove={(fid) => handleFileRemove(setImmovable, item.id, fid)} /></div>
                </ItemCard>
            ))}
            <button onClick={() => handleAdd(setImmovable, {type: 'Land', ownerRelationship: 'Self'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Property</button>
        </div>
    );

    const renderMovable = () => (
        <div className="space-y-8">
            <div>
                <SectionHeader title="Shares and Stocks" subtitle="Sec 6.2" />
                {shares.map(item => (
                    <ItemCard key={item.id} title={`Shares in ${item.company}`} onRemove={() => handleRemove(setShares, item.id)}>
                        <FormSelect label="Owner" value={item.ownerRelationship} onChange={(e:any) => handleChange(setShares, item.id, 'ownerRelationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormInput label="Company" value={item.company} onChange={(e:any) => handleChange(setShares, item.id, 'company', e.target.value)} />
                        <FormInput label="Num of Shares" value={item.numberOfShares} onChange={(e:any) => handleChange(setShares, item.id, 'numberOfShares', e.target.value)} />
                        <FormInput label="Total Cost (Nu.)" value={item.cost} onChange={(e:any) => handleChange(setShares, item.id, 'cost', e.target.value)} />
                        <div className="md:col-span-3"><FileUpload documents={item.documents} onFileChange={(e) => handleFile(setShares, item.id, e)} onFileRemove={(fid) => handleFileRemove(setShares, item.id, fid)} /></div>
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setShares, {ownerRelationship: 'Self'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Shares</button>
            </div>
            <div>
                <SectionHeader title="Vehicles and Machineries" subtitle="Sec 6.3" />
                {vehicles.map(item => (
                    <ItemCard key={item.id} title={`${item.make} ${item.model}`} onRemove={() => handleRemove(setVehicles, item.id)}>
                        <FormSelect label="Owner" value={item.ownerRelationship} onChange={(e:any) => handleChange(setVehicles, item.id, 'ownerRelationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormInput label="Type" value={item.type} onChange={(e:any) => handleChange(setVehicles, item.id, 'type', e.target.value)} />
                        <FormInput label="Registration No." value={item.registrationNo} onChange={(e:any) => handleChange(setVehicles, item.id, 'registrationNo', e.target.value)} />
                        <FormInput label="Make/Model" value={item.model} onChange={(e:any) => handleChange(setVehicles, item.id, 'model', e.target.value)} />
                        <FormInput label="Cost (Nu.)" value={item.cost} onChange={(e:any) => handleChange(setVehicles, item.id, 'cost', e.target.value)} />
                        <div className="md:col-span-3"><FileUpload documents={item.documents} onFileChange={(e) => handleFile(setVehicles, item.id, e)} onFileRemove={(fid) => handleFileRemove(setVehicles, item.id, fid)} /></div>
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setVehicles, {ownerRelationship: 'Self', type: 'Vehicle'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Vehicle</button>
            </div>
        </div>
    );

    const renderOtherAssets = () => (
        <div className="space-y-8">
            <div>
                <SectionHeader title="Virtual Assets" subtitle="Bitcoin, Litecoin, Ether etc (Sec 6.4)" />
                {virtual.map(item => (
                    <ItemCard key={item.id} title={item.type} onRemove={() => handleRemove(setVirtual, item.id)}>
                        <FormSelect label="Owner" value={item.ownerRelationship} onChange={(e:any) => handleChange(setVirtual, item.id, 'ownerRelationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormInput label="Type" value={item.type} onChange={(e:any) => handleChange(setVirtual, item.id, 'type', e.target.value)} />
                        <FormInput label="Quantity" value={item.qty} onChange={(e:any) => handleChange(setVirtual, item.id, 'qty', e.target.value)} />
                        <FormInput label="Cost (Nu.)" value={item.cost} onChange={(e:any) => handleChange(setVirtual, item.id, 'cost', e.target.value)} />
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setVirtual, {ownerRelationship: 'Self'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Virtual Asset</button>
            </div>
            <div>
                <SectionHeader title="Personal Savings" subtitle="Bank deposits, Cash in hand > 1 month salary (Sec 6.5)" />
                {savings.map(item => (
                    <ItemCard key={item.id} title={`${item.bankName} - ${item.balance}`} onRemove={() => handleRemove(setSavings, item.id)}>
                        <FormSelect label="Owner" value={item.ownerRelationship} onChange={(e:any) => handleChange(setSavings, item.id, 'ownerRelationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormSelect label="Type" value={item.type} onChange={(e:any) => handleChange(setSavings, item.id, 'type', e.target.value)}><option>Bank Deposit</option><option>Cash in Hand</option><option>Money Lent</option></FormSelect>
                        <FormInput label="Bank Name" value={item.bankName} onChange={(e:any) => handleChange(setSavings, item.id, 'bankName', e.target.value)} />
                        <FormInput label="Account No" value={item.accountNumber} onChange={(e:any) => handleChange(setSavings, item.id, 'accountNumber', e.target.value)} />
                        <FormInput label="Balance (Nu.)" value={item.balance} onChange={(e:any) => handleChange(setSavings, item.id, 'balance', e.target.value)} />
                        <div className="md:col-span-3"><FileUpload documents={item.documents} onFileChange={(e) => handleFile(setSavings, item.id, e)} onFileRemove={(fid) => handleFileRemove(setSavings, item.id, fid)} /></div>
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setSavings, {ownerRelationship: 'Self', type: 'Bank Deposit'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Saving</button>
            </div>
            <div>
                <SectionHeader title="Convertible Assets" subtitle="Jewelry, Gold, Art > Nu. 100,000 (Sec 6.6)" />
                {convertible.map(item => (
                    <ItemCard key={item.id} title={item.type} onRemove={() => handleRemove(setConvertible, item.id)}>
                        <FormSelect label="Owner" value={item.ownerRelationship} onChange={(e:any) => handleChange(setConvertible, item.id, 'ownerRelationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormInput label="Type/Description" value={item.type} onChange={(e:any) => handleChange(setConvertible, item.id, 'type', e.target.value)} />
                        <FormInput label="Cost (Nu.)" value={item.cost} onChange={(e:any) => handleChange(setConvertible, item.id, 'cost', e.target.value)} />
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setConvertible, {ownerRelationship: 'Self'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Convertible Asset</button>
            </div>
        </div>
    );

    const renderIncomeLiability = () => (
        <div className="space-y-8">
            <div>
                <SectionHeader title="Income Statement" subtitle="Sources of all income (Annual Gross) (Sec 6.8)" />
                {income.map(item => (
                    <ItemCard key={item.id} title={`${item.ownerRelationship} Income`} onRemove={() => handleRemove(setIncome, item.id)}>
                        <FormSelect label="Earner" value={item.ownerRelationship} onChange={(e:any) => handleChange(setIncome, item.id, 'ownerRelationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormInput label="Gross Salary" type="number" value={item.salary} onChange={(e:any) => handleChange(setIncome, item.id, 'salary', e.target.value)} />
                        <FormInput label="Business/Consultancy" type="number" value={item.business} onChange={(e:any) => handleChange(setIncome, item.id, 'business', e.target.value)} />
                        <FormInput label="Rental" type="number" value={item.rental} onChange={(e:any) => handleChange(setIncome, item.id, 'rental', e.target.value)} />
                        <FormInput label="Dividends" type="number" value={item.dividends} onChange={(e:any) => handleChange(setIncome, item.id, 'dividends', e.target.value)} />
                        <FormInput label="Others" type="number" value={item.others} onChange={(e:any) => handleChange(setIncome, item.id, 'others', e.target.value)} />
                        <div className="md:col-span-3"><FileUpload documents={item.documents} onFileChange={(e) => handleFile(setIncome, item.id, e)} onFileRemove={(fid) => handleFileRemove(setIncome, item.id, fid)} /></div>
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setIncome, {ownerRelationship: 'Self'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Income Source</button>
            </div>
            <div>
                <SectionHeader title="Liabilities" subtitle="Loans and Borrowings (Sec 6.9)" />
                {liabilities.map(item => (
                    <ItemCard key={item.id} title={`${item.type} - ${item.lenderDetails}`} onRemove={() => handleRemove(setLiabilities, item.id)}>
                        <FormSelect label="Borrower" value={item.ownerRelationship} onChange={(e:any) => handleChange(setLiabilities, item.id, 'ownerRelationship', e.target.value)}>{getRelationOptions()}</FormSelect>
                        <FormSelect label="Type" value={item.type} onChange={(e:any) => handleChange(setLiabilities, item.id, 'type', e.target.value)}><option>Bank Loan</option><option>Private Borrowing</option></FormSelect>
                        <FormInput label="Sanctioned Amount" value={item.sanctionedAmount} onChange={(e:any) => handleChange(setLiabilities, item.id, 'sanctionedAmount', e.target.value)} />
                        <FormInput label="Lender Name/Bank" value={item.lenderDetails} onChange={(e:any) => handleChange(setLiabilities, item.id, 'lenderDetails', e.target.value)} />
                        <FormInput label="Date Borrowed" type="date" value={item.borrowingDate} onChange={(e:any) => handleChange(setLiabilities, item.id, 'borrowingDate', e.target.value)} />
                        <div className="md:col-span-3"><FileUpload documents={item.documents} onFileChange={(e) => handleFile(setLiabilities, item.id, e)} onFileRemove={(fid) => handleFileRemove(setLiabilities, item.id, fid)} /></div>
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setLiabilities, {ownerRelationship: 'Self', type: 'Bank Loan'})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Liability</button>
            </div>
        </div>
    );

    const renderExpenditure = () => (
        <div className="space-y-8">
            <div>
                <SectionHeader title="Educational Expenditure" subtitle="Sec 6.10 A" />
                {eduExp.map(item => (
                    <ItemCard key={item.id} title={`Edu: ${item.name}`} onRemove={() => handleRemove(setEduExp, item.id)}>
                        <FormInput label="Name & Relationship" value={item.name} onChange={(e:any) => handleChange(setEduExp, item.id, 'name', e.target.value)} />
                        <FormInput label="Amount (Nu.)" value={item.amount} onChange={(e:any) => handleChange(setEduExp, item.id, 'amount', e.target.value)} />
                        <FormInput label="School/College/Place" value={item.institution} onChange={(e:any) => handleChange(setEduExp, item.id, 'institution', e.target.value)} />
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setEduExp, {name: '', amount: '', institution: ''})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Education Exp</button>
            </div>
            <div>
                <SectionHeader title="Other Expenditure" subtitle="Rental, Insurance, Loan Repayment, PF/GIS, etc (Sec 6.10 B)" />
                {otherExp.map(item => (
                    <ItemCard key={item.id} title={item.category} onRemove={() => handleRemove(setOtherExp, item.id)}>
                        <FormSelect label="Category" value={item.category} onChange={(e:any) => handleChange(setOtherExp, item.id, 'category', e.target.value)}>
                            <option>Rental</option><option>Insurance</option><option>Loan Repayment</option><option>Mandatory Deduction (PF/GIS/TDS)</option><option>Travel</option><option>Vacation</option><option>Medical</option><option>Other</option>
                        </FormSelect>
                        <FormInput label="Details (Location/Company)" value={item.details} onChange={(e:any) => handleChange(setOtherExp, item.id, 'details', e.target.value)} />
                        <FormInput label="Amount (Nu.)" value={item.amount} onChange={(e:any) => handleChange(setOtherExp, item.id, 'amount', e.target.value)} />
                    </ItemCard>
                ))}
                <button onClick={() => handleAdd(setOtherExp, {category: 'Rental', details: '', amount: ''})} className="flex items-center text-primary font-bold text-sm"><PlusIcon className="w-5 h-5 mr-1" /> Add Other Exp</button>
            </div>
        </div>
    );

    const renderAffidavit = () => (
        <div className="text-center p-8 space-y-4">
            <h2 className="text-xl font-bold">Sworn Affidavit</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-6 text-left text-sm text-gray-700 rounded-lg space-y-4">
                <p>I swear or affirm that all the information that I have given here is true, correct and complete to the best of my knowledge, information and belief.</p>
                <p>I understand that I shall be liable as per section 64 of ACAB 2011, if I have intentionally given false information. I also know that I may be asked to show proof of any information I have given.</p>
                <p>I also hereby authorize the Commission or its duly authorized agency to obtain and secure from all appropriate agencies, including the Department of Revenue and Customs, such documents that may show such income, assets, and liabilities.</p>
            </div>
            <label className="flex items-center justify-center mt-6 space-x-2 cursor-pointer">
                <input type="checkbox" checked={affidavitAgreed} onChange={(e) => setAffidavitAgreed(e.target.checked)} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                <span className="font-bold text-gray-900">I AGREE TO THE ABOVE AFFIDAVIT</span>
            </label>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0: return (
                <div className="prose text-sm text-gray-600">
                    <h2 className="text-xl font-bold text-primary mb-4">Important Information</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Why file?</strong> As per section 38(1) of ACAB 2011, to promote transparency.</li>
                        <li><strong>What to file?</strong> Assets, Income, and Liabilities of yourself, spouse, and dependents.</li>
                        <li><strong>Penalty:</strong> Filing false information may subject you to penalty or criminal prosecution.</li>
                    </ul>
                </div>
            );
            case 1: return renderPersonalInfo();
            case 2: return renderFamily();
            case 3: return renderEmployment();
            case 4: return renderImmovable();
            case 5: return renderMovable();
            case 6: return renderOtherAssets();
            case 7: return renderIncomeLiability();
            case 8: return renderExpenditure();
            case 9: return renderAffidavit();
            default: return null;
        }
    };

    const handleNext = () => {
        setCompletedSteps(prev => new Set(prev).add(steps[currentStep]));
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        else if (currentStep === steps.length - 1 && affidavitAgreed) alert("Declaration Submitted Successfully!");
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <ProgressBar steps={steps} currentStepIndex={currentStep} completedSteps={completedSteps} />
            <div className="mt-8 mb-8 min-h-[400px]">
                {renderCurrentStep()}
            </div>
            <div className="pt-6 border-t flex justify-between items-center">
                <button onClick={handleBack} disabled={currentStep === 0} className="px-6 py-2 border border-gray-300 rounded-md text-text-main hover:bg-gray-50 disabled:opacity-50">Back</button>
                <button onClick={handleNext} disabled={currentStep === 9 && !affidavitAgreed} className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark disabled:opacity-50">
                    {currentStep === 9 ? 'Submit Declaration' : 'Save & Continue'}
                </button>
            </div>
        </div>
    );
};

export default FileNewPage;