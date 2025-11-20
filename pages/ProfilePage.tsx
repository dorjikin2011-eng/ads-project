import React, { useState, useEffect, useRef } from 'react';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';
import CameraIcon from '../components/icons/CameraIcon';
// FIX: Added explicit types for profile data to handle mixed types for family member IDs.
interface FamilyMember {
id: number | string;
name: string;
relationship: string;
occupation: string;
}
interface ProfileData {
personal: {
fullName: string;
officialId: string;
dob: string;
email: string;
phone: string;
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
}
// Mock Data
const initialProfileData: ProfileData = {
personal: {
fullName: 'Kinley Wangchuk',
officialId: '12345',
dob: '1985-06-15',
email: 'kinley.w@gov.bt',
phone: '17123456'
},
presentAddress: {
village: 'Olakha',
gewog: 'Thimphu Thromde',
dzongkhag: 'Thimphu',
houseNo: 'A-123'
},
permanentAddress: {
village: 'Punakha',
gewog: 'Chubu',
dzongkhag: 'Punakha',
houseNo: 'B-45'
},
family: [
{ id: 1, name: 'Pema Lhamo', relationship: 'Spouse', occupation: 'Teacher' },
{ id: 2, name: 'Jigme Dorji', relationship: 'Son', occupation: 'Student' }
]
};
// Reusable component for form fields
const ProfileField = ({ label, value, isEditing, onChange, type = 'text', name = '' }: { label: string; value: any; isEditing?: boolean; onChange?: (e: any) => void; type?: string; name?: string }) => (
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
// Component for a section card
// FIX: Refactored props to a named interface to improve readability and potentially fix type inference issues.
interface ProfileSectionProps {
title: string;
isEditing: boolean;
onEdit: () => void;
onSave: () => void;
onCancel: () => void;
// FIX: Added children to props to allow nesting content inside ProfileSection.
children: React.ReactNode;
}
const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, isEditing, onEdit, onSave, onCancel }) => (
<div className="bg-white rounded-lg shadow-md p-6">
<div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-semibold text-text-main">{title}</h2>
{!isEditing && (
<button onClick={onEdit} className="text-sm font-medium text-accent hover:underline">
Edit
</button>
)}
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{children}
</div>
{isEditing && (
<div className="mt-6 flex justify-end space-x-3">
<button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-text-main hover:bg-gray-50 transition text-sm">
Cancel
</button>
<button onClick={onSave} className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition text-sm">
Save Changes
</button>
</div>
)}
</div>
);
interface ProfilePageProps {
profilePicture: string;
setProfilePicture: (url: string) => void;
}
const ProfilePage: React.FC<ProfilePageProps> = ({ profilePicture, setProfilePicture }) => {
// State for data
const [profile, setProfile] = useState<ProfileData>(initialProfileData);
const [tempProfile, setTempProfile] = useState<ProfileData>(initialProfileData);
code
Code
// State for editing modes
const [isPersonalEditing, setPersonalEditing] = useState(false);
const [isAddressEditing, setAddressEditing] = useState(false);
const [isFamilyEditing, setFamilyEditing] = useState(false);

const [sameAsPresent, setSameAsPresent] = useState(false);

const fileInputRef = useRef<HTMLInputElement>(null);

const handlePictureUploadClick = () => {
    fileInputRef.current?.click();
};

const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            if (typeof loadEvent.target?.result === 'string') {
                setProfilePicture(loadEvent.target.result);
            }
        };
        reader.readAsDataURL(file);
    }
};

// --- Handlers for Personal Info ---
const handlePersonalEdit = () => {
    setTempProfile(profile);
    setPersonalEditing(true);
};
const handlePersonalSave = () => {
    setProfile(tempProfile);
    setPersonalEditing(false);
};
const handlePersonalCancel = () => {
    setTempProfile(profile);
    setPersonalEditing(false);
};
const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
};

// --- Handlers for Address ---
const handleAddressEdit = () => {
    setTempProfile(profile);
    setSameAsPresent(JSON.stringify(profile.presentAddress) === JSON.stringify(profile.permanentAddress));
    setAddressEditing(true);
};
const handleAddressSave = () => {
    let finalProfile = { ...tempProfile };
    if (sameAsPresent) {
        finalProfile = { ...finalProfile, permanentAddress: { ...finalProfile.presentAddress } };
    }
    setProfile(finalProfile);
    setTempProfile(finalProfile);
    setAddressEditing(false);
};
const handleAddressCancel = () => {
    setTempProfile(profile);
    setAddressEditing(false);
};
const handleAddressChange = (section: 'presentAddress' | 'permanentAddress', e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
};

useEffect(() => {
    if(sameAsPresent && isAddressEditing) {
        setTempProfile(prev => ({ ...prev, permanentAddress: { ...prev.presentAddress } }));
    }
}, [sameAsPresent, tempProfile.presentAddress, isAddressEditing])

// --- Handlers for Family ---
const handleFamilyEdit = () => {
    setTempProfile(profile);
    setFamilyEditing(true);
};
const handleFamilySave = () => {
    setProfile(tempProfile);
    setFamilyEditing(false);
};
const handleFamilyCancel = () => {
    setTempProfile(profile);
    setFamilyEditing(false);
};
const handleFamilyChange = (id: number | string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFamily = tempProfile.family.map(member => 
        member.id === id ? { ...member, [name]: value } : member
    );
    setTempProfile(prev => ({ ...prev, family: updatedFamily }));
};
const addFamilyMember = () => {
    const newMember = { id: crypto.randomUUID(), name: '', relationship: '', occupation: '' };
    setTempProfile(prev => ({...prev, family: [...prev.family, newMember]}));
};
const removeFamilyMember = (id: number | string) => {
    const updatedFamily = tempProfile.family.filter(member => member.id !== id);
    setTempProfile(prev => ({...prev, family: updatedFamily}));
};

return (
    <div>
        <h1 className="text-3xl font-bold text-text-main mb-2">Your Profile</h1>
        <p className="text-text-secondary mb-8">Manage your personal information, addresses, and family details.</p>

        <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
                <div className="relative group">
                    <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    <button
                        onClick={handlePictureUploadClick}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300"
                        aria-label="Upload new profile picture"
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
                    <h2 className="text-2xl font-bold text-text-main">{profile.personal.fullName}</h2>
                    <p className="text-text-secondary">Official ID: {profile.personal.officialId}</p>
                </div>
            </div>

            <ProfileSection
                title="Personal Details"
                isEditing={isPersonalEditing}
                onEdit={handlePersonalEdit}
                onSave={handlePersonalSave}
                onCancel={handlePersonalCancel}
            >
                <ProfileField label="Date of Birth" value={tempProfile.personal.dob} isEditing={isPersonalEditing} onChange={handlePersonalChange} name="dob" type="date" />
                <ProfileField label="Email Address" value={tempProfile.personal.email} isEditing={isPersonalEditing} onChange={handlePersonalChange} name="email" type="email" />
                <ProfileField label="Phone Number" value={tempProfile.personal.phone} isEditing={isPersonalEditing} onChange={handlePersonalChange} name="phone" />
            </ProfileSection>

            <ProfileSection
                title="Address Details"
                isEditing={isAddressEditing}
                onEdit={handleAddressEdit}
                onSave={handleAddressSave}
                onCancel={handleAddressCancel}
            >
                <h3 className="text-lg font-semibold text-text-main md:col-span-2">Present Address</h3>
                <ProfileField label="Village / Town" value={tempProfile.presentAddress.village} isEditing={isAddressEditing} onChange={e => handleAddressChange('presentAddress', e)} name="village" />
                <ProfileField label="Gewog / Thromde" value={tempProfile.presentAddress.gewog} isEditing={isAddressEditing} onChange={e => handleAddressChange('presentAddress', e)} name="gewog" />
                <ProfileField label="Dzongkhag / Thromde" value={tempProfile.presentAddress.dzongkhag} isEditing={isAddressEditing} onChange={e => handleAddressChange('presentAddress', e)} name="dzongkhag" />
                <ProfileField label="House No." value={tempProfile.presentAddress.houseNo} isEditing={isAddressEditing} onChange={e => handleAddressChange('presentAddress', e)} name="houseNo" />

                <h3 className="text-lg font-semibold text-text-main md:col-span-2 mt-4">Permanent Address</h3>
                {isAddressEditing && (
                    <div className="flex items-center md:col-span-2">
                         <input type="checkbox" id="sameAsPresent" checked={sameAsPresent} onChange={(e) => setSameAsPresent(e.target.checked)} className="h-4 w-4 text-primary focus:ring-accent border-gray-300 rounded" />
                         <label htmlFor="sameAsPresent" className="ml-2 block text-sm text-text-main">Same as Present Address</label>
                    </div>
                )}
                {!sameAsPresent && (
                    <>
                        <ProfileField label="Village / Town" value={tempProfile.permanentAddress.village} isEditing={isAddressEditing} onChange={e => handleAddressChange('permanentAddress', e)} name="village" />
                        <ProfileField label="Gewog / Thromde" value={tempProfile.permanentAddress.gewog} isEditing={isAddressEditing} onChange={e => handleAddressChange('permanentAddress', e)} name="gewog" />
                        <ProfileField label="Dzongkhag / Thromde" value={tempProfile.permanentAddress.dzongkhag} isEditing={isAddressEditing} onChange={e => handleAddressChange('permanentAddress', e)} name="dzongkhag" />
                        <ProfileField label="House No." value={tempProfile.permanentAddress.houseNo} isEditing={isAddressEditing} onChange={e => handleAddressChange('permanentAddress', e)} name="houseNo" />
                    </>
                )}
            </ProfileSection>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-text-main">Family Details</h2>
                    {!isFamilyEditing && (
                        <button onClick={handleFamilyEdit} className="text-sm font-medium text-accent hover:underline">
                            Edit
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    {tempProfile.family.map((member) => (
                        <div key={member.id} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                            <div className="flex items-start space-x-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ProfileField label="Name" value={member.name} isEditing={isFamilyEditing} onChange={e => handleFamilyChange(member.id, e)} name="name" />
                                    <ProfileField label="Relationship" value={member.relationship} isEditing={isFamilyEditing} onChange={e => handleFamilyChange(member.id, e)} name="relationship" />
                                    <ProfileField label="Occupation" value={member.occupation} isEditing={isFamilyEditing} onChange={e => handleFamilyChange(member.id, e)} name="occupation" />
                                </div>
                                {isFamilyEditing && (
                                    <button onClick={() => removeFamilyMember(member.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition mt-6">
                                        <TrashIcon />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                     {isFamilyEditing && (
                        <button onClick={addFamilyMember} className="flex items-center space-x-2 text-sm font-medium text-accent hover:text-primary">
                            <PlusIcon />
                            <span>Add Family Member</span>
                        </button>
                    )}
                </div>
                 {isFamilyEditing && (
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={handleFamilyCancel} className="px-4 py-2 border border-gray-300 rounded-md text-text-main hover:bg-gray-50 transition text-sm">
                            Cancel
                        </button>
                        <button onClick={handleFamilySave} className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition text-sm">
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