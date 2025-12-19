import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, Save } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { handleApiError } from '@/utils/helpers';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalRole, setOriginalRole] = useState('');
  const [formData, setFormData] = useState({
    // Account Info
    name: '',
    email: '',
    role: '',
    isEmailVerified: false,
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
  });

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUserById(id);
      const user = response.data.user;
      const profile = user.profile || {};
      
      setOriginalRole(user.role);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        isEmailVerified: user.isEmailVerified || false,
        isApproved: user.isApproved || false,
        
        fullName: profile.fullName || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        contactNumber: profile.contactNumber || '',
        city: profile.city || '',
        address: profile.address || '',
        
        // Patient fields
        bloodGroup: profile.bloodGroup || '',
        height: profile.height || '',
        weight: profile.weight || '',
        emergencyContact: {
          name: profile.emergencyContact?.name || '',
          phone: profile.emergencyContact?.phone || '',
          relationship: profile.emergencyContact?.relationship || ''
        },
        
        // Doctor fields
        cnicPassport: {
          documentType: profile.cnicPassport?.documentType || 'CNIC',
          documentNumber: profile.cnicPassport?.documentNumber || ''
        },
        specialization: profile.specialization || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        pmdcNumber: profile.pmdcNumber || '',
        country: profile.country || '',
        aboutMe: profile.aboutMe || '',
        consultationFee: profile.consultationFee || '',
      });
    } catch (error) {
      alert(handleApiError(error));
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested object fields
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
      
      // Prepare user updates
      const updates = {
        name: formData.name,
        email: formData.email,
        isEmailVerified: formData.isEmailVerified,
        isApproved: formData.isApproved,
      };

      // Prepare profile updates based on role
      const profileData = {};
      
      if (originalRole === 'patient') {
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
      } else if (originalRole === 'doctor') {
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
      }

      if (Object.keys(profileData).length > 0) {
        updates.profile = profileData;
      }

      await adminService.updateUser(id, updates);
      navigate(`/users/${id}`);
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit User">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit User">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(`/users/${id}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Details
          </Button>
          <Button
            type="submit"
            disabled={saving || !formData.name || !formData.email}
            className="gap-2"
          >
            {saving ? (
              <>
                <Spinner size="sm" className="text-white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-500 cursor-not-allowed"
                />
                <p className="text-xs text-neutral-500 mt-1">Role cannot be changed</p>
              </div>
              <div className="flex items-center gap-6 pt-6">
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
                {originalRole === 'doctor' && (
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
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient-specific fields */}
        {originalRole === 'patient' && (
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
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Doctor-specific fields */}
        {originalRole === 'doctor' && (
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
