// pages/AdaProfilePage.tsx
// ------------------------------------------------------------
// COPY OF DECLARANT'S PROFILE PAGE ADAPTED FOR ADA
// ------------------------------------------------------------

import React, { useState, useEffect, useRef } from 'react';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';
import CameraIcon from '../components/icons/CameraIcon';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15);

// ------------------ INTERFACES ----------------------------
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  occupation: string;
}

interface AssetItem {
  id: string;
  type: string;
  description: string;
  value: string;
}

interface LiabilityItem {
  id: string;
  source: string;
  amount: string;
  remarks: string;
}

interface ExpenditureItem {
  id: string;
  category: string;
  amount: string;
  remarks: string;
}

interface ProfileData {
  personal: {
    fullName: string;
    officialId: string;
    dob: string;
    email: string;
    phone: string;
  };
  agency: {
    name: string;
    department: string;
    position: string;
    officeAddress: string;
  };
  presentAddress: {
    village: string;
    gewog: string;
    dzongkhag: string;
    houseNo: string;
  };
  permanentAddress: {
    village: string;
    gewog: string;
    dzongkhag: string;
    houseNo: string;
  };
  family: FamilyMember[];
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  expenditures: ExpenditureItem[];
}

// ------------------ INITIAL DATA ----------------------------
const initialProfileData: ProfileData = {
  personal: {
    fullName: 'Karma Wangdi',
    officialId: 'ADA-2023-002',
    dob: '1988-09-12',
    email: 'karma.w@agency.gov.bt',
    phone: '17123457',
  },
  agency: {
    name: 'Ministry of Finance',
    department: 'Administration Division',
    position: 'Asset Declaration Administrator',
    officeAddress: 'Ministry of Finance, Thimphu',
  },
  presentAddress: {
    village: 'Babesa',
    gewog: 'Thimphu Thromde',
    dzongkhag: 'Thimphu',
    houseNo: 'ADA-202',
  },
  permanentAddress: {
    village: 'Wangdue',
    gewog: 'Thedtsho',
    dzongkhag: 'Wangdue Phodrang',
    houseNo: '78',
  },
  family: [
    { id: '1', name: 'Dema Wangmo', relationship: 'Spouse', occupation: 'Nurse' },
    { id: '2', name: 'Kinzang Dorji', relationship: 'Son', occupation: 'Primary School' },
  ],
  assets: [],
  liabilities: [],
  expenditures: [],
};

// ---------------- COMPONENTS -------------------
const ProfileField = ({
  label, value, isEditing, onChange, type = 'text', name = '',
}: any) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary">{label}</label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm"
      />
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

const AdaProfilePage: React.FC<Props> = ({ profilePicture, setProfilePicture }) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfileData);
  const [tempProfile, setTempProfile] = useState<ProfileData>(initialProfileData);

  const [isPersonalEditing, setPersonalEditing] = useState(false);
  const [isAgencyEditing, setAgencyEditing] = useState(false);
  const [isAddressEditing, setAddressEditing] = useState(false);
  const [isFamilyEditing, setFamilyEditing] = useState(false);
  const [isAssetEditing, setAssetEditing] = useState(false);
  const [isLiabilityEditing, setLiabilityEditing] = useState(false);
  const [isExpenditureEditing, setExpenditureEditing] = useState(false);

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

  // ---------------- PERSONAL HANDLERS ----------------
  const handleEdit = (setter: any) => { setTempProfile(profile); setter(true); };
  const handleSave = (setter: any) => { setProfile(tempProfile); setter(false); };
  const handleCancel = (setter: any) => { setTempProfile(profile); setter(false); };

  const handlePersonalChange = (e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      personal: { ...p.personal, [name]: value },
    }));
  };

  // ---------------- AGENCY CHANGE ----------------
  const handleAgencyChange = (e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      agency: { ...p.agency, [name]: value },
    }));
  };

  // ---------------- ADDRESS CHANGE ----------------
  const handleAddressChange = (section: 'presentAddress' | 'permanentAddress', e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      [section]: { ...p[section], [name]: value },
    }));
  };

  useEffect(() => {
    if (sameAsPresent && isAddressEditing) {
      setTempProfile((p) => ({
        ...p,
        permanentAddress: { ...p.presentAddress },
      }));
    }
  }, [sameAsPresent, tempProfile.presentAddress]);

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
      family: [...p.family, { id: generateId(), name: '', relationship: '', occupation: '' }],
    }));
  };

  const removeFamilyMember = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      family: p.family.filter((m) => m.id !== id),
    }));
  };

  // ---------------- ASSET HANDLERS ----------------
  const handleAssetChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      assets: p.assets.map((a) => (a.id === id ? { ...a, [name]: value } : a)),
    }));
  };

  const addAsset = () => {
    setTempProfile((p) => ({
      ...p,
      assets: [...p.assets, { id: generateId(), type: '', description: '', value: '' }],
    }));
  };

  const removeAsset = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      assets: p.assets.filter((a) => a.id !== id),
    }));
  };

  // ---------------- LIABILITIES HANDLERS ----------------
  const handleLiabilityChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      liabilities: p.liabilities.map((a) =>
        a.id === id ? { ...a, [name]: value } : a
      ),
    }));
  };

  const addLiability = () => {
    setTempProfile((p) => ({
      ...p,
      liabilities: [
        ...p.liabilities,
        { id: generateId(), source: '', amount: '', remarks: '' },
      ],
    }));
  };

  const removeLiability = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      liabilities: p.liabilities.filter((a) => a.id !== id),
    }));
  };

  // ---------------- EXPENDITURE HANDLERS ----------------
  const handleExpenditureChange = (id: string, e: any) => {
    const { name, value } = e.target;
    setTempProfile((p) => ({
      ...p,
      expenditures: p.expenditures.map((a) =>
        a.id === id ? { ...a, [name]: value } : a
      ),
    }));
  };

  const addExpenditure = () => {
    setTempProfile((p) => ({
      ...p,
      expenditures: [
        ...p.expenditures,
        { id: generateId(), category: '', amount: '', remarks: '' },
      ],
    }));
  };

  const removeExpenditure = (id: string) => {
    setTempProfile((p) => ({
      ...p,
      expenditures: p.expenditures.filter((a) => a.id !== id),
    }));
  };

  // ---------------- RENDER ----------------
  return (
    <div>
      {/* CHANGED: Updated title to indicate ADA */}
      <h1 className="text-3xl font-bold text-text-main mb-2">Your Profile - Asset Declaration Administrator</h1>
      <p className="text-text-secondary mb-8">
        Manage your personal information, addresses, family, assets, liabilities & expenditures.
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
              {profile.personal.fullName}
            </h2>
            <p className="text-text-secondary">Official ID: {profile.personal.officialId}</p>
            {/* CHANGED: Added ADA indicator */}
            <p className="text-sm text-primary font-medium">Asset Declaration Administrator</p>
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
            label="Date of Birth"
            value={tempProfile.personal.dob}
            isEditing={isPersonalEditing}
            name="dob"
            type="date"
            onChange={handlePersonalChange}
          />
          <ProfileField
            label="Email"
            value={tempProfile.personal.email}
            isEditing={isPersonalEditing}
            name="email"
            type="email"
            onChange={handlePersonalChange}
          />
          <ProfileField
            label="Phone Number"
            value={tempProfile.personal.phone}
            isEditing={isPersonalEditing}
            name="phone"
            onChange={handlePersonalChange}
          />
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
          />
          <ProfileField
            label="Department / Division"
            value={tempProfile.agency.department}
            isEditing={isAgencyEditing}
            name="department"
            onChange={handleAgencyChange}
          />
          <ProfileField
            label="Position Title"
            value={tempProfile.agency.position}
            isEditing={isAgencyEditing}
            name="position"
            onChange={handleAgencyChange}
          />
          <ProfileField
            label="Office Address"
            value={tempProfile.agency.officeAddress}
            isEditing={isAgencyEditing}
            name="officeAddress"
            onChange={handleAgencyChange}
          />
        </ProfileSection>

        {/* ---------------- ADDRESS DETAILS ---------------- */}
        <ProfileSection
          title="Address Details"
          isEditing={isAddressEditing}
          onEdit={() => {
            setSameAsPresent(
              JSON.stringify(profile.presentAddress) ===
                JSON.stringify(profile.permanentAddress)
            );
            handleEdit(setAddressEditing);
          }}
          onSave={() => {
            let updated = { ...tempProfile };
            if (sameAsPresent) updated.permanentAddress = { ...updated.presentAddress };
            setProfile(updated);
            setTempProfile(updated);
            setAddressEditing(false);
          }}
          onCancel={() => handleCancel(setAddressEditing)}
        >
          {/* Present Address */}
          <h3 className="text-lg font-semibold md:col-span-2">Present Address</h3>
          <ProfileField
            label="Village / Town"
            value={tempProfile.presentAddress.village}
            isEditing={isAddressEditing}
            name="village"
            onChange={(e: any) => handleAddressChange('presentAddress', e)}
          />
          <ProfileField
            label="Gewog / Thromde"
            value={tempProfile.presentAddress.gewog}
            isEditing={isAddressEditing}
            name="gewog"
            onChange={(e: any) => handleAddressChange('presentAddress', e)}
          />
          <ProfileField
            label="Dzongkhag / Thromde"
            value={tempProfile.presentAddress.dzongkhag}
            isEditing={isAddressEditing}
            name="dzongkhag"
            onChange={(e: any) => handleAddressChange('presentAddress', e)}
          />
          <ProfileField
            label="House No."
            value={tempProfile.presentAddress.houseNo}
            isEditing={isAddressEditing}
            name="houseNo"
            onChange={(e: any) => handleAddressChange('presentAddress', e)}
          />

          {/* Permanent Address */}
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
                value={tempProfile.permanentAddress.village}
                isEditing={isAddressEditing}
                name="village"
                onChange={(e: any) => handleAddressChange('permanentAddress', e)}
              />
              <ProfileField
                label="Gewog / Thromde"
                value={tempProfile.permanentAddress.gewog}
                isEditing={isAddressEditing}
                name="gewog"
                onChange={(e: any) => handleAddressChange('permanentAddress', e)}
              />
              <ProfileField
                label="Dzongkhag / Thromde"
                value={tempProfile.permanentAddress.dzongkhag}
                isEditing={isAddressEditing}
                name="dzongkhag"
                onChange={(e: any) => handleAddressChange('permanentAddress', e)}
              />
              <ProfileField
                label="House No."
                value={tempProfile.permanentAddress.houseNo}
                isEditing={isAddressEditing}
                name="houseNo"
                onChange={(e: any) => handleAddressChange('permanentAddress', e)}
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
                  />
                  <ProfileField
                    label="Relationship"
                    value={f.relationship}
                    isEditing={isFamilyEditing}
                    name="relationship"
                    onChange={(e: any) => handleFamilyChange(f.id, e)}
                  />
                  <ProfileField
                    label="Occupation"
                    value={f.occupation}
                    isEditing={isFamilyEditing}
                    name="occupation"
                    onChange={(e: any) => handleFamilyChange(f.id, e)}
                  />
                </div>

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

        {/* ---------------- ASSETS ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Assets</h2>
            {!isAssetEditing && (
              <button
                onClick={() => handleEdit(setAssetEditing)}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.assets.map((a) => (
              <div key={a.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileField
                    label="Asset Type"
                    value={a.type}
                    isEditing={isAssetEditing}
                    name="type"
                    onChange={(e: any) => handleAssetChange(a.id, e)}
                  />
                  <ProfileField
                    label="Description"
                    value={a.description}
                    isEditing={isAssetEditing}
                    name="description"
                    onChange={(e: any) => handleAssetChange(a.id, e)}
                  />
                  <ProfileField
                    label="Estimated Value"
                    value={a.value}
                    isEditing={isAssetEditing}
                    name="value"
                    onChange={(e: any) => handleAssetChange(a.id, e)}
                  />
                </div>

                {isAssetEditing && (
                  <button
                    onClick={() => removeAsset(a.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isAssetEditing && (
              <button
                onClick={addAsset}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Asset</span>
              </button>
            )}
          </div>

          {isAssetEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setAssetEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setAssetEditing)}
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
            {tempProfile.liabilities.map((a) => (
              <div key={a.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileField
                    label="Source"
                    value={a.source}
                    isEditing={isLiabilityEditing}
                    name="source"
                    onChange={(e: any) => handleLiabilityChange(a.id, e)}
                  />
                  <ProfileField
                    label="Amount"
                    value={a.amount}
                    isEditing={isLiabilityEditing}
                    name="amount"
                    onChange={(e: any) => handleLiabilityChange(a.id, e)}
                  />
                  <ProfileField
                    label="Remarks"
                    value={a.remarks}
                    isEditing={isLiabilityEditing}
                    name="remarks"
                    onChange={(e: any) => handleLiabilityChange(a.id, e)}
                  />
                </div>

                {isLiabilityEditing && (
                  <button
                    onClick={() => removeLiability(a.id)}
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

        {/* ---------------- EXPENDITURES ---------------- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Yearly Major Expenditures</h2>
            {!isExpenditureEditing && (
              <button
                onClick={() => handleEdit(setExpenditureEditing)}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {tempProfile.expenditures.map((a) => (
              <div key={a.id} className="p-4 bg-gray-50 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProfileField
                    label="Expenditure Category"
                    value={a.category}
                    isEditing={isExpenditureEditing}
                    name="category"
                    onChange={(e: any) => handleExpenditureChange(a.id, e)}
                  />
                  <ProfileField
                    label="Amount"
                    value={a.amount}
                    isEditing={isExpenditureEditing}
                    name="amount"
                    onChange={(e: any) => handleExpenditureChange(a.id, e)}
                  />
                  <ProfileField
                    label="Remarks"
                    value={a.remarks}
                    isEditing={isExpenditureEditing}
                    name="remarks"
                    onChange={(e: any) => handleExpenditureChange(a.id, e)}
                  />
                </div>

                {isExpenditureEditing && (
                  <button
                    onClick={() => removeExpenditure(a.id)}
                    className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}

            {isExpenditureEditing && (
              <button
                onClick={addExpenditure}
                className="flex items-center space-x-2 text-sm font-medium text-accent"
              >
                <PlusIcon /> <span>Add Expenditure</span>
              </button>
            )}
          </div>

          {isExpenditureEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleCancel(setExpenditureEditing)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(setExpenditureEditing)}
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

export default AdaProfilePage;