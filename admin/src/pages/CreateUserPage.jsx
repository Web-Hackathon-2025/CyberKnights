import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, Save } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { handleApiError } from '@/utils/helpers';

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Account Info
    name: '',
    email: '',
    password: '',
    role: 'patient',
    isEmailVerified: true,
    isApproved: false,
    
    // Profile Info - Common
    fullName: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    city: '',
    address: '',
    
    // Patient-specific
    bloodGroup: '',
    height: '',
    weight: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    
    // Doctor-specific
    cnicPassport: {
      documentType: 'CNIC',
      documentNumber: ''
    },
    specialization: '',
    yearsOfExperience: '',
    pmdcNumber: '',
    country: '',
    aboutMe: '',
    consultationFee: '',
    consultationModes: [],
    availableDays: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested object fields (e.g., emergencyContact.name, cnicPassport.documentNumber)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Prepare user data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        isEmailVerified: formData.isEmailVerified,
        isApproved: formData.role === 'doctor' ? formData.isApproved : true,
      };

      // Prepare profile data based on role
      const profileData = {};
      
      if (formData.role === 'patient') {
        if (formData.fullName) profileData.fullName = formData.fullName;
        if (formData.gender) profileData.gender = formData.gender;
        if (formData.dateOfBirth) profileData.dateOfBirth = formData.dateOfBirth;
        if (formData.contactNumber) profileData.contactNumber = formData.contactNumber;
        if (formData.city) profileData.city = formData.city;
        if (formData.address) profileData.address = formData.address;
        if (formData.bloodGroup) profileData.bloodGroup = formData.bloodGroup;
        if (formData.height) profileData.height = parseInt(formData.height);
        if (formData.weight) profileData.weight = parseInt(formData.weight);
        if (formData.emergencyContact.name || formData.emergencyContact.phone) {
          profileData.emergencyContact = {};
          if (formData.emergencyContact.name) profileData.emergencyContact.name = formData.emergencyContact.name;
          if (formData.emergencyContact.phone) profileData.emergencyContact.phone = formData.emergencyContact.phone;
          if (formData.emergencyContact.relationship) profileData.emergencyContact.relationship = formData.emergencyContact.relationship;
        }
      } else if (formData.role === 'doctor') {
        if (formData.fullName) profileData.fullName = formData.fullName;
        if (formData.gender) profileData.gender = formData.gender;
        if (formData.dateOfBirth) profileData.dateOfBirth = formData.dateOfBirth;
        if (formData.contactNumber) profileData.contactNumber = formData.contactNumber;
        if (formData.city) profileData.city = formData.city;
        if (formData.country) profileData.country = formData.country;
        if (formData.address) profileData.address = formData.address;
        if (formData.cnicPassport.documentNumber) {
          profileData.cnicPassport = {
            documentType: formData.cnicPassport.documentType,
            documentNumber: formData.cnicPassport.documentNumber
          };
        }
        if (formData.specialization) profileData.specialization = formData.specialization;
        if (formData.yearsOfExperience) profileData.yearsOfExperience = parseInt(formData.yearsOfExperience);
        if (formData.pmdcNumber) profileData.pmdcNumber = formData.pmdcNumber;
        if (formData.aboutMe) profileData.aboutMe = formData.aboutMe;
        if (formData.consultationFee) profileData.consultationFee = parseInt(formData.consultationFee);
        if (formData.consultationModes && formData.consultationModes.length > 0) profileData.consultationModes = formData.consultationModes;
        if (formData.availableDays && formData.availableDays.length > 0) profileData.availableDays = formData.availableDays;
      }

      if (Object.keys(profileData).length > 0) {
        userData.profile = profileData;
      }

      await adminService.createUser(userData);
      navigate('/users');
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Create New User">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/users')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
          <Button
            type="submit"
            disabled={saving || !formData.name || !formData.email || !formData.password}
            className="gap-2"
          >
            {saving ? (
              <>
                <Spinner size="sm" className="text-white" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create User
              </>
            )}
          </Button>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isEmailVerified"
                    checked={formData.isEmailVerified}
                    onChange={handleChange}
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-neutral-700">Email Verified</span>
                </label>
                {formData.role === 'doctor' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isApproved"
                      checked={formData.isApproved}
                      onChange={handleChange}
                      className="rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-neutral-700">Approved</span>
                  </label>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name (for Profile)</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter full name as it should appear on profile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter city"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Complete address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient-specific fields */}
        {formData.role === 'patient' && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 170"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Emergency contact phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Doctor-specific fields */}
        {formData.role === 'doctor' && (
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">CNIC/Passport Number</label>
                  <input
                    type="text"
                    name="cnicPassport.documentNumber"
                    value={formData.cnicPassport.documentNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="XXXXX-XXXXXXX-X"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Cardiologist"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">PMDC Number</label>
                  <input
                    type="text"
                    name="pmdcNumber"
                    value={formData.pmdcNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="PMDC registration number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Pakistan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Consultation Fee (PKR)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 2000"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">About Me</label>
                  <textarea
                    name="aboutMe"
                    value={formData.aboutMe}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief professional biography"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </AdminLayout>
  );
}
