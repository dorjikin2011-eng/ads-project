import React, { useState, useRef, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';
import PaperClipIcon from '../components/icons/PaperClipIcon';
import DocumentReportIcon from '../components/icons/DocumentReportIcon';
import CheckIcon from '../components/icons/CheckIcon';
import InfoIcon from '../components/icons/InfoIcon';
import AlertIcon from '../components/icons/AlertIcon';
import Modal from '../components/Modal';
import PngLogoIcon from '../components/icons/PngLogoIcon';

// ==================== INTERFACES & TYPES ====================
const generateId = () => Math.random().toString(36).substring(2, 15);

interface DocumentFile extends File { id: string; }

interface PersonalInfo {
  reason: 'Assumption of Office' | 'Annual Declaration' | 'Vacation of Office';
  name: string;
  cid: string;
  dob: string;
  sex: 'Male' | 'Female' | 'Others';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widow' | 'Widower';
  permanentAddress: string;
  employmentDetails: string;
  contact: string;
  spouseCovered: boolean;
}

interface FamilyMember {
  id: string;
  relationship: 'Spouse' | 'Child' | 'Dependent';
  name: string;
  cid: string;
  dob: string;
  sex: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widow';
  permanentAddress: string;
  employment: string;
  contact: string;
  isCovered?: boolean;
  documents: DocumentFile[];  // Changed from optional to required
}

interface AdditionalJob {
  id: string;
  relationship: 'Self' | 'Spouse' | 'Child';
  name: string;
  cid: string;
  agency: string;
  positionTitle: string;
  hasIncome: 'Yes' | 'No';
  incomeAmount: string;
  documents: DocumentFile[];
}

interface PostEmployment {
  id: string;
  relationship: 'Self' | 'Spouse' | 'Child';
  name: string;
  cid: string;
  newPositionAgency: string;
  newPositionTitle: string;
  newCommercialActivity: string;
  offerAccepted: 'Yes' | 'No';
  documents: DocumentFile[];
}

interface ImmovableAsset {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: 'Land' | 'Building' | 'House' | 'Flat' | 'Others';
  thramNo: string;
  plotNo: string;
  houseNo: string;
  size: string;
  location: string;
  acquisitionDate: string;
  acquisitionMode: string;
  totalCost: string;
  paymentInYear: string;
  sourceOfFinance: string;
  acquiredFrom: string;
  registeredOwnerName: string;
  registeredOwnerCID: string;
  documents: DocumentFile[];
}

interface ShareStock {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  company: string;
  companyAddress: string;
  numberOfShares: string;
  transactionId: string;
  acquisitionDate: string;
  acquisitionMode: string;
  totalCost: string;
  sourceOfFinance: string;
  acquiredFrom: string;
  documents: DocumentFile[];
}

interface Vehicle {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: string;
  make: string;
  registrationNo: string;
  model: string;
  acquisitionDate: string;
  acquisitionMode: string;
  totalCost: string;
  sourceOfFinance: string;
  acquiredFrom: string;
  registeredOwnerName: string;
  registeredOwnerCID: string;
  documents: DocumentFile[];
}

interface VirtualAsset {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: 'Bitcoin' | 'Litecoin' | 'Ether' | 'Other';
  otherType?: string;
  quantity: string;
  acquisitionDate: string;
  acquisitionMode: string;
  totalCost: string;
  paymentInYear: string;
  sourceOfFinance: string;
  acquiredFrom: string;
  documents: DocumentFile[];
}

interface PersonalSaving {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: 'Bank Deposit' | 'Cash in Hand' | 'Money Lent' | 'Foreign Exchange' | 'Others';
  otherType?: string;
  bankName: string;
  bankLocation: string;
  accountType: string;
  accountNumber: string;
  balanceAmount: string;
  sourceOfSaving: string;
  documents: DocumentFile[];
}

interface ConvertibleAsset {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: 'Jewelry' | 'Gold' | 'Art' | 'Electronic Gadgets' | 'Others';
  otherType?: string;
  acquisitionDate: string;
  acquisitionMode: string;
  totalCost: string;
  paymentInYear: string;
  sourceOfFinance: string;
  acquiredFrom: string;
  documents: DocumentFile[];
}

interface CommercialActivity {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: 'Commercial' | 'Intellectual Property';
  activityType: string;
  licenseNo: string;
  location: string;
  operationStatus: 'Active' | 'Inactive' | 'Planning';
  acquisitionDate: string;
  acquisitionMode: string;
  totalCost: string;
  paymentInYear: string;
  sourceOfFinance: string;
  acquiredFromName: string;
  acquiredFromCID: string;
  documents: DocumentFile[];
}

interface Income {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  grossSalary: string;
  businessConsultancy: string;
  rental: string;
  dividends: string;
  hiringCharges: string;
  interestEarned: string;
  saleOfCashCrop: string;
  travelAllowance: string;
  outsidePositionIncome: string;
  others: string;
  documents: DocumentFile[];
}

interface Liability {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: 'Bank Loan' | 'Private Borrowing';
  totalAmountSanctioned: string;
  actualAmountReceived: string;
  lenderDetails: string;
  borrowingDate: string;
  documents: DocumentFile[];
}

interface EducationalExpense {
  id: string;
  relationship: string;
  name: string;
  amount: string;
  institution: string;
  institutionPlace: string;
  courseLevel: string;
  documents: DocumentFile[];
}

interface OtherExpense {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  category: 'Rental' | 'Insurance' | 'Loan Repayment' | 'Mandatory Salary Deduction' | 'Travel' | 'Vacation' | 'Wedding' | 'Donation' | 'Maintenance' | 'Medical Treatment' | 'Gifts' | 'Religious Rituals' | 'Other';
  rentalLocation: string;
  rentalAmount: string;
  insuranceType: string;
  insuranceAmount: string;
  loanRepaymentBorrower: string;
  loanRepaymentAmount: string;
  mandatoryDeductionType: string;
  mandatoryDeductionAmount: string;
  otherDetails: string;
  otherAmount: string;
  documents: DocumentFile[];
}

interface SkippedSections {
  family: boolean;
  additionalJobs: boolean;
  postEmployment: boolean;
  immovableProperties: boolean;
  sharesStocks: boolean;
  vehicles: boolean;
  virtualAssets: boolean;
  personalSavings: boolean;
  convertibleAssets: boolean;
  commercialActivities: boolean;
  liabilities: boolean;
  educationalExpenses: boolean;
  otherExpenses: boolean;
}

// ==================== REUSABLE COMPONENTS ====================
const SectionHeader = ({ title, subtitle, note }: { title: string, subtitle?: string, note?: string }) => (
  <div className="mb-6 border-b pb-3">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-primary-dark">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>
      {note && (
        <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
          <InfoIcon className="w-3 h-3 mr-1" />
          {note}
        </div>
      )}
    </div>
  </div>
);

const FormInput = ({ label, id, note, required, ...props }: any) => (
  <div>
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="block text-xs font-semibold text-text-secondary mb-1 uppercase">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {note && <span className="text-xs text-gray-500">{note}</span>}
    </div>
    <input
      id={id}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
    />
  </div>
);

const FormSelect = ({ label, id, children, note, required, ...props }: any) => (
  <div>
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="block text-xs font-semibold text-text-secondary mb-1 uppercase">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {note && <span className="text-xs text-gray-500">{note}</span>}
    </div>
    <select
      id={id}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
    >
      {children}
    </select>
  </div>
);

const FormTextarea = ({ label, id, note, required, ...props }: any) => (
  <div>
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="block text-xs font-semibold text-text-secondary mb-1 uppercase">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {note && <span className="text-xs text-gray-500">{note}</span>}
    </div>
    <textarea
      id={id}
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px]"
    />
  </div>
);

const FileUpload = ({ documents, onFileChange, onFileRemove, maxFiles = 5 }: { documents: DocumentFile[], onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onFileRemove: (fileId: string) => void, maxFiles?: number }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
      <div className="flex flex-wrap gap-2 mb-2">
        {documents.map(file => (
          <div key={file.id} className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 border border-blue-200">
            <PaperClipIcon className="w-3 h-3 mr-2 text-blue-500" />
            <span className="text-xs text-blue-700 max-w-[150px] truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => onFileRemove(file.id)}
              className="ml-2 text-blue-400 hover:text-blue-600"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center text-xs font-medium text-accent hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={documents.length >= maxFiles}
        >
          <PaperClipIcon className="w-4 h-4 mr-1" />
          Attach Evidence {documents.length >= maxFiles ? '(Max reached)' : ''}
        </button>
        <span className="text-xs text-gray-500">Max {maxFiles} files</span>
      </div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
    </div>
  );
};

const ItemCard = ({ title, onRemove, children, warning }: { title: string, onRemove: () => void, children: React.ReactNode, warning?: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 relative">
    {warning && (
      <div className="absolute top-2 right-2">
        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
          <AlertIcon className="w-3 h-3 mr-1" />
          {warning}
        </div>
      </div>
    )}
    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
      <h4 className="text-sm font-bold text-gray-700">{title}</h4>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

const InfoBox = ({ children, type = 'info' }: { children: React.ReactNode, type?: 'info' | 'warning' | 'error' }) => {
  const bgColor = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200'
  };
  
  const textColor = {
    info: 'text-blue-700',
    warning: 'text-yellow-700',
    error: 'text-red-700'
  };
  
  return (
    <div className={`${bgColor[type]} border-l-4 ${type === 'info' ? 'border-blue-500' : type === 'warning' ? 'border-yellow-500' : 'border-red-500'} p-4 mb-4 rounded-r`}>
      <div className="flex items-start">
        <InfoIcon className={`w-5 h-5 mr-2 mt-0.5 ${textColor[type]}`} />
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};

const SkipSectionButton = ({ onSkip }: { onSkip: () => void }) => (
  <button
    onClick={onSkip}
    className="text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1 rounded"
  >
    Nothing to declare
  </button>
);

const UnskipSectionButton = ({ onUnskip }: { onUnskip: () => void }) => (
  <button
    onClick={onUnskip}
    className="text-sm font-medium text-primary hover:underline ml-4"
  >
    Undo
  </button>
);

// ==================== MAIN COMPONENT ====================
interface FileNewPageProps {
  isProcessingForAdmin?: boolean;
  targetOfficialName?: string;
  targetOfficialId?: string;
}

const FileNewPage: React.FC<FileNewPageProps> = ({
  isProcessingForAdmin = false,
  targetOfficialName,
  targetOfficialId
}) => {
  const steps = [
    "Guidelines",
    "Personal Info",
    "Family Details",
    "Employment",
    "Immovable Assets",
    "Movable Assets",
    "Other Assets",
    "Income & Liabilities",
    "Expenditure",
    "Affidavit"
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [affidavitAgreed, setAffidavitAgreed] = useState(false);
  const [hardCopyFile, setHardCopyFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [skippedSections, setSkippedSections] = useState<SkippedSections>({
    family: false,
    additionalJobs: false,
    postEmployment: false,
    immovableProperties: false,
    sharesStocks: false,
    vehicles: false,
    virtualAssets: false,
    personalSavings: false,
    convertibleAssets: false,
    commercialActivities: false,
    liabilities: false,
    educationalExpenses: false,
    otherExpenses: false
  });

  const currentYear = new Date().getFullYear();
  const incomeYear = `${currentYear - 1}`;

  // ==================== DATA STATES ====================
  const [personal, setPersonal] = useState<PersonalInfo>({
    reason: 'Annual Declaration',
    name: targetOfficialName || 'Kinley Wangchuk',
    cid: targetOfficialId || '123456789',
    dob: '1985-06-15',
    sex: 'Male',
    maritalStatus: 'Married',
    permanentAddress: 'Thimphu Thromde, Chang Gewog',
    employmentDetails: 'EID-001/Civil Servant/Central Agency/Ministry of Finance/Thimphu/Revenue Officer/Level 5/Regular',
    contact: 'kinley.wangchuk@gov.bt, 17123456, 02-123456',
    spouseCovered: false
  });

  const [family, setFamily] = useState<FamilyMember[]>([
  {
    id: generateId(),
    relationship: 'Spouse',
    name: 'Sonam Dema',
    cid: '987654321',
    dob: '1987-03-22',
    sex: 'Female',
    maritalStatus: 'Married',
    permanentAddress: 'Thimphu Thromde, Chang Gewog',
    employment: 'EID-002/Private Sector/Bank of Bhutan/Thimphu/Teller/Level 4',
    contact: 'sonam.dema@bob.bt, 17654321',
    isCovered: false,
    documents: []  // Added this
  }
  ]);

  const [addJobs, setAddJobs] = useState<AdditionalJob[]>([
    {
      id: generateId(),
      relationship: 'Self',
      name: 'Kinley Wangchuk',
      cid: '123456789',
      agency: 'Bhutan Chamber of Commerce',
      positionTitle: 'Advisory Board Member',
      hasIncome: 'Yes',
      incomeAmount: '50000',
      documents: []
    }
  ]);

  const [postJobs, setPostJobs] = useState<PostEmployment[]>([
    {
      id: generateId(),
      relationship: 'Self',
      name: 'Kinley Wangchuk',
      cid: '123456789',
      newPositionAgency: 'Royal Monetary Authority',
      newPositionTitle: 'Consultant',
      newCommercialActivity: '',
      offerAccepted: 'No',
      documents: []
    }
  ]);

  const [immovable, setImmovable] = useState<ImmovableAsset[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Land',
      thramNo: 'T-12345',
      plotNo: 'P-67',
      houseNo: '',
      size: '10 Decimal',
      location: 'Punakha, Chubu',
      acquisitionDate: '2018-05-15',
      acquisitionMode: 'Purchase',
      totalCost: '500000',
      paymentInYear: '0',
      sourceOfFinance: 'Savings',
      acquiredFrom: 'Dorji Wangchuk (CID: 112233445)',
      registeredOwnerName: 'Kinley Wangchuk',
      registeredOwnerCID: '123456789',
      documents: []
    },
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'House',
      thramNo: 'T-67890',
      plotNo: 'P-12',
      houseNo: 'H-45',
      size: '3 Storey',
      location: 'Thimphu, Olakha',
      acquisitionDate: '2020-11-20',
      acquisitionMode: 'Construction',
      totalCost: '3500000',
      paymentInYear: '500000',
      sourceOfFinance: 'Bank Loan',
      acquiredFrom: 'Self-constructed',
      registeredOwnerName: 'Kinley Wangchuk',
      registeredOwnerCID: '123456789',
      documents: []
    }
  ]);

  const [shares, setShares] = useState<ShareStock[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      company: 'Bhutan Insurance Limited',
      companyAddress: 'Thimphu, Bhutan',
      numberOfShares: '100',
      transactionId: 'TRX-2023-456',
      acquisitionDate: '2023-03-10',
      acquisitionMode: 'Purchase',
      totalCost: '100000',
      sourceOfFinance: 'Savings',
      acquiredFrom: 'Stock Market',
      documents: []
    }
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Vehicle',
      make: 'Toyota',
      registrationNo: 'BT-1-2345',
      model: 'Land Cruiser Prado',
      acquisitionDate: '2021-08-15',
      acquisitionMode: 'Purchase',
      totalCost: '4500000',
      sourceOfFinance: 'Bank Loan',
      acquiredFrom: 'Motozone, Thimphu',
      registeredOwnerName: 'Kinley Wangchuk',
      registeredOwnerCID: '123456789',
      documents: []
    }
  ]);

  const [virtual, setVirtual] = useState<VirtualAsset[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Bitcoin',
      quantity: '0.5',
      acquisitionDate: '2022-12-05',
      acquisitionMode: 'Online Purchase',
      totalCost: '100000',
      paymentInYear: '50000',
      sourceOfFinance: 'Savings',
      acquiredFrom: 'Binance Exchange',
      documents: []
    }
  ]);

  const [savings, setSavings] = useState<PersonalSaving[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Bank Deposit',
      bankName: 'Bank of Bhutan',
      bankLocation: 'Thimphu, Bhutan',
      accountType: 'Savings Account',
      accountNumber: '123456789012',
      balanceAmount: '750000',
      sourceOfSaving: 'Salary Savings',
      documents: []
    }
  ]);

  const [convertible, setConvertible] = useState<ConvertibleAsset[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Gold',
      acquisitionDate: '2020-01-15',
      acquisitionMode: 'Purchase',
      totalCost: '150000',
      paymentInYear: '0',
      sourceOfFinance: 'Savings',
      acquiredFrom: 'City Gold, Thimphu',
      documents: []
    }
  ]);

  const [commercial, setCommercial] = useState<CommercialActivity[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Commercial',
      activityType: 'Stationery Shop',
      licenseNo: 'TRD-2020-789',
      location: 'Thimphu',
      operationStatus: 'Active',
      acquisitionDate: '2020-06-01',
      acquisitionMode: 'Purchase',
      totalCost: '800000',
      paymentInYear: '0',
      sourceOfFinance: 'Business Loan',
      acquiredFromName: 'Tshering Dorji',
      acquiredFromCID: '334455667',
      documents: []
    }
  ]);

  const [income, setIncome] = useState<Income[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      grossSalary: '720000',
      businessConsultancy: '60000',
      rental: '240000',
      dividends: '10000',
      hiringCharges: '0',
      interestEarned: '5000',
      saleOfCashCrop: '0',
      travelAllowance: '30000',
      outsidePositionIncome: '50000',
      others: '0',
      documents: []
    }
  ]);

  const [liabilities, setLiabilities] = useState<Liability[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Bank Loan',
      totalAmountSanctioned: '3000000',
      actualAmountReceived: '3000000',
      lenderDetails: 'Bank of Bhutan, Thimphu Branch',
      borrowingDate: '2021-07-01',
      documents: []
    }
  ]);

  const [eduExp, setEduExp] = useState<EducationalExpense[]>([
    {
      id: generateId(),
      relationship: 'Son',
      name: 'Jigme Dorji',
      amount: '120000',
      institution: 'Yangchenphug Higher Secondary School',
      institutionPlace: 'Thimphu',
      courseLevel: 'Class 12',
      documents: []
    }
  ]);

  const [otherExp, setOtherExp] = useState<OtherExpense[]>([
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      category: 'Insurance',
      rentalLocation: '',
      rentalAmount: '',
      insuranceType: 'Life Insurance',
      insuranceAmount: '30000',
      loanRepaymentBorrower: '',
      loanRepaymentAmount: '',
      mandatoryDeductionType: '',
      mandatoryDeductionAmount: '',
      otherDetails: '',
      otherAmount: '',
      documents: []
    },
    {
      id: generateId(),
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      category: 'Travel',
      rentalLocation: '',
      rentalAmount: '',
      insuranceType: '',
      insuranceAmount: '',
      loanRepaymentBorrower: '',
      loanRepaymentAmount: '',
      mandatoryDeductionType: '',
      mandatoryDeductionAmount: '',
      otherDetails: 'Family vacation to Phuentsholing',
      otherAmount: '50000',
      documents: []
    }
  ]);

  // ==================== HELPERS ====================
  const getRelationOptions = () => (
    <>
      <option value="Self">Self ({personal.name})</option>
      {family.map(f => (
        <option key={f.id} value={f.relationship}>
          {f.relationship} ({f.name})
        </option>
      ))}
    </>
  );

  // Fixed handleAdd function
  const handleAdd = <T extends { id: string; documents: DocumentFile[] }>(
  setter: React.Dispatch<React.SetStateAction<T[]>>, 
  initial: Omit<T, 'id' | 'documents'>
) => {
  const newItem = {
    ...initial,
    id: generateId(),
    documents: []
  } as unknown as T;
  setter(prev => [...prev, newItem]);
};

  const handleRemove = <T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>, 
    id: string
  ) => {
    setter(prev => prev.filter(i => i.id !== id));
  };

  const handleChange = <T extends { id: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>, 
    id: string, 
    field: keyof T, 
    value: any
  ) => {
    setter(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleFile = <T extends { id: string; documents: DocumentFile[] }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>, 
    id: string, 
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((f: any) =>
        Object.assign(f, { id: generateId() })
      );
      setter(prev =>
        prev.map(i =>
          i.id === id ? { ...i, documents: [...i.documents, ...files] } as T : i
        )
      );
    }
  };

  const handleFileRemove = <T extends { id: string; documents: DocumentFile[] }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>, 
    itemId: string, 
    fileId: string
  ) => {
    setter(prev =>
      prev.map(i =>
        i.id === itemId
          ? { ...i, documents: i.documents.filter(d => d.id !== fileId) } as T
          : i
      )
    );
  };

  // ==================== SKIP SECTION HANDLERS ====================
  const handleSkipSection = (sectionKey: keyof SkippedSections) => {
    setSkippedSections(prev => ({
      ...prev,
      [sectionKey]: true
    }));
    
    if (sectionKey === 'family') {
      setPersonal(prev => ({ ...prev, spouseCovered: false }));
    }
    
    alert(`Section marked as "Nothing to declare". You can add items later if needed.`);
  };

  const handleUnskipSection = (sectionKey: keyof SkippedSections) => {
    setSkippedSections(prev => ({
      ...prev,
      [sectionKey]: false
    }));
  };

  // ==================== RENDER SKIPPED SECTION ====================
  const renderSkippedSection = (title: string, subtitle: string, sectionKey: keyof SkippedSections) => (
    <div>
      <SectionHeader 
        title={title} 
        subtitle={subtitle}
        note="Marked as nothing to declare"
      />
      
      <InfoBox type="warning">
        <div className="flex justify-between items-center">
          <span>You have marked this section as "Nothing to declare".</span>
          <UnskipSectionButton onUnskip={() => handleUnskipSection(sectionKey)} />
        </div>
      </InfoBox>
      
      <div className="text-center py-8 text-gray-500">
        <p>No items to declare for this section.</p>
        <p className="text-sm mt-2">If you need to add items, click "Undo" above.</p>
      </div>
    </div>
  );

  // ==================== SECTION 4: EMPLOYMENT ====================
  const renderEmployment = () => (
    <div className="space-y-8">
      {/* Additional Jobs */}
      {skippedSections.additionalJobs ? (
        renderSkippedSection("Additional Job / Employment", "Apart from current office", 'additionalJobs')
      ) : (
        <div>
          <SectionHeader
            title="Additional Job / Employment"
            subtitle="Apart from current office (Paid or Unpaid)"
            note={`${addJobs.length} job(s) declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Include any additional employment, consultancy, or board positions held during the income year.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('additionalJobs')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {addJobs.map(job => (
              <ItemCard
                key={job.id}
                title={`${job.positionTitle} at ${job.agency}`}
                onRemove={() => handleRemove(setAddJobs, job.id)}
              >
                <FormSelect
                  label="Person"
                  value={job.relationship}
                  onChange={(e: any) => handleChange(setAddJobs, job.id, 'relationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormInput
                  label="Agency / Organization"
                  value={job.agency}
                  onChange={(e: any) => handleChange(setAddJobs, job.id, 'agency', e.target.value)}
                  placeholder="Name of company or organization"
                />
                <FormInput
                  label="Position Title"
                  value={job.positionTitle}
                  onChange={(e: any) => handleChange(setAddJobs, job.id, 'positionTitle', e.target.value)}
                />
                <FormSelect
                  label="Income Received?"
                  value={job.hasIncome}
                  onChange={(e: any) => handleChange(setAddJobs, job.id, 'hasIncome', e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </FormSelect>
                {job.hasIncome === 'Yes' && (
                  <FormInput
                    label="Income Amount (Nu.)"
                    type="number"
                    value={job.incomeAmount}
                    onChange={(e: any) => handleChange(setAddJobs, job.id, 'incomeAmount', e.target.value)}
                    placeholder="Annual amount"
                  />
                )}
                <div className="md:col-span-3">
                  <FileUpload
                    documents={job.documents}
                    onFileChange={(e) => handleFile(setAddJobs, job.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setAddJobs, job.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<AdditionalJob>(setAddJobs, {
                  relationship: 'Self',
                  name: personal.name,
                  cid: personal.cid,
                  agency: '',
                  positionTitle: '',
                  hasIncome: 'No',
                  incomeAmount: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Additional Job
            </button>
          </div>
        </div>
      )}

      {/* Post Employment */}
      {skippedSections.postEmployment ? (
        renderSkippedSection("Post-Employment Arrangement", "Plans after separation", 'postEmployment')
      ) : (
        <div>
          <SectionHeader
            title="Post-Employment Arrangement / Plan"
            subtitle="Plans after separation from current office"
            note={`${postJobs.length} plan(s) declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Include any future employment plans after leaving current position.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('postEmployment')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {postJobs.map(job => (
              <ItemCard
                key={job.id}
                title={`Post-employment: ${job.newPositionTitle || 'New Plan'}`}
                onRemove={() => handleRemove(setPostJobs, job.id)}
              >
                <FormSelect
                  label="Person"
                  value={job.relationship}
                  onChange={(e: any) => handleChange(setPostJobs, job.id, 'relationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormInput
                  label="New Position Agency"
                  value={job.newPositionAgency}
                  onChange={(e: any) => handleChange(setPostJobs, job.id, 'newPositionAgency', e.target.value)}
                  placeholder="Name of organization"
                />
                <FormInput
                  label="New Position Title"
                  value={job.newPositionTitle}
                  onChange={(e: any) => handleChange(setPostJobs, job.id, 'newPositionTitle', e.target.value)}
                />
                <FormInput
                  label="New Commercial Activity"
                  value={job.newCommercialActivity}
                  onChange={(e: any) => handleChange(setPostJobs, job.id, 'newCommercialActivity', e.target.value)}
                  placeholder="Type of business/activity"
                />
                <FormSelect
                  label="Any offer or acceptance made?"
                  value={job.offerAccepted}
                  onChange={(e: any) => handleChange(setPostJobs, job.id, 'offerAccepted', e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </FormSelect>
                <div className="md:col-span-3">
                  <FileUpload
                    documents={job.documents}
                    onFileChange={(e) => handleFile(setPostJobs, job.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setPostJobs, job.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<PostEmployment>(setPostJobs, {
                  relationship: 'Self',
                  name: personal.name,
                  cid: personal.cid,
                  newPositionAgency: '',
                  newPositionTitle: '',
                  newCommercialActivity: '',
                  offerAccepted: 'No'
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Post-Employment Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== SECTION 5: MOVABLE ASSETS ====================
  const renderMovable = () => (
    <div className="space-y-8">
      {/* Shares and Stocks */}
      {skippedSections.sharesStocks ? (
        renderSkippedSection("Shares and Stocks", "Company shares and stock holdings", 'sharesStocks')
      ) : (
        <div>
          <SectionHeader
            title="Shares and Stocks"
            subtitle="Company shares and stock holdings (Sec 6.2)"
            note={`${shares.length} holding(s) declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Declare all shares and stocks acquired during the income year.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('sharesStocks')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {shares.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.numberOfShares} shares in ${item.company}`}
                onRemove={() => handleRemove(setShares, item.id)}
              >
                <FormSelect
                  label="Owner"
                  value={item.ownerRelationship}
                  onChange={(e: any) => handleChange(setShares, item.id, 'ownerRelationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormInput
                  label="Company Name"
                  value={item.company}
                  onChange={(e: any) => handleChange(setShares, item.id, 'company', e.target.value)}
                />
                <FormInput
                  label="Company Address"
                  value={item.companyAddress}
                  onChange={(e: any) => handleChange(setShares, item.id, 'companyAddress', e.target.value)}
                />
                <FormInput
                  label="Number of Shares"
                  type="number"
                  value={item.numberOfShares}
                  onChange={(e: any) => handleChange(setShares, item.id, 'numberOfShares', e.target.value)}
                />
                <FormInput
                  label="Total Cost (Nu.)"
                  type="number"
                  value={item.totalCost}
                  onChange={(e: any) => handleChange(setShares, item.id, 'totalCost', e.target.value)}
                />
                <FormInput
                  label="Date of Acquisition"
                  type="date"
                  value={item.acquisitionDate}
                  onChange={(e: any) => handleChange(setShares, item.id, 'acquisitionDate', e.target.value)}
                />
                <FormSelect
                  label="Mode of Acquisition"
                  value={item.acquisitionMode}
                  onChange={(e: any) => handleChange(setShares, item.id, 'acquisitionMode', e.target.value)}
                >
                  <option value="Purchase">Purchase</option>
                  <option value="Gift">Gift</option>
                  <option value="Inheritance">Inheritance</option>
                  <option value="Bonus">Bonus</option>
                </FormSelect>
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setShares, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setShares, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<ShareStock>(setShares, {
                  ownerRelationship: 'Self',
                  ownerName: personal.name,
                  ownerCid: personal.cid,
                  company: '',
                  companyAddress: '',
                  numberOfShares: '',
                  transactionId: '',
                  acquisitionDate: '',
                  acquisitionMode: '',
                  totalCost: '',
                  sourceOfFinance: '',
                  acquiredFrom: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Shares/Stocks
            </button>
          </div>
        </div>
      )}

      {/* Vehicles and Machineries */}
      {skippedSections.vehicles ? (
        renderSkippedSection("Vehicles and Machineries", "Cars, trucks, equipment", 'vehicles')
      ) : (
        <div>
          <SectionHeader
            title="Vehicles and Machineries"
            subtitle="Cars, trucks, equipment, etc. (Sec 6.3)"
            note={`${vehicles.length} vehicle(s) declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Declare all vehicles and machinery acquired during the income year.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('vehicles')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {vehicles.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.make} ${item.model} (${item.registrationNo})`}
                onRemove={() => handleRemove(setVehicles, item.id)}
              >
                <FormSelect
                  label="Owner"
                  value={item.ownerRelationship}
                  onChange={(e: any) => handleChange(setVehicles, item.id, 'ownerRelationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormSelect
                  label="Type"
                  value={item.type}
                  onChange={(e: any) => handleChange(setVehicles, item.id, 'type', e.target.value)}
                >
                  <option value="Vehicle">Vehicle</option>
                  <option value="Machinery">Machinery</option>
                  <option value="Equipment">Equipment</option>
                </FormSelect>
                <FormInput
                  label="Make/Brand"
                  value={item.make}
                  onChange={(e: any) => handleChange(setVehicles, item.id, 'make', e.target.value)}
                />
                <FormInput
                  label="Registration No."
                  value={item.registrationNo}
                  onChange={(e: any) => handleChange(setVehicles, item.id, 'registrationNo', e.target.value)}
                />
                <FormInput
                  label="Model"
                  value={item.model}
                  onChange={(e: any) => handleChange(setVehicles, item.id, 'model', e.target.value)}
                />
                <FormInput
                  label="Total Cost (Nu.)"
                  type="number"
                  value={item.totalCost}
                  onChange={(e: any) => handleChange(setVehicles, item.id, 'totalCost', e.target.value)}
                />
                <FormInput
                  label="Date of Acquisition"
                  type="date"
                  value={item.acquisitionDate}
                  onChange={(e: any) => handleChange(setVehicles, item.id, 'acquisitionDate', e.target.value)}
                />
                <FormInput
                  label="Registered Owner Name"
                  value={item.registeredOwnerName}
                  onChange={(e: any) => handleChange(setVehicles, item.id, 'registeredOwnerName', e.target.value)}
                />
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setVehicles, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setVehicles, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<Vehicle>(setVehicles, {
                  ownerRelationship: 'Self',
                  ownerName: personal.name,
                  ownerCid: personal.cid,
                  type: 'Vehicle',
                  make: '',
                  registrationNo: '',
                  model: '',
                  acquisitionDate: '',
                  acquisitionMode: '',
                  totalCost: '',
                  sourceOfFinance: '',
                  acquiredFrom: '',
                  registeredOwnerName: personal.name,
                  registeredOwnerCID: personal.cid
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Vehicle/Machinery
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== SECTION 6: OTHER ASSETS ====================
  const renderOtherAssets = () => (
    <div className="space-y-8">
      {/* Virtual Assets */}
      {skippedSections.virtualAssets ? (
        renderSkippedSection("Virtual Assets", "Cryptocurrencies and digital assets", 'virtualAssets')
      ) : (
        <div>
          <SectionHeader
            title="Virtual Assets"
            subtitle="Cryptocurrencies and digital assets (Sec 6.4)"
            note={`${virtual.length} asset(s) declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Include all cryptocurrencies like Bitcoin, Ethereum, etc. acquired during the year.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('virtualAssets')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {virtual.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.quantity} ${item.type}`}
                onRemove={() => handleRemove(setVirtual, item.id)}
              >
                <FormSelect
                  label="Owner"
                  value={item.ownerRelationship}
                  onChange={(e: any) => handleChange(setVirtual, item.id, 'ownerRelationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormSelect
                  label="Type of Virtual Asset"
                  value={item.type}
                  onChange={(e: any) => handleChange(setVirtual, item.id, 'type', e.target.value)}
                >
                  <option value="Bitcoin">Bitcoin</option>
                  <option value="Litecoin">Litecoin</option>
                  <option value="Ether">Ether</option>
                  <option value="Other">Other</option>
                </FormSelect>
                <FormInput
                  label="Quantity"
                  type="number"
                  step="0.00000001"
                  value={item.quantity}
                  onChange={(e: any) => handleChange(setVirtual, item.id, 'quantity', e.target.value)}
                />
                <FormInput
                  label="Total Cost (Nu.)"
                  type="number"
                  value={item.totalCost}
                  onChange={(e: any) => handleChange(setVirtual, item.id, 'totalCost', e.target.value)}
                />
                <FormInput
                  label="Date of Acquisition"
                  type="date"
                  value={item.acquisitionDate}
                  onChange={(e: any) => handleChange(setVirtual, item.id, 'acquisitionDate', e.target.value)}
                />
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setVirtual, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setVirtual, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<VirtualAsset>(setVirtual, {
                  ownerRelationship: 'Self',
                  ownerName: personal.name,
                  ownerCid: personal.cid,
                  type: 'Bitcoin',
                  quantity: '',
                  acquisitionDate: '',
                  acquisitionMode: '',
                  totalCost: '',
                  paymentInYear: '',
                  sourceOfFinance: '',
                  acquiredFrom: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Virtual Asset
            </button>
          </div>
        </div>
      )}

      {/* Personal Savings */}
      {skippedSections.personalSavings ? (
        renderSkippedSection("Personal Savings", "Bank deposits, cash holdings", 'personalSavings')
      ) : (
        <div>
          <SectionHeader
            title="Personal Savings"
            subtitle="Bank deposits, cash holdings (Sec 6.5)"
            note={`${savings.length} account(s) declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Declare savings if total exceeds one month's gross salary. Use balance as of Dec 31.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('personalSavings')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {savings.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.type} - Nu. ${parseInt(item.balanceAmount || '0').toLocaleString()}`}
                onRemove={() => handleRemove(setSavings, item.id)}
              >
                <FormSelect
                  label="Owner"
                  value={item.ownerRelationship}
                  onChange={(e: any) => handleChange(setSavings, item.id, 'ownerRelationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormSelect
                  label="Type of Savings"
                  value={item.type}
                  onChange={(e: any) => handleChange(setSavings, item.id, 'type', e.target.value)}
                >
                  <option value="Bank Deposit">Bank Deposit</option>
                  <option value="Cash in Hand">Cash in Hand</option>
                  <option value="Money Lent">Money Lent</option>
                  <option value="Foreign Exchange">Foreign Exchange</option>
                  <option value="Others">Others</option>
                </FormSelect>
                <FormInput
                  label="Bank/Institution Name"
                  value={item.bankName}
                  onChange={(e: any) => handleChange(setSavings, item.id, 'bankName', e.target.value)}
                />
                <FormInput
                  label="Account Number"
                  value={item.accountNumber}
                  onChange={(e: any) => handleChange(setSavings, item.id, 'accountNumber', e.target.value)}
                />
                <FormInput
                  label="Balance Amount (Nu.)"
                  type="number"
                  value={item.balanceAmount}
                  onChange={(e: any) => handleChange(setSavings, item.id, 'balanceAmount', e.target.value)}
                />
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setSavings, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setSavings, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<PersonalSaving>(setSavings, {
                  ownerRelationship: 'Self',
                  ownerName: personal.name,
                  ownerCid: personal.cid,
                  type: 'Bank Deposit',
                  bankName: '',
                  bankLocation: '',
                  accountType: '',
                  accountNumber: '',
                  balanceAmount: '',
                  sourceOfSaving: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Personal Saving
            </button>
          </div>
        </div>
      )}

      {/* Convertible Assets */}
      {skippedSections.convertibleAssets ? (
        renderSkippedSection("Convertible Assets", "Jewelry, gold, art, electronics", 'convertibleAssets')
      ) : (
        <div>
          <SectionHeader
            title="Convertible Assets"
            subtitle="Jewelry, gold, art, electronics > Nu. 100,000 (Sec 6.6)"
            note={`${convertible.length} item(s) declared`}
          />
          <InfoBox type="warning">
            <div className="flex justify-between items-center">
              <span>Declare only if total value exceeds Nu. 100,000.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('convertibleAssets')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {convertible.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.type} - Nu. ${parseInt(item.totalCost || '0').toLocaleString()}`}
                onRemove={() => handleRemove(setConvertible, item.id)}
                warning={parseInt(item.totalCost || '0') > 100000 ? 'High value item' : undefined}
              >
                <FormSelect
                  label="Owner"
                  value={item.ownerRelationship}
                  onChange={(e: any) => handleChange(setConvertible, item.id, 'ownerRelationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormSelect
                  label="Type of Asset"
                  value={item.type}
                  onChange={(e: any) => handleChange(setConvertible, item.id, 'type', e.target.value)}
                >
                  <option value="Jewelry">Jewelry</option>
                  <option value="Gold">Gold</option>
                  <option value="Art">Art</option>
                  <option value="Electronic Gadgets">Electronic Gadgets</option>
                  <option value="Others">Others</option>
                </FormSelect>
                <FormInput
                  label="Total Cost (Nu.)"
                  type="number"
                  value={item.totalCost}
                  onChange={(e: any) => handleChange(setConvertible, item.id, 'totalCost', e.target.value)}
                  note="Value should exceed Nu. 100,000"
                />
                <FormInput
                  label="Date of Acquisition"
                  type="date"
                  value={item.acquisitionDate}
                  onChange={(e: any) => handleChange(setConvertible, item.id, 'acquisitionDate', e.target.value)}
                />
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setConvertible, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setConvertible, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<ConvertibleAsset>(setConvertible, {
                  ownerRelationship: 'Self',
                  ownerName: personal.name,
                  ownerCid: personal.cid,
                  type: 'Jewelry',
                  acquisitionDate: '',
                  acquisitionMode: '',
                  totalCost: '',
                  paymentInYear: '',
                  sourceOfFinance: '',
                  acquiredFrom: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Convertible Asset
            </button>
          </div>
        </div>
      )}

      {/* Commercial Activities */}
      {skippedSections.commercialActivities ? (
        renderSkippedSection("Commercial Activities", "Businesses and intellectual property", 'commercialActivities')
      ) : (
        <div>
          <SectionHeader
            title="Commercial Activity & Intellectual Properties"
            subtitle="Businesses, enterprises, copyrights (Sec 6.7)"
            note={`${commercial.length} activity/ies declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Include all commercial activities and intellectual properties.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('commercialActivities')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {commercial.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.activityType} (${item.operationStatus})`}
                onRemove={() => handleRemove(setCommercial, item.id)}
              >
                <FormSelect
                  label="Owner"
                  value={item.ownerRelationship}
                  onChange={(e: any) => handleChange(setCommercial, item.id, 'ownerRelationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormSelect
                  label="Type of Activity"
                  value={item.type}
                  onChange={(e: any) => handleChange(setCommercial, item.id, 'type', e.target.value)}
                >
                  <option value="Commercial">Commercial</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                </FormSelect>
                <FormInput
                  label="Activity/Property Type"
                  value={item.activityType}
                  onChange={(e: any) => handleChange(setCommercial, item.id, 'activityType', e.target.value)}
                />
                <FormInput
                  label="License/Registration No"
                  value={item.licenseNo}
                  onChange={(e: any) => handleChange(setCommercial, item.id, 'licenseNo', e.target.value)}
                />
                <FormInput
                  label="Location"
                  value={item.location}
                  onChange={(e: any) => handleChange(setCommercial, item.id, 'location', e.target.value)}
                />
                <FormInput
                  label="Total Cost/Value (Nu.)"
                  type="number"
                  value={item.totalCost}
                  onChange={(e: any) => handleChange(setCommercial, item.id, 'totalCost', e.target.value)}
                />
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setCommercial, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setCommercial, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<CommercialActivity>(setCommercial, {
                  ownerRelationship: 'Self',
                  ownerName: personal.name,
                  ownerCid: personal.cid,
                  type: 'Commercial',
                  activityType: '',
                  licenseNo: '',
                  location: '',
                  operationStatus: 'Active',
                  acquisitionDate: '',
                  acquisitionMode: '',
                  totalCost: '',
                  paymentInYear: '',
                  sourceOfFinance: '',
                  acquiredFromName: '',
                  acquiredFromCID: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Commercial Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== SECTION 7: INCOME & LIABILITIES ====================
  const renderIncomeLiability = () => (
    <div className="space-y-8">
      {/* Income Statement */}
      <div>
        <SectionHeader
          title="Income Statement"
          subtitle="Sources of all income (Annual Gross) (Sec 6.8)"
          note={`${income.length} source(s) declared`}
        />
        <InfoBox type="info">
          <div className="flex justify-between items-center">
            <span>Provide annual gross income amounts for all sources. Include spouse/children if not filing separately.</span>
          </div>
        </InfoBox>

        <div className="space-y-4">
          {income.map(item => (
            <ItemCard
              key={item.id}
              title={`${item.ownerRelationship} Income - Nu. ${(
                parseInt(item.grossSalary || '0') +
                parseInt(item.businessConsultancy || '0') +
                parseInt(item.rental || '0') +
                parseInt(item.dividends || '0') +
                parseInt(item.hiringCharges || '0') +
                parseInt(item.interestEarned || '0') +
                parseInt(item.saleOfCashCrop || '0') +
                parseInt(item.travelAllowance || '0') +
                parseInt(item.outsidePositionIncome || '0') +
                parseInt(item.others || '0')
              ).toLocaleString()}`}
              onRemove={() => handleRemove(setIncome, item.id)}
            >
              <FormSelect
                label="Income Earner"
                value={item.ownerRelationship}
                onChange={(e: any) => handleChange(setIncome, item.id, 'ownerRelationship', e.target.value)}
              >
                {getRelationOptions()}
              </FormSelect>
              <FormInput
                label="Gross Employment Salary (Nu.)"
                type="number"
                value={item.grossSalary}
                onChange={(e: any) => handleChange(setIncome, item.id, 'grossSalary', e.target.value)}
                required
              />
              <FormInput
                label="Business/Consultancy (Nu.)"
                type="number"
                value={item.businessConsultancy}
                onChange={(e: any) => handleChange(setIncome, item.id, 'businessConsultancy', e.target.value)}
              />
              <FormInput
                label="Rental Income (Nu.)"
                type="number"
                value={item.rental}
                onChange={(e: any) => handleChange(setIncome, item.id, 'rental', e.target.value)}
              />
              <FormInput
                label="Dividends (Nu.)"
                type="number"
                value={item.dividends}
                onChange={(e: any) => handleChange(setIncome, item.id, 'dividends', e.target.value)}
              />
              <FormInput
                label="Hiring Charges (Nu.)"
                type="number"
                value={item.hiringCharges}
                onChange={(e: any) => handleChange(setIncome, item.id, 'hiringCharges', e.target.value)}
              />
              <FormInput
                label="Interest Earned (Nu.)"
                type="number"
                value={item.interestEarned}
                onChange={(e: any) => handleChange(setIncome, item.id, 'interestEarned', e.target.value)}
              />
              <FormInput
                label="TA/DA (Nu.)"
                type="number"
                value={item.travelAllowance}
                onChange={(e: any) => handleChange(setIncome, item.id, 'travelAllowance', e.target.value)}
              />
              <FormInput
                label="Other Income (Nu.)"
                type="number"
                value={item.others}
                onChange={(e: any) => handleChange(setIncome, item.id, 'others', e.target.value)}
              />
              <div className="md:col-span-3">
                <FileUpload
                  documents={item.documents}
                  onFileChange={(e) => handleFile(setIncome, item.id, e)}
                  onFileRemove={(fid) => handleFileRemove(setIncome, item.id, fid)}
                />
              </div>
            </ItemCard>
          ))}

          <button
            onClick={() =>
              handleAdd<Income>(setIncome, {
                ownerRelationship: 'Self',
                ownerName: personal.name,
                ownerCid: personal.cid,
                grossSalary: '',
                businessConsultancy: '',
                rental: '',
                dividends: '',
                hiringCharges: '',
                interestEarned: '',
                saleOfCashCrop: '',
                travelAllowance: '',
                outsidePositionIncome: '',
                others: ''
              })
            }
            className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Add Income Source
          </button>
        </div>
      </div>

      {/* Liabilities */}
      {skippedSections.liabilities ? (
        renderSkippedSection("Liabilities", "Loans and borrowings", 'liabilities')
      ) : (
        <div>
          <SectionHeader
            title="Liabilities"
            subtitle="Loans and borrowings (Sec 6.9)"
            note={`${liabilities.length} liability/ies declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Declare all loans and borrowings acquired during the income year.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('liabilities')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {liabilities.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.type} - Nu. ${parseInt(item.totalAmountSanctioned || '0').toLocaleString()}`}
                onRemove={() => handleRemove(setLiabilities, item.id)}
              >
                <FormSelect
                  label="Borrower"
                  value={item.ownerRelationship}
                  onChange={(e: any) => handleChange(setLiabilities, item.id, 'ownerRelationship', e.target.value)}
                >
                  {getRelationOptions()}
                </FormSelect>
                <FormSelect
                  label="Type of Liability"
                  value={item.type}
                  onChange={(e: any) => handleChange(setLiabilities, item.id, 'type', e.target.value)}
                >
                  <option value="Bank Loan">Bank Loan</option>
                  <option value="Private Borrowing">Private Borrowing</option>
                </FormSelect>
                <FormInput
                  label="Total Amount Sanctioned (Nu.)"
                  type="number"
                  value={item.totalAmountSanctioned}
                  onChange={(e: any) => handleChange(setLiabilities, item.id, 'totalAmountSanctioned', e.target.value)}
                />
                <FormInput
                  label="Lender Details"
                  value={item.lenderDetails}
                  onChange={(e: any) => handleChange(setLiabilities, item.id, 'lenderDetails', e.target.value)}
                  placeholder="Bank name or private lender details"
                />
                <FormInput
                  label="Date Borrowed"
                  type="date"
                  value={item.borrowingDate}
                  onChange={(e: any) => handleChange(setLiabilities, item.id, 'borrowingDate', e.target.value)}
                />
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setLiabilities, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setLiabilities, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<Liability>(setLiabilities, {
                  ownerRelationship: 'Self',
                  ownerName: personal.name,
                  ownerCid: personal.cid,
                  type: 'Bank Loan',
                  totalAmountSanctioned: '',
                  actualAmountReceived: '',
                  lenderDetails: '',
                  borrowingDate: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Liability
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== SECTION 8: EXPENDITURE ====================
  const renderExpenditure = () => (
    <div className="space-y-8">
      {/* Educational Expenditure */}
      {skippedSections.educationalExpenses ? (
        renderSkippedSection("Educational Expenditure", "Education expenses for family", 'educationalExpenses')
      ) : (
        <div>
          <SectionHeader
            title="Educational Expenditure"
            subtitle="Education expenses for family (Sec 6.10 A)"
            note={`${eduExp.length} expense(s) declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Include all education-related expenses for family members.</span>
              <SkipSectionButton onSkip={() => handleSkipSection('educationalExpenses')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {eduExp.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.name} - Nu. ${parseInt(item.amount || '0').toLocaleString()}`}
                onRemove={() => handleRemove(setEduExp, item.id)}
              >
                <FormInput
                  label="Name & Relationship"
                  value={item.name}
                  onChange={(e: any) => handleChange(setEduExp, item.id, 'name', e.target.value)}
                  placeholder="e.g., Sonam Dema (Spouse)"
                />
                <FormInput
                  label="Amount (Nu.)"
                  type="number"
                  value={item.amount}
                  onChange={(e: any) => handleChange(setEduExp, item.id, 'amount', e.target.value)}
                />
                <FormInput
                  label="School/College/University"
                  value={item.institution}
                  onChange={(e: any) => handleChange(setEduExp, item.id, 'institution', e.target.value)}
                />
                <FormInput
                  label="Course Level"
                  value={item.courseLevel}
                  onChange={(e: any) => handleChange(setEduExp, item.id, 'courseLevel', e.target.value)}
                  placeholder="e.g., Class 10, Bachelors"
                />
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setEduExp, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setEduExp, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<EducationalExpense>(setEduExp, {
                  relationship: '',
                  name: '',
                  amount: '',
                  institution: '',
                  institutionPlace: '',
                  courseLevel: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Educational Expense
            </button>
          </div>
        </div>
      )}

      {/* Other Expenditure */}
      {skippedSections.otherExpenses ? (
        renderSkippedSection("Other Expenditure", "Major expenses excluding daily subsistence", 'otherExpenses')
      ) : (
        <div>
          <SectionHeader
            title="Other Expenditure"
            subtitle="Major expenses excluding daily subsistence (Sec 6.10 B)"
            note={`${otherExp.length} expense(s) declared`}
          />
          <InfoBox type="info">
            <div className="flex justify-between items-center">
              <span>Do not include utility/daily subsistence costs (food, electricity, etc.).</span>
              <SkipSectionButton onSkip={() => handleSkipSection('otherExpenses')} />
            </div>
          </InfoBox>

          <div className="space-y-4">
            {otherExp.map(item => (
              <ItemCard
                key={item.id}
                title={`${item.category} - Nu. ${(
                  parseInt(item.rentalAmount || '0') +
                  parseInt(item.insuranceAmount || '0') +
                  parseInt(item.loanRepaymentAmount || '0') +
                  parseInt(item.mandatoryDeductionAmount || '0') +
                  parseInt(item.otherAmount || '0')
                ).toLocaleString()}`}
                onRemove={() => handleRemove(setOtherExp, item.id)}
              >
                <FormSelect
                  label="Expense Category"
                  value={item.category}
                  onChange={(e: any) => handleChange(setOtherExp, item.id, 'category', e.target.value)}
                >
                  <option value="Rental">Rental</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Loan Repayment">Loan Repayment</option>
                  <option value="Mandatory Salary Deduction">Mandatory Salary Deduction</option>
                  <option value="Travel">Travel</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Medical Treatment">Medical Treatment</option>
                  <option value="Other">Other</option>
                </FormSelect>
                
                {item.category === 'Rental' && (
                  <>
                    <FormInput
                      label="Rental Location"
                      value={item.rentalLocation}
                      onChange={(e: any) => handleChange(setOtherExp, item.id, 'rentalLocation', e.target.value)}
                    />
                    <FormInput
                      label="Rental Amount (Nu.)"
                      type="number"
                      value={item.rentalAmount}
                      onChange={(e: any) => handleChange(setOtherExp, item.id, 'rentalAmount', e.target.value)}
                    />
                  </>
                )}
                
                {item.category === 'Insurance' && (
                  <>
                    <FormInput
                      label="Insurance Type"
                      value={item.insuranceType}
                      onChange={(e: any) => handleChange(setOtherExp, item.id, 'insuranceType', e.target.value)}
                    />
                    <FormInput
                      label="Insurance Amount (Nu.)"
                      type="number"
                      value={item.insuranceAmount}
                      onChange={(e: any) => handleChange(setOtherExp, item.id, 'insuranceAmount', e.target.value)}
                    />
                  </>
                )}
                
                {item.category === 'Other' && (
                  <>
                    <FormInput
                      label="Details"
                      value={item.otherDetails}
                      onChange={(e: any) => handleChange(setOtherExp, item.id, 'otherDetails', e.target.value)}
                    />
                    <FormInput
                      label="Amount (Nu.)"
                      type="number"
                      value={item.otherAmount}
                      onChange={(e: any) => handleChange(setOtherExp, item.id, 'otherAmount', e.target.value)}
                    />
                  </>
                )}
                
                <div className="md:col-span-3">
                  <FileUpload
                    documents={item.documents}
                    onFileChange={(e) => handleFile(setOtherExp, item.id, e)}
                    onFileRemove={(fid) => handleFileRemove(setOtherExp, item.id, fid)}
                  />
                </div>
              </ItemCard>
            ))}

            <button
              onClick={() =>
                handleAdd<OtherExpense>(setOtherExp, {
                  ownerRelationship: 'Self',
                  ownerName: personal.name,
                  ownerCid: personal.cid,
                  category: 'Rental',
                  rentalLocation: '',
                  rentalAmount: '',
                  insuranceType: '',
                  insuranceAmount: '',
                  loanRepaymentBorrower: '',
                  loanRepaymentAmount: '',
                  mandatoryDeductionType: '',
                  mandatoryDeductionAmount: '',
                  otherDetails: '',
                  otherAmount: ''
                })
              }
              className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
            >
              <PlusIcon className="w-5 h-5 mr-1" /> Add Other Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== COMPLETE PREVIEW MODAL ====================
  const renderPreviewModal = () => {
    const skippedList = Object.entries(skippedSections)
      .filter(([_, skipped]) => skipped)
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    
    const totalIncome = income.reduce((sum, item) => 
      sum + parseInt(item.grossSalary || '0') + 
      parseInt(item.businessConsultancy || '0') + 
      parseInt(item.rental || '0') + 
      parseInt(item.dividends || '0') + 
      parseInt(item.hiringCharges || '0') + 
      parseInt(item.interestEarned || '0') + 
      parseInt(item.saleOfCashCrop || '0') + 
      parseInt(item.travelAllowance || '0') + 
      parseInt(item.outsidePositionIncome || '0') + 
      parseInt(item.others || '0'), 0);
    
    const totalLiabilities = liabilities.reduce((sum, item) => 
      sum + parseInt(item.totalAmountSanctioned || '0'), 0);
    
    const totalAssets = 
      immovable.reduce((sum, item) => sum + parseInt(item.totalCost || '0'), 0) +
      vehicles.reduce((sum, item) => sum + parseInt(item.totalCost || '0'), 0) +
      shares.reduce((sum, item) => sum + parseInt(item.totalCost || '0'), 0) +
      virtual.reduce((sum, item) => sum + parseInt(item.totalCost || '0'), 0) +
      savings.reduce((sum, item) => sum + parseInt(item.balanceAmount || '0'), 0) +
      convertible.reduce((sum, item) => sum + parseInt(item.totalCost || '0'), 0) +
      commercial.reduce((sum, item) => sum + parseInt(item.totalCost || '0'), 0);

    return (
      <div className="space-y-6 text-sm">
        <div className="bg-gray-100 p-4 rounded text-center font-bold text-gray-700 uppercase">
          Asset Declaration Form Preview - {personal.name}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Declaration Type:</strong> {personal.reason}</div>
          <div><strong>Income Year:</strong> {incomeYear}</div>
          <div><strong>CID:</strong> {personal.cid}</div>
          <div><strong>Marital Status:</strong> {personal.maritalStatus}</div>
          <div><strong>Spouse Covered:</strong> {personal.spouseCovered ? 'Yes' : 'No'}</div>
          <div><strong>Total Assets Value:</strong> Nu. {totalAssets.toLocaleString()}</div>
          <div><strong>Total Income:</strong> Nu. {totalIncome.toLocaleString()}</div>
          <div><strong>Total Liabilities:</strong> Nu. {totalLiabilities.toLocaleString()}</div>
        </div>
        
        {skippedList.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-bold mb-2 text-yellow-700">Skipped Sections:</h4>
            <ul className="space-y-1">
              {skippedList.map(section => (
                <li key={section} className="flex items-center">
                  <AlertIcon className="w-3 h-3 mr-2 text-yellow-600" />
                  {section}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="border-t pt-4">
          <h4 className="font-bold mb-2">Summary of Entries:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <strong>Family Members:</strong> {skippedSections.family ? '0 (Skipped)' : family.length}
            </div>
            <div>
              <strong>Immovable Properties:</strong> {skippedSections.immovableProperties ? '0 (Skipped)' : immovable.length}
            </div>
            <div>
              <strong>Vehicles:</strong> {skippedSections.vehicles ? '0 (Skipped)' : vehicles.length}
            </div>
            <div>
              <strong>Shares/Stocks:</strong> {skippedSections.sharesStocks ? '0 (Skipped)' : shares.length}
            </div>
            <div>
              <strong>Income Sources:</strong> {income.length}
            </div>
            <div>
              <strong>Liabilities:</strong> {skippedSections.liabilities ? '0 (Skipped)' : liabilities.length}
            </div>
            <div>
              <strong>Educational Expenses:</strong> {skippedSections.educationalExpenses ? '0 (Skipped)' : eduExp.length}
            </div>
            <div>
              <strong>Other Expenses:</strong> {skippedSections.otherExpenses ? '0 (Skipped)' : otherExp.length}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-bold mb-2">Declaration Status:</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Sections:</span>
              <span>{Object.keys(skippedSections).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Sections Skipped:</span>
              <span className="text-yellow-600">{skippedList.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Sections Completed:</span>
              <span className="text-green-600">{Object.keys(skippedSections).length - skippedList.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Attachments:</span>
              <span>
                {[
                  ...addJobs.flatMap(j => j.documents),
                  ...postJobs.flatMap(j => j.documents),
                  ...immovable.flatMap(i => i.documents),
                  ...shares.flatMap(s => s.documents),
                  ...vehicles.flatMap(v => v.documents)
                ].length} files
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-4">
          <button
            onClick={() => setPreviewModalOpen(false)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Close Preview
          </button>
        </div>
      </div>
    );
  };

  // ==================== NAVIGATION ====================
  const handleNext = () => {
    const currentStepKey = steps[currentStep];
    
    if (currentStep === 1 && !personal.name.trim()) {
      alert("Please enter your name before proceeding.");
      return;
    }
    
    setCompletedSteps(prev => new Set(prev).add(currentStepKey));

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1 && affidavitAgreed) {
      if (isProcessingForAdmin && !hardCopyFile) {
        alert("Please upload the signed hard copy before submitting.");
        return;
      }
      
      const skippedCount = Object.values(skippedSections).filter(Boolean).length;
      if (skippedCount > 0) {
        const confirmMessage = `You have marked ${skippedCount} section(s) as "Nothing to declare". Are you sure you want to submit?`;
        if (!window.confirm(confirmMessage)) {
          return;
        }
      }
      
      submitDeclaration();
    }
  };

  const submitDeclaration = () => {
    const submissionData = {
      personal,
      family: skippedSections.family ? [] : family,
      additionalJobs: skippedSections.additionalJobs ? [] : addJobs,
      postEmployment: skippedSections.postEmployment ? [] : postJobs,
      immovableProperties: skippedSections.immovableProperties ? [] : immovable,
      sharesStocks: skippedSections.sharesStocks ? [] : shares,
      vehicles: skippedSections.vehicles ? [] : vehicles,
      virtualAssets: skippedSections.virtualAssets ? [] : virtual,
      personalSavings: skippedSections.personalSavings ? [] : savings,
      convertibleAssets: skippedSections.convertibleAssets ? [] : convertible,
      commercialActivities: skippedSections.commercialActivities ? [] : commercial,
      income,
      liabilities: skippedSections.liabilities ? [] : liabilities,
      educationalExpenses: skippedSections.educationalExpenses ? [] : eduExp,
      otherExpenses: skippedSections.otherExpenses ? [] : otherExp,
      skippedSections,
      metadata: {
        submittedAt: new Date().toISOString(),
        submissionType: isProcessingForAdmin ? 'admin' : 'self',
        incomeYear
      }
    };
    
    console.log("Submitting declaration:", submissionData);
    setIsSubmitted(true);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ==================== RECEIPT ====================
  const renderReceipt = () => {
    const skippedCount = Object.values(skippedSections).filter(Boolean).length;
    
    return (
      <div className="max-w-lg mx-auto bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg mt-8">
        <div className="text-center border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-center mb-2">
            <PngLogoIcon />
          </div>
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
            Official Acknowledgement Receipt
          </h2>
          <p className="text-sm text-gray-600 mt-1">Anti-Corruption Commission</p>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <p>
            We acknowledge with thanks the receipt of <strong>Mr/Ms {personal.name}</strong> 
            (CID: {personal.cid}) Asset Declaration for the income year <strong>{incomeYear}</strong>.
          </p>
          
          <div className="bg-gray-100 p-4 rounded space-y-2">
            <p><strong>Declaration ID:</strong> DEC-{incomeYear}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
            <p><strong>Type:</strong> {personal.reason}</p>
            <p><strong>Sections Skipped:</strong> {skippedCount}</p>
            <p><strong>Submitted On:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            <p><strong>Submission Mode:</strong> {isProcessingForAdmin ? 'Administrative Filing' : 'Self Filing'}</p>
          </div>

          {skippedCount > 0 && (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-xs">
              <p className="font-bold text-yellow-700 mb-1">Note:</p>
              <p>
                {skippedCount} section(s) were marked as "Nothing to declare". 
                This information is recorded in your declaration history.
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded border border-blue-100 text-xs">
            <p className="font-bold text-blue-700 mb-1">Next Steps:</p>
            <p>
              Your declaration has been submitted successfully. You will receive email confirmation 
              and can track the verification status on your dashboard. Please retain this receipt for your records.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-dashed border-gray-300 flex justify-between items-end">
          <div className="text-xs text-gray-500">
            <p>Authorized Signature</p>
            <p>(System Generated)</p>
          </div>
          <div className="border-2 border-gray-400 text-gray-400 font-bold text-xs p-2 uppercase transform -rotate-12">
            e-Signed
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.print()}
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium px-4 py-2 border border-blue-200 rounded"
          >
            Print / Download Receipt
          </button>
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-md font-bold hover:bg-primary-dark text-center"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  };

  // ==================== STEP RENDERER ====================
  const renderCurrentStep = () => {
    if (isSubmitted) return renderReceipt();

    switch (currentStep) {
      case 0:
        return (
          <div className="prose text-sm text-gray-600 max-w-none">
            <h2 className="text-xl font-bold text-primary mb-4">
              {isProcessingForAdmin ? `Filing on Behalf of: ${targetOfficialName}` : "Important Information"}
            </h2>
            
            {isProcessingForAdmin && (
              <InfoBox type="warning">
                <p className="font-bold">Admin Mode Active</p>
                <p>You are submitting on behalf of another official. Upload signed hard copy at final step.</p>
              </InfoBox>
            )}

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Why must I file?</h3>
                <p>
                  As per section 38(1) of the Anti-Corruption Act of Bhutan (ACAB) 2011, 
                  public servants must declare assets to promote transparency and accountability.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Skip Options Available</h3>
                <p>
                  Each section has a "Nothing to declare" option. You can skip sections where you have 
                  nothing to report for the income year.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Important Dates</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Annual Declaration:</strong> March 1 - April 30</li>
                  <li><strong>Assumption of Office:</strong> Within 3 months</li>
                  <li><strong>Vacation of Office:</strong> 1 month before/after</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg mb-2 text-blue-700">Need Help?</h3>
                <p>
                  Contact AD Administrators at <strong>02-337423</strong> or email <strong>admd@acc.org.bt</strong>
                </p>
              </div>
            </div>
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

  // ==================== RENDER AFFIDAVIT ====================
  const renderAffidavit = () => (
    <div className="text-center p-8 space-y-4">
      <div className="mb-8">
        <button 
          onClick={() => setPreviewModalOpen(true)}
          className="flex items-center justify-center w-full md:w-auto mx-auto px-6 py-3 bg-white border-2 border-primary text-primary font-bold rounded-lg hover:bg-blue-50 transition shadow-sm"
        >
          <DocumentReportIcon className="w-5 h-5 mr-2" />
          Preview Full Declaration
        </button>
      </div>

      <h2 className="text-xl font-bold">Sworn Affidavit</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 p-6 text-left text-sm text-gray-700 rounded-lg space-y-4">
        {isProcessingForAdmin ? (
          <div className="font-bold text-red-600 uppercase mb-2">ADMINISTRATIVE FILING: HARD COPY UPLOAD REQUIRED</div>
        ) : null}
        
        <p>
          I swear or affirm that all the information that I have given here is true, correct and complete 
          to the best of my knowledge, information and belief. I understand that I shall be liable as per 
          section 64 of ACAB 2011, if I have intentionally given false information. I also know that I may 
          be asked to show proof of any information I have given. I also hereby authorize the Commission 
          or its duly authorized agency to obtain and secure from all appropriate agencies, including the 
          Department of Revenue and Customs, such documents that may show such income, assets, and liabilities, 
          including those of my spouse, children and dependents, covering previous Annual declaration (s) 
          and Assumption of Office declaration.
        </p>

        {isProcessingForAdmin && (
          <div className="mt-4 border-t border-yellow-300 pt-4">
            <label className="block font-bold text-gray-800 mb-2">
              Upload Signed Hard Copy (PDF/Image) - <span className="text-red-600">MANDATORY</span>
            </label>
            <div className="flex items-center">
              <input
                type="file"
                onChange={(e) => setHardCopyFile(e.target.files ? e.target.files[0] : null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            {!hardCopyFile && (
              <p className="text-red-500 text-xs mt-1">
                Hard copy upload is mandatory for administrative filing.
              </p>
            )}
            {hardCopyFile && (
              <p className="text-green-500 text-xs mt-1 flex items-center">
                <CheckIcon className="w-3 h-3 mr-1" />
                File uploaded: {hardCopyFile.name}
              </p>
            )}
          </div>
        )}
      </div>

      <label className="flex items-center justify-center mt-6 space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={affidavitAgreed}
          onChange={(e) => setAffidavitAgreed(e.target.checked)}
          className="w-5 h-5 text-primary rounded focus:ring-primary"
          disabled={isProcessingForAdmin && !hardCopyFile}
        />
        <span className="font-bold text-gray-900">
          {isProcessingForAdmin
            ? "I certify I have uploaded the original signed declaration."
            : "I AGREE TO THE ABOVE AFFIDAVIT AND DECLARE THE INFORMATION IS TRUE"}
        </span>
      </label>

      {isProcessingForAdmin && !hardCopyFile && (
        <div className="text-red-500 text-sm mt-2">
          You must upload the signed hard copy before submitting.
        </div>
      )}
    </div>
  );

  // ==================== RENDER PERSONAL INFO ====================
  const renderPersonalInfo = () => (
    <div>
      <SectionHeader 
        title="Reason for Declaration" 
        subtitle="Select the appropriate type" 
      />
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { type: 'Assumption of Office', description: 'Declare assets before office' },
          { type: 'Annual Declaration', description: 'Declare for income year' },
          { type: 'Vacation of Office', description: 'Declare since last declaration' }
        ].map((item) => (
          <div
            key={item.type}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              personal.reason === item.type
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPersonal({ ...personal, reason: item.type as any })}
          >
            <div className="flex items-center mb-2">
              <input
                type="radio"
                name="reason"
                checked={personal.reason === item.type}
                onChange={() => setPersonal({ ...personal, reason: item.type as any })}
                className="h-4 w-4 text-primary"
              />
              <span className="ml-2 font-bold text-gray-800">{item.type}</span>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <SectionHeader title="Details of Declarant" subtitle="Your personal information" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          label="Full Name"
          id="p_name"
          value={personal.name}
          onChange={(e: any) => setPersonal({ ...personal, name: e.target.value })}
          required
        />
        <FormInput
          label="CID / Work Permit No"
          id="p_cid"
          value={personal.cid}
          onChange={(e: any) => setPersonal({ ...personal, cid: e.target.value })}
          required
        />
        <FormInput
          label="Date of Birth"
          id="p_dob"
          type="date"
          value={personal.dob}
          onChange={(e: any) => setPersonal({ ...personal, dob: e.target.value })}
          required
        />
        <FormSelect
          label="Sex"
          id="p_sex"
          value={personal.sex}
          onChange={(e: any) => setPersonal({ ...personal, sex: e.target.value })}
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </FormSelect>
        <FormSelect
          label="Marital Status"
          id="p_status"
          value={personal.maritalStatus}
          onChange={(e: any) => setPersonal({ ...personal, maritalStatus: e.target.value })}
          required
        >
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widow">Widow</option>
          <option value="Widower">Widower</option>
        </FormSelect>
        <FormInput
          label="Income Year"
          id="p_year"
          value={incomeYear}
          disabled
          note="Auto-calculated"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormTextarea
          label="Permanent Address"
          id="p_addr"
          placeholder="Country/Dzongkhag/Dungkhag/City/Gewog/Chiwog"
          value={personal.permanentAddress}
          onChange={(e: any) => setPersonal({ ...personal, permanentAddress: e.target.value })}
          required
        />
        <FormTextarea
          label="Employment Details"
          id="p_emp"
          placeholder="EID No/Employment Type/Agency Category/Agency/Current place of posting/Position Title/Position Level/Declaration Category"
          value={personal.employmentDetails}
          onChange={(e: any) => setPersonal({ ...personal, employmentDetails: e.target.value })}
          required
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormTextarea
          label="Contact Details"
          id="p_contact"
          placeholder="Email ID/Mobile No/Office Telephone No"
          value={personal.contact}
          onChange={(e: any) => setPersonal({ ...personal, contact: e.target.value })}
          required
        />
        <div className="p-4 bg-gray-100 rounded-lg">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={personal.spouseCovered}
              onChange={(e) => setPersonal({ ...personal, spouseCovered: e.target.checked })}
              className="h-4 w-4 text-primary rounded"
            />
            <span className="ml-2 text-sm font-bold text-gray-800">
              Is your spouse also a covered person (Public Official)?
            </span>
          </label>
          <p className="text-xs text-gray-600 mt-2 ml-6">
            If yes, your spouse must file their own declaration separately.
          </p>
        </div>
      </div>
    </div>
  );

  // ==================== RENDER FAMILY ====================
  const renderFamily = () => {
    if (skippedSections.family) {
      return renderSkippedSection("Family Details", "Spouse, Children and Dependents", 'family');
    }

    return (
      <div>
        <SectionHeader
          title="Family Details"
          subtitle="Spouse, Children and Dependents"
          note={`${family.length} member(s) declared`}
        />

        <InfoBox type="info">
          <div className="flex justify-between items-center">
            <span>Include all family members: spouse, children (under 18 or dependent), and other dependents.</span>
            <SkipSectionButton onSkip={() => handleSkipSection('family')} />
          </div>
        </InfoBox>

        <div className="space-y-4">
          {family.map((mem) => (
            <ItemCard
              key={mem.id}
              title={`${mem.relationship}: ${mem.name}`}
              onRemove={() => handleRemove(setFamily, mem.id)}
              warning={mem.relationship === 'Spouse' && mem.isCovered ? 'Spouse must file separately' : undefined}
            >
              <FormSelect
                label="Relationship"
                value={mem.relationship}
                onChange={(e: any) => handleChange(setFamily, mem.id, 'relationship', e.target.value)}
                required
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Dependent">Dependent</option>
              </FormSelect>
              <FormInput
                label="Full Name"
                value={mem.name}
                onChange={(e: any) => handleChange(setFamily, mem.id, 'name', e.target.value)}
                required
              />
              <FormInput
                label="CID / Permit No"
                value={mem.cid}
                onChange={(e: any) => handleChange(setFamily, mem.id, 'cid', e.target.value)}
                required
              />
              <FormInput
                label="Date of Birth"
                type="date"
                value={mem.dob}
                onChange={(e: any) => handleChange(setFamily, mem.id, 'dob', e.target.value)}
                required
              />
              <FormSelect
                label="Sex"
                value={mem.sex}
                onChange={(e: any) => handleChange(setFamily, mem.id, 'sex', e.target.value)}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </FormSelect>
              <FormTextarea
                label="Employment Details"
                value={mem.employment}
                onChange={(e: any) => handleChange(setFamily, mem.id, 'employment', e.target.value)}
                placeholder="Agency, Position"
              />
              {mem.relationship === 'Spouse' && (
                <div className="p-3 bg-blue-50 rounded">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mem.isCovered || false}
                      onChange={(e) => handleChange(setFamily, mem.id, 'isCovered', e.target.checked)}
                      className="h-4 w-4 text-primary rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-800">
                      Is spouse a covered person?
                    </span>
                  </label>
                </div>
              )}
            </ItemCard>
          ))}

          <button
            onClick={() =>
              handleAdd<FamilyMember>(setFamily, {
                relationship: 'Spouse',
                name: '',
                cid: '',
                dob: '',
                sex: 'Male',
                maritalStatus: 'Single',
                permanentAddress: personal.permanentAddress,
                employment: '',
                contact: ''
              })
            }
            className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Add Family Member
          </button>
        </div>
      </div>
    );
  };

  // ==================== RENDER IMMOVABLE ====================
  const renderImmovable = () => {
    if (skippedSections.immovableProperties) {
      return renderSkippedSection("Immovable Properties", "Land, Building, House, Flat", 'immovableProperties');
    }

    return (
      <div>
        <SectionHeader
          title="Immovable Properties"
          subtitle="Land, Building, House, Flat (Sec 6.1)"
          note={`${immovable.length} property/ies declared`}
        />

        <InfoBox type="info">
          <div className="flex justify-between items-center">
            <span>Include properties acquired during the income year.</span>
            <SkipSectionButton onSkip={() => handleSkipSection('immovableProperties')} />
          </div>
        </InfoBox>

        <div className="space-y-4">
          {immovable.map((item) => (
            <ItemCard
              key={item.id}
              title={`${item.type} - ${item.location}`}
              onRemove={() => handleRemove(setImmovable, item.id)}
            >
              <FormSelect
                label="Owner"
                value={item.ownerRelationship}
                onChange={(e: any) => handleChange(setImmovable, item.id, 'ownerRelationship', e.target.value)}
              >
                {getRelationOptions()}
              </FormSelect>
              <FormSelect
                label="Type of Property"
                value={item.type}
                onChange={(e: any) => handleChange(setImmovable, item.id, 'type', e.target.value)}
              >
                <option value="Land">Land</option>
                <option value="Building">Building</option>
                <option value="House">House</option>
                <option value="Flat">Flat</option>
                <option value="Others">Others</option>
              </FormSelect>
              <FormInput
                label="Thram No"
                value={item.thramNo}
                onChange={(e: any) => handleChange(setImmovable, item.id, 'thramNo', e.target.value)}
              />
              <FormInput
                label="Size / Quantity"
                value={item.size}
                onChange={(e: any) => handleChange(setImmovable, item.id, 'size', e.target.value)}
              />
              <FormInput
                label="Location"
                value={item.location}
                onChange={(e: any) => handleChange(setImmovable, item.id, 'location', e.target.value)}
              />
              <FormInput
                label="Total Cost (Nu.)"
                type="number"
                value={item.totalCost}
                onChange={(e: any) => handleChange(setImmovable, item.id, 'totalCost', e.target.value)}
              />
              <FormInput
                label="Date of Acquisition"
                type="date"
                value={item.acquisitionDate}
                onChange={(e: any) => handleChange(setImmovable, item.id, 'acquisitionDate', e.target.value)}
              />
              <div className="md:col-span-3">
                <FileUpload
                  documents={item.documents}
                  onFileChange={(e) => handleFile(setImmovable, item.id, e)}
                  onFileRemove={(fid) => handleFileRemove(setImmovable, item.id, fid)}
                />
              </div>
            </ItemCard>
          ))}

          <button
            onClick={() =>
              handleAdd<ImmovableAsset>(setImmovable, {
                ownerRelationship: 'Self',
                ownerName: personal.name,
                ownerCid: personal.cid,
                type: 'Land',
                thramNo: '',
                plotNo: '',
                houseNo: '',
                size: '',
                location: '',
                acquisitionDate: '',
                acquisitionMode: '',
                totalCost: '',
                paymentInYear: '',
                sourceOfFinance: '',
                acquiredFrom: '',
                registeredOwnerName: personal.name,
                registeredOwnerCID: personal.cid
              })
            }
            className="flex items-center text-primary font-bold text-sm hover:text-primary-dark transition"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Add Immovable Property
          </button>
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 flex justify-center min-h-[600px]">
        {renderReceipt()}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Declaration Preview"
        size="xl"
      >
        {renderPreviewModal()}
      </Modal>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-primary-dark">
            Asset Declaration Form
          </h1>
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        <ProgressBar steps={steps} currentStepIndex={currentStep} completedSteps={completedSteps} />
      </div>

      <div className="mt-8 mb-8 min-h-[500px]">{renderCurrentStep()}</div>

      <div className="pt-6 border-t flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-2 border border-gray-300 rounded-md text-text-main hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentStep === 9 && !affidavitAgreed}
          className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {currentStep === 9 ? "Submit Declaration" : "Save & Continue"}
        </button>
      </div>
    </div>
  );
};

export default FileNewPage;