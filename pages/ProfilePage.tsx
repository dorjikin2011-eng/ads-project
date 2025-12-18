// ProfilePage.tsx
// ------------------------------------------------------------
// UPDATED TO ALIGN WITH FILENEWPAGE STRUCTURE FOR AUTO-FILLING
// ------------------------------------------------------------

import React, { useState, useEffect, useRef } from 'react';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';
import CameraIcon from '../components/icons/CameraIcon';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15);

// ------------------ INTERFACES (ALIGNED WITH FILENEWPAGE) ----------------------------
interface FamilyMember {
  id: string;
  relationship: 'Spouse' | 'Child' | 'Dependent';
  name: string;
  cid: string;
  dob: string;
  sex: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widow' | 'Widower';
  permanentAddress: string;
  employment: string;
  contact: string;
  isCovered?: boolean;
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
}

interface PersonalSaving {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: 'Bank Deposit' | 'Cash in Hand' | 'Money Lent' | 'Foreign Exchange' | 'Others';
  bankName: string;
  bankLocation: string;
  accountType: string;
  accountNumber: string;
  balanceAmount: string;
  sourceOfSaving: string;
}

interface ConvertibleAsset {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  type: 'Jewelry' | 'Gold' | 'Art' | 'Electronic Gadgets' | 'Others';
  acquisitionDate: string;
  acquisitionMode: string;
  totalCost: string;
  sourceOfFinance: string;
  acquiredFrom: string;
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
  sourceOfFinance: string;
  acquiredFromName: string;
  acquiredFromCID: string;
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
}

interface EducationalExpense {
  id: string;
  relationship: string;
  name: string;
  amount: string;
  institution: string;
  institutionPlace: string;
  courseLevel: string;
}

interface OtherExpense {
  id: string;
  ownerRelationship: string;
  ownerName: string;
  ownerCid: string;
  category: 'Rental' | 'Insurance' | 'Loan Repayment' | 'Travel' | 'Medical Treatment' | 'Other';
  details: string;
  amount: string;
}

interface ProfileData {
  // Personal Info (from FileNewPage personal section)
  personal: {
    name: string;
    cid: string;
    dob: string;
    sex: 'Male' | 'Female' | 'Others';
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widow' | 'Widower';
    permanentAddress: string;
    contact: string;
    email: string;
    phone: string;
  };
  
  // Agency Details
  agency: {
    name: string;
    department: string;
    position: string;
    officeAddress: string;
    employmentDetails: string; // Matches FileNewPage employmentDetails
  };
  
  // Address Details
  address: {
    present: {
      village: string;
      gewog: string;
      dzongkhag: string;
      houseNo: string;
    };
    permanent: {
      village: string;
      gewog: string;
      dzongkhag: string;
      houseNo: string;
    };
  };
  
  // Family (matches FileNewPage family structure)
  family: FamilyMember[];
  
  // Assets (matches FileNewPage asset sections)
  immovableAssets: ImmovableAsset[];
  vehicles: Vehicle[];
  savings: PersonalSaving[];
  convertibleAssets: ConvertibleAsset[];
  commercialActivities: CommercialActivity[];
  
  // Liabilities (matches FileNewPage liability section)
  liabilities: Liability[];
  
  // Expenditures (matches FileNewPage expenditure sections)
  educationalExpenses: EducationalExpense[];
  otherExpenses: OtherExpense[];
  
  // Simple assets (for backward compatibility)
  simpleAssets: {
    id: string;
    type: string;
    description: string;
    value: string;
  }[];
  
  // Simple liabilities (for backward compatibility)
  simpleLiabilities: {
    id: string;
    source: string;
    amount: string;
    remarks: string;
  }[];
  
  // Simple expenditures (for backward compatibility)
  simpleExpenditures: {
    id: string;
    category: string;
    amount: string;
    remarks: string;
  }[];
}

// ------------------ INITIAL DATA (ALIGNED WITH FILENEWPAGE) ----------------------------
const initialProfileData: ProfileData = {
  personal: {
    name: 'Kinley Wangchuk',
    cid: '123456789',
    dob: '1985-06-15',
    sex: 'Male',
    maritalStatus: 'Married',
    permanentAddress: 'Thimphu Thromde, Chang Gewog',
    contact: 'kinley.wangchuk@gov.bt, 17123456, 02-123456',
    email: 'kinley.w@gov.bt',
    phone: '17123456',
  },
  agency: {
    name: 'Anti-Corruption Commission',
    department: 'Prevention Division',
    position: 'Chief Integrity Officer',
    officeAddress: 'ACC Head Office, Thimphu',
    employmentDetails: 'EID-001/Civil Servant/Central Agency/Ministry of Finance/Thimphu/Revenue Officer/Level 5/Regular',
  },
  address: {
    present: {
      village: 'Olakha',
      gewog: 'Thimphu Thromde',
      dzongkhag: 'Thimphu',
      houseNo: 'A-123',
    },
    permanent: {
      village: 'Punakha',
      gewog: 'Chubu',
      dzongkhag: 'Punakha',
      houseNo: 'B-45',
    },
  },
  family: [
    { 
      id: '1', 
      relationship: 'Spouse', 
      name: 'Sonam Dema', 
      cid: '987654321', 
      dob: '1987-03-22', 
      sex: 'Female', 
      maritalStatus: 'Married', 
      permanentAddress: 'Thimphu Thromde, Chang Gewog',
      employment: 'EID-002/Private Sector/Bank of Bhutan/Thimphu/Teller/Level 4',
      contact: 'sonam.dema@bob.bt, 17654321',
      isCovered: false 
    },
    { 
      id: '2', 
      relationship: 'Child', 
      name: 'Jigme Dorji', 
      cid: '112233445', 
      dob: '2010-08-10', 
      sex: 'Male', 
      maritalStatus: 'Single', 
      permanentAddress: 'Thimphu Thromde, Chang Gewog',
      employment: 'Student',
      contact: ''
    },
  ],
  immovableAssets: [
    {
      id: '1',
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
    },
    {
      id: '2',
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
    }
  ],
  vehicles: [
    {
      id: '1',
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
    }
  ],
  savings: [
    {
      id: '1',
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
    }
  ],
  convertibleAssets: [
    {
      id: '1',
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Gold',
      acquisitionDate: '2020-01-15',
      acquisitionMode: 'Purchase',
      totalCost: '150000',
      sourceOfFinance: 'Savings',
      acquiredFrom: 'City Gold, Thimphu',
    }
  ],
  commercialActivities: [
    {
      id: '1',
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
      sourceOfFinance: 'Business Loan',
      acquiredFromName: 'Tshering Dorji',
      acquiredFromCID: '334455667',
    }
  ],
  liabilities: [
    {
      id: '1',
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      type: 'Bank Loan',
      totalAmountSanctioned: '3000000',
      actualAmountReceived: '3000000',
      lenderDetails: 'Bank of Bhutan, Thimphu Branch',
      borrowingDate: '2021-07-01',
    }
  ],
  educationalExpenses: [
    {
      id: '1',
      relationship: 'Child',
      name: 'Jigme Dorji',
      amount: '120000',
      institution: 'Yangchenphug Higher Secondary School',
      institutionPlace: 'Thimphu',
      courseLevel: 'Class 12',
    }
  ],
  otherExpenses: [
    {
      id: '1',
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      category: 'Insurance',
      details: 'Life Insurance',
      amount: '30000',
    },
    {
      id: '2',
      ownerRelationship: 'Self',
      ownerName: 'Kinley Wangchuk',
      ownerCid: '123456789',
      category: 'Travel',
      details: 'Family vacation to Phuentsholing',
      amount: '50000',
    }
  ],
  simpleAssets: [],
  simpleLiabilities: [],
  simpleExpenditures: [],
};

// ---------------- COMPONENTS -------------------
const ProfileField = ({
  label, value, isEditing, onChange, type = 'text', name = '', placeholder = '', required = false
}: any) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm"
        required={required}
      />
    ) : (
      <p className="mt-1 text-text-main font-medium">{value || '-'}</p>
    )}
  </div>
);

const ProfileTextarea = ({
  label, value, isEditing, onChange, name = '', placeholder = '', rows = 3, required = false
}: any) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isEditing ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm"
        required={required}
      />
    ) : (
      <p className="mt-1 text-text-main font-medium whitespace-pre-line">{value || '-'}</p>
    )}
  </div>
);

const ProfileSelect = ({
  label, value, isEditing, onChange, name = '', options = [], required = false
}: any) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isEditing ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm"
        required={required}
      >
        <option value="">Select...</option>
        {options.map((opt: any) => (
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          )
        ))}
      </select>
    ) : (
      <p className="mt-1 text-text-main font-medium">{value || '-'}</p>
    )}
  </div>
);

const ProfileSection = ({
  title, children, isEditing, onEdit, onSave, onCancel,
}: any) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-text-main">{title}</h2>
      {!isEditing && (
        <button onClick={onEdit} className="text-sm font-medium text-accent hover:underline">
          Edit
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>

    {isEditing && (
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-text-main hover:bg-gray-50 transition text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition text-sm"
        >
          Save Changes
        </button>
      </div>
    )}
  </div>
);

// ---------------- MAIN PROFILE PAGE -------------------
interface Props {
  profilePicture: string;
  setProfilePicture: (url: string) => void;
}

const ProfilePage: React.FC<Props> = ({ profilePicture, setProfilePicture }) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfileData);
  const [tempProfile, setTempProfile] = useState<ProfileData>(initialProfileData);

  // Editing states for each section
  const [isPersonalEditing, setPersonalEditing] = useState(false);
  const [isAgencyEditing, setAgencyEditing] = useState(false);
  const [isAddressEditing, setAddressEditing] = useState(false);
  const [isFamilyEditing, setFamilyEditing] = useState(false);
  const [isImmovableEditing, setImmovableEditing] = useState(false);
  const [isVehicleEditing, setVehicleEditing] = useState(false);
  const [isSavingEditing, setSavingEditing] = useState(false);
  const [isConvertibleEditing, setConvertibleEditing] = useState(false);
  const [isCommercialEditing, setCommercialEditing] = useState(false);
  const [isLiabilityEditing, setLiabilityEditing] = useState(false);
  const [isEduExpenseEditing, setEduExpenseEditing] = useState(false);
  const [isOtherExpenseEditing, setOtherExpenseEditing] = useState(false);

  const [sameAsPresent, setSameAsPresent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------- PROFILE PICTURE ----------------
  const handlePictureUploadClick = () => fileInputRef.current?.click();
  const handlePictureChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (typeof evt.target?.result === 'string') {
        setProfilePicture(evt.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // ---------------- GENERAL HANDLERS ----------------
  const handleEdit = (setter: any) => { 
    setTempProfile(profile); 
    setter(true); 
  };
  
  const handleSave = (setter: any) => { 
    setProfile(tempProfile); 
    setter(false); 
  };
  
  const handleCancel = (setter: any) => { 
    setTempProfile(profile); 
    setter(false); 
  };

  // ---------------- PERSONAL INFO HANDLERS ----------------
  const handlePersonalChange = (e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      personal: { ...p.personal, [name]: value },
    }));
  };

  // ---------------- AGENCY DETAILS HANDLERS ----------------
  const handleAgencyChange = (e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      agency: { ...p.agency, [name]: value },
    }));
  };

  // ---------------- ADDRESS HANDLERS ----------------
  const handleAddressChange = (section: 'present' | 'permanent', e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      address: {
        ...p.address,
        [section]: { ...p.address[section], [name]: value },
      },
    }));
  };

  useEffect(() => {
    if (sameAsPresent && isAddressEditing) {
      setTempProfile((p) => ({
        ...p,
        address: {
          ...p.address,
          permanent: { ...p.address.present },
        },
      }));
    }
  }, [sameAsPresent, tempProfile.address.present]);

  // ---------------- FAMILY HANDLERS ----------------
  const handleFamilyChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      family: p.family.map((m) => (m.id === id ? { ...m, [name]: value } : m)),
    }));
  };

  const addFamilyMember = () => {
    setTempProfile((p) => ({
      ...p,
      family: [...p.family, { 
        id: generateId(), 
        relationship: 'Spouse', 
        name: '', 
        cid: '', 
        dob: '', 
        sex: 'Male', 
        maritalStatus: 'Single',
        permanentAddress: p.personal.permanentAddress,
        employment: '',
        contact: '' 
      }],
    }));
  };

  const removeFamilyMember = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      family: p.family.filter((m) => m.id !== id),
    }));
  };

  // ---------------- IMMOVABLE ASSETS HANDLERS ----------------
  const handleImmovableChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      immovableAssets: p.immovableAssets.map((a) => (a.id === id ? { ...a, [name]: value } : a)),
    }));
  };

  const addImmovableAsset = () => {
    setTempProfile((p) => ({
      ...p,
      immovableAssets: [...p.immovableAssets, { 
        id: generateId(), 
        ownerRelationship: 'Self',
        ownerName: p.personal.name,
        ownerCid: p.personal.cid,
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
        registeredOwnerName: p.personal.name,
        registeredOwnerCID: p.personal.cid
      }],
    }));
  };

  const removeImmovableAsset = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      immovableAssets: p.immovableAssets.filter((a) => a.id !== id),
    }));
  };

  // ---------------- VEHICLES HANDLERS ----------------
  const handleVehicleChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      vehicles: p.vehicles.map((v) => (v.id === id ? { ...v, [name]: value } : v)),
    }));
  };

  const addVehicle = () => {
    setTempProfile((p) => ({
      ...p,
      vehicles: [...p.vehicles, { 
        id: generateId(), 
        ownerRelationship: 'Self',
        ownerName: p.personal.name,
        ownerCid: p.personal.cid,
        type: 'Vehicle',
        make: '',
        registrationNo: '',
        model: '',
        acquisitionDate: '',
        acquisitionMode: '',
        totalCost: '',
        sourceOfFinance: '',
        acquiredFrom: '',
        registeredOwnerName: p.personal.name,
        registeredOwnerCID: p.personal.cid
      }],
    }));
  };

  const removeVehicle = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      vehicles: p.vehicles.filter((v) => v.id !== id),
    }));
  };

  // ---------------- SAVINGS HANDLERS ----------------
  const handleSavingChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      savings: p.savings.map((s) => (s.id === id ? { ...s, [name]: value } : s)),
    }));
  };

  const addSaving = () => {
    setTempProfile((p) => ({
      ...p,
      savings: [...p.savings, { 
        id: generateId(), 
        ownerRelationship: 'Self',
        ownerName: p.personal.name,
        ownerCid: p.personal.cid,
        type: 'Bank Deposit',
        bankName: '',
        bankLocation: '',
        accountType: '',
        accountNumber: '',
        balanceAmount: '',
        sourceOfSaving: ''
      }],
    }));
  };

  const removeSaving = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      savings: p.savings.filter((s) => s.id !== id),
    }));
  };

  // ---------------- LIABILITIES HANDLERS ----------------
  const handleLiabilityChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      liabilities: p.liabilities.map((l) => (l.id === id ? { ...l, [name]: value } : l)),
    }));
  };

  const addLiability = () => {
    setTempProfile((p) => ({
      ...p,
      liabilities: [...p.liabilities, { 
        id: generateId(), 
        ownerRelationship: 'Self',
        ownerName: p.personal.name,
        ownerCid: p.personal.cid,
        type: 'Bank Loan',
        totalAmountSanctioned: '',
        actualAmountReceived: '',
        lenderDetails: '',
        borrowingDate: ''
      }],
    }));
  };

  const removeLiability = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      liabilities: p.liabilities.filter((l) => l.id !== id),
    }));
  };

  // ---------------- EDUCATIONAL EXPENSES HANDLERS ----------------
  const handleEduExpenseChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      educationalExpenses: p.educationalExpenses.map((e) => (e.id === id ? { ...e, [name]: value } : e)),
    }));
  };

  const addEduExpense = () => {
    setTempProfile((p) => ({
      ...p,
      educationalExpenses: [...p.educationalExpenses, { 
        id: generateId(), 
        relationship: 'Child',
        name: '',
        amount: '',
        institution: '',
        institutionPlace: '',
        courseLevel: ''
      }],
    }));
  };

  const removeEduExpense = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      educationalExpenses: p.educationalExpenses.filter((e) => e.id !== id),
    }));
  };

  // ---------------- OTHER EXPENSES HANDLERS ----------------
  const handleOtherExpenseChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      otherExpenses: p.otherExpenses.map((o) => (o.id === id ? { ...o, [name]: value } : o)),
    }));
  };

  const addOtherExpense = () => {
    setTempProfile((p) => ({
      ...p,
      otherExpenses: [...p.otherExpenses, { 
        id: generateId(), 
        ownerRelationship: 'Self',
        ownerName: p.personal.name,
        ownerCid: p.personal.cid,
        category: 'Other',
        details: '',
        amount: ''
      }],
    }));
  };

  const removeOtherExpense = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      otherExpenses: p.otherExpenses.filter((o) => o.id !== id),
    }));
  };

  // ---------------- RENDER ----------------
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-2">Your Profile</h1>
      <p className="text-text-secondary mb-8">
        Manage your personal information. This data will be used to auto-fill your asset declaration forms.
      </p>

      <div className="space-y-8">

        {/* ---------------- PROFILE HEADER ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
          <div className="relative group">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              onClick={handlePictureUploadClick}
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300"
            >
              <CameraIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePictureChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-main">
              {profile.personal.name}
            </h2>
            <p className="text-text-secondary">CID: {profile.personal.cid}</p>
            <p className="text-text-secondary text-sm">{profile.agency.position} at {profile.agency.name}</p>
          </div>
        </div>

        {/* ---------------- PERSONAL DETAILS ---------------- */}
        <ProfileSection
          title="Personal Details"
          isEditing={isPersonalEditing}
          onEdit={() => handleEdit(setPersonalEditing)}
          onSave={() => handleSave(setPersonalEditing)}
          onCancel={() => handleCancel(setPersonalEditing)}
        >
          <ProfileField
            label="Full Name"
            value={tempProfile.personal.name}
            isEditing={isPersonalEditing}
            name="name"
            onChange={handlePersonalChange}
            required
          />
          <ProfileField
            label="CID / Work Permit No"
            value={tempProfile.personal.cid}
            isEditing={isPersonalEditing}
            name="cid"
            onChange={handlePersonalChange}
            required
          />
          <ProfileField
            label="Date of Birth"
            value={tempProfile.personal.dob}
            isEditing={isPersonalEditing}
            name="dob"
            type="date"
            onChange={handlePersonalChange}
            required
          />
          <ProfileSelect
            label="Sex"
            value={tempProfile.personal.sex}
            isEditing={isPersonalEditing}
            name="sex"
            onChange={handlePersonalChange}
            options={['Male', 'Female', 'Others']}
            required
          />
          <ProfileSelect
            label="Marital Status"
            value={tempProfile.personal.maritalStatus}
            isEditing={isPersonalEditing}
            name="maritalStatus"
            onChange={handlePersonalChange}
            options={['Single', 'Married', 'Divorced', 'Widow', 'Widower']}
            required
          />
          <ProfileField
            label="Email"
            value={tempProfile.personal.email}
            isEditing={isPersonalEditing}
            name="email"
            type="email"
            onChange={handlePersonalChange}
            required
          />
          <ProfileField
            label="Phone Number"
            value={tempProfile.personal.phone}
            isEditing={isPersonalEditing}
            name="phone"
            onChange={handlePersonalChange}
            required
          />
          <ProfileTextarea
            label="Contact Details"
            value={tempProfile.personal.contact}
            isEditing={isPersonalEditing}
            name="contact"
            onChange={handlePersonalChange}
            placeholder="Email ID/Mobile No/Office Telephone No"
            rows={2}
          />
          <div className="md:col-span-2">
            <ProfileTextarea
              label="Permanent Address"
              value={tempProfile.personal.permanentAddress}
              isEditing={isPersonalEditing}
              name="permanentAddress"
              onChange={handlePersonalChange}
              placeholder="Country/Dzongkhag/Dungkhag/City/Gewog/Chiwog"
              rows={3}
              required
            />
          </div>
        </ProfileSection>

        {/* ---------------- AGENCY DETAILS ---------------- */}
        <ProfileSection
          title="Working Agency Details"
          isEditing={isAgencyEditing}
          onEdit={() => handleEdit(setAgencyEditing)}
          onSave={() => handleSave(setAgencyEditing)}
          onCancel={() => handleCancel(setAgencyEditing)}
        >
          <ProfileField
            label="Agency Name"
            value={tempProfile.agency.name}
            isEditing={isAgencyEditing}
            name="name"
            onChange={handleAgencyChange}
            required
          />
          <ProfileField
            label="Department / Division"
            value={tempProfile.agency.department}
            isEditing={isAgencyEditing}
            name="department"
            onChange={handleAgencyChange}
            required
          />
          <ProfileField
            label="Position Title"
            value={tempProfile.agency.position}
            isEditing={isAgencyEditing}
            name="position"
            onChange={handleAgencyChange}
            required
          />
          <ProfileField
            label="Office Address"
            value={tempProfile.agency.officeAddress}
            isEditing={isAgencyEditing}
            name="officeAddress"
            onChange={handleAgencyChange}
            required
          />
          <div className="md:col-span-2">
            <ProfileTextarea
              label="Employment Details"
              value={tempProfile.agency.employmentDetails}
              isEditing={isAgencyEditing}
              name="employmentDetails"
              onChange={handleAgencyChange}
              placeholder="EID No/Employment Type/Agency Category/Agency/Current place of posting/Position Title/Position Level/Declaration Category"
              rows={3}
              required
            />
          </div>
        </ProfileSection>

        {/* ---------------- ADDRESS DETAILS ---------------- */}
        <ProfileSection
          title="Address Details"
          isEditing={isAddressEditing}
          onEdit={() => {
            setSameAsPresent(
              JSON.stringify(profile.address.present) ===
                JSON.stringify(profile.address.permanent)
            );
            handleEdit(setAddressEditing);
          }}
          onSave={() => {
            let updated = { ...tempProfile };
            if (sameAsPresent) {
              updated.address.permanent = { ...updated.address.present };
            }
            setProfile(updated);
            setTempProfile(updated);
            setAddressEditing(false);
          }}
          onCancel={() => handleCancel(setAddressEditing)}
        >
          <h3 className="text-lg font-semibold md:col-span-2">Present Address</h3>
          <ProfileField
            label="Village / Town"
            value={tempProfile.address.present.village}
            isEditing={isAddressEditing}
            name="village"
            onChange={(e: any) => handleAddressChange('present', e)}
          />
          <ProfileField
            label="Gewog / Thromde"
            value={tempProfile.address.present.gewog}
            isEditing={isAddressEditing}
            name="gewog"
            onChange={(e: any) => handleAddressChange('present', e)}
          />
          <ProfileField
            label="Dzongkhag / Thromde"
            value={tempProfile.address.present.dzongkhag}
            isEditing={isAddressEditing}
            name="dzongkhag"
            onChange={(e: any) => handleAddressChange('present', e)}
          />
          <ProfileField
            label="House No."
            value={tempProfile.address.present.houseNo}
            isEditing={isAddressEditing}
            name="houseNo"
            onChange={(e: any) => handleAddressChange('present', e)}
          />

          <h3 className="text-lg font-semibold md:col-span-2 mt-4">Permanent Address</h3>

          {isAddressEditing && (
            <div className="flex items-center md:col-span-2">
              <input
                type="checkbox"
                id="sameAsPresent"
                checked={sameAsPresent}
                onChange={(e) => setSameAsPresent(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="sameAsPresent" className="ml-2 text-sm">
                Same as Present Address
              </label>
            </div>
          )}

          {!sameAsPresent && (
            <>
              <ProfileField
                label="Village / Town"
                value={tempProfile.address.permanent.village}
                isEditing={isAddressEditing}
                name="village"
                onChange={(e: any) => handleAddressChange('permanent', e)}
              />
              <ProfileField
                label="Gewog / Thromde"
                value={tempProfile.address.permanent.gewog}
                isEditing={isAddressEditing}
                name="gewog"
                onChange={(e: any) => handleAddressChange('permanent', e)}
              />
              <ProfileField
                label="Dzongkhag / Thromde"
                value={tempProfile.address.permanent.dzongkhag}
                isEditing={isAddressEditing}
                name="dzongkhag"
                onChange={(e: any) => handleAddressChange('permanent', e)}
              />
              <ProfileField
                label="House No."
                value={tempProfile.address.permanent.houseNo}
                isEditing={isAddressEditing}
                name="houseNo"
                onChange={(e: any) => handleAddressChange('permanent', e)}
              />
            </>
          )}
        </ProfileSection>

        {/* ---------------- FAMILY DETAILS ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-main">Family Details</h2>
            {!isFamilyEditing && (
              <button
                onClick={() => handleEdit(setFamilyEditing)}
                className="text-sm font-medium text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.family.map((f) => (
              <div key={f.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileField
                    label="Name"
                    value={f.name}
                    isEditing={isFamilyEditing}
                    name="name"
                    onChange={(e: any) => handleFamilyChange(f.id, e)}
                    required
                  />
                  <ProfileSelect
                    label="Relationship"
                    value={f.relationship}
                    isEditing={isFamilyEditing}
                    name="relationship"
                    onChange={(e: any) => handleFamilyChange(f.id, e)}
                    options={['Spouse', 'Child', 'Dependent']}
                    required
                  />
                  <ProfileField
                    label="CID"
                    value={f.cid}
                    isEditing={isFamilyEditing}
                    name="cid"
                    onChange={(e: any) => handleFamilyChange(f.id, e)}
                    required
                  />
                  <ProfileField
                    label="Date of Birth"
                    value={f.dob}
                    isEditing={isFamilyEditing}
                    name="dob"
                    type="date"
                    onChange={(e: any) => handleFamilyChange(f.id, e)}
                    required
                  />
                  <ProfileSelect
                    label="Sex"
                    value={f.sex}
                    isEditing={isFamilyEditing}
                    name="sex"
                    onChange={(e: any) => handleFamilyChange(f.id, e)}
                    options={['Male', 'Female']}
                    required
                  />
                  <ProfileTextarea
                    label="Employment"
                    value={f.employment}
                    isEditing={isFamilyEditing}
                    name="employment"
                    onChange={(e: any) => handleFamilyChange(f.id, e)}
                    rows={2}
                  />
                </div>

              {f.relationship === 'Spouse' && (
  <div className="mt-3 p-3 bg-blue-50 rounded">
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={f.isCovered || false}
        onChange={(e: any) => {
          setTempProfile((p) => ({
            ...p,
            family: p.family.map((member) => 
              member.id === f.id ? { ...member, isCovered: e.target.checked } : member
            ),
          }));
        }}
        className="h-4 w-4 text-primary rounded"
      />
      <span className="ml-2 text-sm font-medium text-gray-800">
        Is spouse a covered person (Public Official)?
      </span>
    </label>
  </div>
)}

                {isFamilyEditing && (
                  <button
                    onClick={() => removeFamilyMember(f.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isFamilyEditing && (
              <button
                onClick={addFamilyMember}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Family Member</span>
              </button>
            )}
          </div>

          {isFamilyEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setFamilyEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setFamilyEditing)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ---------------- IMMOVABLE ASSETS ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Immovable Assets</h2>
            {!isImmovableEditing && (
              <button
                onClick={() => handleEdit(setImmovableEditing)}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.immovableAssets.map((asset) => (
              <div key={asset.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileSelect
                    label="Type"
                    value={asset.type}
                    isEditing={isImmovableEditing}
                    name="type"
                    onChange={(e: any) => handleImmovableChange(asset.id, e)}
                    options={['Land', 'Building', 'House', 'Flat', 'Others']}
                  />
                  <ProfileField
                    label="Thram No"
                    value={asset.thramNo}
                    isEditing={isImmovableEditing}
                    name="thramNo"
                    onChange={(e: any) => handleImmovableChange(asset.id, e)}
                  />
                  <ProfileField
                    label="Location"
                    value={asset.location}
                    isEditing={isImmovableEditing}
                    name="location"
                    onChange={(e: any) => handleImmovableChange(asset.id, e)}
                  />
                  <ProfileField
                    label="Size"
                    value={asset.size}
                    isEditing={isImmovableEditing}
                    name="size"
                    onChange={(e: any) => handleImmovableChange(asset.id, e)}
                  />
                  <ProfileField
                    label="Total Cost (Nu.)"
                    value={asset.totalCost}
                    isEditing={isImmovableEditing}
                    name="totalCost"
                    type="number"
                    onChange={(e: any) => handleImmovableChange(asset.id, e)}
                  />
                  <ProfileField
                    label="Acquisition Date"
                    value={asset.acquisitionDate}
                    isEditing={isImmovableEditing}
                    name="acquisitionDate"
                    type="date"
                    onChange={(e: any) => handleImmovableChange(asset.id, e)}
                  />
                </div>

                {isImmovableEditing && (
                  <button
                    onClick={() => removeImmovableAsset(asset.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isImmovableEditing && (
              <button
                onClick={addImmovableAsset}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Immovable Asset</span>
              </button>
            )}
          </div>

          {isImmovableEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setImmovableEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setImmovableEditing)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ---------------- VEHICLES ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Vehicles</h2>
            {!isVehicleEditing && (
              <button
                onClick={() => handleEdit(setVehicleEditing)}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileField
                    label="Make"
                    value={vehicle.make}
                    isEditing={isVehicleEditing}
                    name="make"
                    onChange={(e: any) => handleVehicleChange(vehicle.id, e)}
                  />
                  <ProfileField
                    label="Model"
                    value={vehicle.model}
                    isEditing={isVehicleEditing}
                    name="model"
                    onChange={(e: any) => handleVehicleChange(vehicle.id, e)}
                  />
                  <ProfileField
                    label="Registration No"
                    value={vehicle.registrationNo}
                    isEditing={isVehicleEditing}
                    name="registrationNo"
                    onChange={(e: any) => handleVehicleChange(vehicle.id, e)}
                  />
                  <ProfileField
                    label="Total Cost (Nu.)"
                    value={vehicle.totalCost}
                    isEditing={isVehicleEditing}
                    name="totalCost"
                    type="number"
                    onChange={(e: any) => handleVehicleChange(vehicle.id, e)}
                  />
                  <ProfileField
                    label="Acquisition Date"
                    value={vehicle.acquisitionDate}
                    isEditing={isVehicleEditing}
                    name="acquisitionDate"
                    type="date"
                    onChange={(e: any) => handleVehicleChange(vehicle.id, e)}
                  />
                </div>

                {isVehicleEditing && (
                  <button
                    onClick={() => removeVehicle(vehicle.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isVehicleEditing && (
              <button
                onClick={addVehicle}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Vehicle</span>
              </button>
            )}
          </div>

          {isVehicleEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setVehicleEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setVehicleEditing)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ---------------- SAVINGS ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Personal Savings</h2>
            {!isSavingEditing && (
              <button
                onClick={() => handleEdit(setSavingEditing)}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.savings.map((saving) => (
              <div key={saving.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileSelect
                    label="Type"
                    value={saving.type}
                    isEditing={isSavingEditing}
                    name="type"
                    onChange={(e: any) => handleSavingChange(saving.id, e)}
                    options={['Bank Deposit', 'Cash in Hand', 'Money Lent', 'Foreign Exchange', 'Others']}
                  />
                  <ProfileField
                    label="Bank Name"
                    value={saving.bankName}
                    isEditing={isSavingEditing}
                    name="bankName"
                    onChange={(e: any) => handleSavingChange(saving.id, e)}
                  />
                  <ProfileField
                    label="Account Number"
                    value={saving.accountNumber}
                    isEditing={isSavingEditing}
                    name="accountNumber"
                    onChange={(e: any) => handleSavingChange(saving.id, e)}
                  />
                  <ProfileField
                    label="Balance Amount (Nu.)"
                    value={saving.balanceAmount}
                    isEditing={isSavingEditing}
                    name="balanceAmount"
                    type="number"
                    onChange={(e: any) => handleSavingChange(saving.id, e)}
                  />
                </div>

                {isSavingEditing && (
                  <button
                    onClick={() => removeSaving(saving.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isSavingEditing && (
              <button
                onClick={addSaving}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Savings Account</span>
              </button>
            )}
          </div>

          {isSavingEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setSavingEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setSavingEditing)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ---------------- LIABILITIES ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Liabilities</h2>
            {!isLiabilityEditing && (
              <button
                onClick={() => handleEdit(setLiabilityEditing)}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.liabilities.map((liability) => (
              <div key={liability.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileSelect
                    label="Type"
                    value={liability.type}
                    isEditing={isLiabilityEditing}
                    name="type"
                    onChange={(e: any) => handleLiabilityChange(liability.id, e)}
                    options={['Bank Loan', 'Private Borrowing']}
                  />
                  <ProfileField
                    label="Total Amount (Nu.)"
                    value={liability.totalAmountSanctioned}
                    isEditing={isLiabilityEditing}
                    name="totalAmountSanctioned"
                    type="number"
                    onChange={(e: any) => handleLiabilityChange(liability.id, e)}
                  />
                  <ProfileField
                    label="Lender Details"
                    value={liability.lenderDetails}
                    isEditing={isLiabilityEditing}
                    name="lenderDetails"
                    onChange={(e: any) => handleLiabilityChange(liability.id, e)}
                  />
                  <ProfileField
                    label="Borrowing Date"
                    value={liability.borrowingDate}
                    isEditing={isLiabilityEditing}
                    name="borrowingDate"
                    type="date"
                    onChange={(e: any) => handleLiabilityChange(liability.id, e)}
                  />
                </div>

                {isLiabilityEditing && (
                  <button
                    onClick={() => removeLiability(liability.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isLiabilityEditing && (
              <button
                onClick={addLiability}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Liability</span>
              </button>
            )}
          </div>

          {isLiabilityEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setLiabilityEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setLiabilityEditing)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ---------------- EDUCATIONAL EXPENSES ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Educational Expenses</h2>
            {!isEduExpenseEditing && (
              <button
                onClick={() => handleEdit(setEduExpenseEditing)}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.educationalExpenses.map((expense) => (
              <div key={expense.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileField
                    label="Name"
                    value={expense.name}
                    isEditing={isEduExpenseEditing}
                    name="name"
                    onChange={(e: any) => handleEduExpenseChange(expense.id, e)}
                  />
                  <ProfileField
                    label="Relationship"
                    value={expense.relationship}
                    isEditing={isEduExpenseEditing}
                    name="relationship"
                    onChange={(e: any) => handleEduExpenseChange(expense.id, e)}
                  />
                  <ProfileField
                    label="Amount (Nu.)"
                    value={expense.amount}
                    isEditing={isEduExpenseEditing}
                    name="amount"
                    type="number"
                    onChange={(e: any) => handleEduExpenseChange(expense.id, e)}
                  />
                  <ProfileField
                    label="Institution"
                    value={expense.institution}
                    isEditing={isEduExpenseEditing}
                    name="institution"
                    onChange={(e: any) => handleEduExpenseChange(expense.id, e)}
                  />
                  <ProfileField
                    label="Course Level"
                    value={expense.courseLevel}
                    isEditing={isEduExpenseEditing}
                    name="courseLevel"
                    onChange={(e: any) => handleEduExpenseChange(expense.id, e)}
                  />
                </div>

                {isEduExpenseEditing && (
                  <button
                    onClick={() => removeEduExpense(expense.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isEduExpenseEditing && (
              <button
                onClick={addEduExpense}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Educational Expense</span>
              </button>
            )}
          </div>

          {isEduExpenseEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setEduExpenseEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setEduExpenseEditing)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* ---------------- OTHER EXPENSES ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Other Major Expenses</h2>
            {!isOtherExpenseEditing && (
              <button
                onClick={() => handleEdit(setOtherExpenseEditing)}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.otherExpenses.map((expense) => (
              <div key={expense.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileSelect
                    label="Category"
                    value={expense.category}
                    isEditing={isOtherExpenseEditing}
                    name="category"
                    onChange={(e: any) => handleOtherExpenseChange(expense.id, e)}
                    options={['Rental', 'Insurance', 'Loan Repayment', 'Travel', 'Medical Treatment', 'Other']}
                  />
                  <ProfileField
                    label="Details"
                    value={expense.details}
                    isEditing={isOtherExpenseEditing}
                    name="details"
                    onChange={(e: any) => handleOtherExpenseChange(expense.id, e)}
                  />
                  <ProfileField
                    label="Amount (Nu.)"
                    value={expense.amount}
                    isEditing={isOtherExpenseEditing}
                    name="amount"
                    type="number"
                    onChange={(e: any) => handleOtherExpenseChange(expense.id, e)}
                  />
                </div>

                {isOtherExpenseEditing && (
                  <button
                    onClick={() => removeOtherExpense(expense.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isOtherExpenseEditing && (
              <button
                onClick={addOtherExpense}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Other Expense</span>
              </button>
            )}
          </div>

          {isOtherExpenseEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setOtherExpenseEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setOtherExpenseEditing)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
