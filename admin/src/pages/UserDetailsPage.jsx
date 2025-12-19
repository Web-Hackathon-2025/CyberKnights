import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, MapPin, FileText, Award, Briefcase, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { formatDate, handleApiError } from '@/utils/helpers';

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUserById(id);
      setUser(response.data.user);
    } catch (error) {
      alert(handleApiError(error));
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'doctor': return 'info';
      case 'patient': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Details">
        <Card>
          <CardContent>
            <p className="text-center py-12 text-neutral-500">User not found</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const profile = user.profile || {};

  return (
    <AdminLayout title="User Details">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/users')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/users/${id}/edit`)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit User
            </Button>
            {user.role !== 'admin' && (
              <Button
                variant="error"
                onClick={() => {/* Handle delete */}}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* User Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-800">{user.name}</h2>
                    <p className="text-neutral-600 mt-1">{user.email}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                      <Badge variant={user.isApproved ? 'success' : 'warning'}>
                        {user.isApproved ? 'Approved' : 'Pending Approval'}
                      </Badge>
                      <Badge variant={user.isEmailVerified ? 'success' : 'error'}>
                        {user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-neutral-500">Joined</p>
                      <p className="font-medium text-neutral-800">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-neutral-500">Last Updated</p>
                      <p className="font-medium text-neutral-800">{formatDate(user.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-neutral-500">User ID</label>
                <p className="mt-1 text-neutral-800 font-mono text-sm">{user._id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Role</label>
                <p className="mt-1 text-neutral-800 capitalize">{user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Email</label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <p className="text-neutral-800">{user.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Email Verification Status</label>
                <div className="mt-1 flex items-center gap-2">
                  {user.isEmailVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <p className="text-neutral-800">{user.isEmailVerified ? 'Verified' : 'Not Verified'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Approval Status</label>
                <div className="mt-1 flex items-center gap-2">
                  {user.isApproved ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-orange-500" />
                  )}
                  <p className="text-neutral-800">{user.isApproved ? 'Approved' : 'Pending'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Account Created</label>
                <p className="mt-1 text-neutral-800">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information - Patient */}
        {user.role === 'patient' && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-neutral-500">Full Name</label>
                  <p className="mt-1 text-neutral-800">{profile.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Date of Birth</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <p className="text-neutral-800">{profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Gender</label>
                  <p className="mt-1 text-neutral-800 capitalize">{profile.gender || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Phone Number</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <p className="text-neutral-800">{profile.contactNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">City</label>
                  <p className="mt-1 text-neutral-800">{profile.city || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Blood Group</label>
                  <p className="mt-1 text-neutral-800">{profile.bloodGroup || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Height (cm)</label>
                  <p className="mt-1 text-neutral-800">{profile.height || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Weight (kg)</label>
                  <p className="mt-1 text-neutral-800">{profile.weight || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-neutral-500">Address</label>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                    <p className="text-neutral-800">{profile.address || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Emergency Contact Name</label>
                  <p className="mt-1 text-neutral-800">{profile.emergencyContact?.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Emergency Contact Phone</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <p className="text-neutral-800">{profile.emergencyContact?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500">Relationship</label>
                  <p className="mt-1 text-neutral-800">{profile.emergencyContact?.relationship || 'Not provided'}</p>
                </div>
              </div>

              {/* Medical History */}
              {profile.medicalHistory && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="font-semibold text-neutral-800 mb-4">Medical History</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Allergies</label>
                      <p className="mt-1 text-neutral-800">{profile.medicalHistory.allergies?.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Chronic Conditions</label>
                      <p className="mt-1 text-neutral-800">{profile.medicalHistory.chronicConditions?.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Current Medications</label>
                      <p className="mt-1 text-neutral-800">{profile.medicalHistory.currentMedications?.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Past Surgeries</label>
                      <p className="mt-1 text-neutral-800">{profile.medicalHistory.pastSurgeries?.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Profile Information - Doctor */}
        {user.role === 'doctor' && (
          <>
            {/* Basic Doctor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Doctor Profile - Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-neutral-500">Full Name</label>
                    <p className="mt-1 text-neutral-800">{profile.fullName || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Gender</label>
                    <p className="mt-1 text-neutral-800 capitalize">{profile.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Date of Birth</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <p className="text-neutral-800">{profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Phone Number</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <p className="text-neutral-800">{profile.contactNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">CNIC/Passport</label>
                    <p className="mt-1 text-neutral-800">{profile.cnicPassport?.documentNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">City</label>
                    <p className="mt-1 text-neutral-800">{profile.city || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Country</label>
                    <p className="mt-1 text-neutral-800">{profile.country || 'Not provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-neutral-500">Address</label>
                    <div className="mt-1 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-neutral-400 mt-0.5" />
                      <p className="text-neutral-800">{profile.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Specialization</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-neutral-400" />
                      <p className="text-neutral-800">{profile.specialization || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Years of Experience</label>
                    <p className="mt-1 text-neutral-800">{profile.yearsOfExperience || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">PMDC Number</label>
                    <div className="mt-1 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <p className="text-neutral-800">{profile.pmdcNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Consultation Fee (PKR)</label>
                    <p className="mt-1 text-neutral-800">{profile.consultationFee || 'Not provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-neutral-500">About Me</label>
                    <p className="mt-1 text-neutral-800">{profile.aboutMe || 'Not provided'}</p>
                  </div>
                </div>

                {/* Qualifications */}
                {profile.qualifications && profile.qualifications.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Qualifications
                    </h3>
                    <div className="space-y-3">
                      {profile.qualifications.map((qual, idx) => (
                        <div key={idx} className="bg-neutral-50 p-4 rounded-lg">
                          <p className="font-medium text-neutral-800">{qual.degree}</p>
                          <p className="text-sm text-neutral-600 mt-1">{qual.institution}</p>
                          <p className="text-sm text-neutral-500 mt-1">Year: {qual.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expertise */}
                {profile.expertise && profile.expertise.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <h3 className="font-semibold text-neutral-800 mb-4">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise.map((exp, idx) => (
                        <Badge key={idx} variant="info">{exp}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Consultation Details */}
            <Card>
              <CardHeader>
                <CardTitle>Consultation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Consultation Fee</label>
                    <div className="mt-1 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-neutral-400" />
                      <p className="text-neutral-800">PKR {profile.consultationFee || 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Consultation Modes</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {profile.consultationModes && profile.consultationModes.length > 0 ? (
                        profile.consultationModes.map((mode, idx) => (
                          <Badge key={idx}>{mode}</Badge>
                        ))
                      ) : (
                        <p className="text-neutral-800">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Available Days</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {profile.availability?.days && profile.availability.days.length > 0 ? (
                        profile.availability.days.map((day, idx) => (
                          <Badge key={idx}>{day}</Badge>
                        ))
                      ) : (
                        <p className="text-neutral-800">Not provided</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Available Time</label>
                    <p className="mt-1 text-neutral-800">
                      {profile.availability?.timeFrom && profile.availability?.timeTo
                        ? `${profile.availability.timeFrom} - ${profile.availability.timeTo}`
                        : 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification & Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Verification & Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Verification Status</label>
                    <p className="mt-1 text-neutral-800">{profile.verificationStatus || 'Pending'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Profile Submitted</label>
                    <div className="mt-1 flex items-center gap-2">
                      {profile.profileSubmittedForReview ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <p className="text-neutral-800">{profile.profileSubmittedForReview ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Current Step</label>
                    <p className="mt-1 text-neutral-800">Step {profile.currentStep || 1} of 5</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Submitted At</label>
                    <p className="mt-1 text-neutral-800">{profile.submittedAt ? formatDate(profile.submittedAt) : 'Not submitted'}</p>
                  </div>
                </div>

                {profile.completedSteps && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <h3 className="font-semibold text-neutral-800 mb-4">Completed Steps</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profile.completedSteps).map(([step, completed]) => (
                        <Badge key={step} variant={completed ? 'success' : 'default'}>
                          {step.replace('step', 'Step ')} {completed ? '✓' : '✗'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Documents */}
                {(profile.pmdcLicense || (profile.degreeDocuments && profile.degreeDocuments.length > 0)) && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <h3 className="font-semibold text-neutral-800 mb-4">Verification Documents</h3>
                    <div className="space-y-3">
                      {profile.pmdcLicense && (
                        <div>
                          <label className="text-sm font-medium text-neutral-500">PMDC License</label>
                          <a 
                            href={profile.pmdcLicense} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-1 flex items-center gap-2 text-primary-600 hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            View License Document
                          </a>
                        </div>
                      )}
                      {profile.degreeDocuments && profile.degreeDocuments.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-neutral-500">Degree Documents</label>
                          <div className="mt-2 space-y-2">
                            {profile.degreeDocuments.map((doc, idx) => (
                              <a 
                                key={idx}
                                href={doc} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary-600 hover:underline"
                              >
                                <FileText className="w-4 h-4" />
                                Degree Document {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {profile.rejectionReason && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <label className="text-sm font-medium text-red-600">Rejection Reason</label>
                    <p className="mt-1 text-neutral-800 bg-red-50 p-4 rounded-lg">{profile.rejectionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
