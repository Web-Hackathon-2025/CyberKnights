import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

export const validateSignup = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').optional().isIn(['user', 'provider']).withMessage('Invalid role'),
  handleValidation,
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  body('platform').optional().isIn(['web', 'mobile']).withMessage('Invalid platform'),
  handleValidation,
];

export const validateGoogleAuth = [
  body('token').notEmpty().withMessage('Google token is required'),
  body('role').optional().isIn(['user', 'provider']).withMessage('Invalid role'),
  body('platform').optional().isIn(['web', 'mobile']).withMessage('Invalid platform'),
  handleValidation,
];

export const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  handleValidation,
];

export const validateEmail = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  handleValidation,
];

export const validateResetPassword = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleValidation,
];

export const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  handleValidation,
];

// ===================
// PATIENT VALIDATORS
// ===================

export const validatePatientBasicInfo = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date of birth'),
  body('contactNumber').optional().trim().notEmpty().withMessage('Contact number cannot be empty'),
  body('city').optional().trim(),
  body('address').optional().trim(),
  handleValidation,
];

export const validatePatientHealthInfo = [
  body('height').optional().isFloat({ min: 0, max: 300 }).withMessage('Invalid height'),
  body('weight').optional().isFloat({ min: 0, max: 500 }).withMessage('Invalid weight'),
  body('bloodGroup').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).withMessage('Invalid blood group'),
  body('allergies').optional().isArray().withMessage('Allergies must be an array'),
  body('medications').optional().isArray().withMessage('Medications must be an array'),
  body('chronicConditions').optional().isArray().withMessage('Chronic conditions must be an array'),
  body('smokerStatus').optional().isIn(['Non-smoker', 'Occasional', 'Daily', '']).withMessage('Invalid smoker status'),
  handleValidation,
];

export const validatePatientMedicalHistory = [
  body('pastSurgeries').optional().isArray().withMessage('Past surgeries must be an array'),
  body('familyMedicalHistory').optional().trim(),
  body('currentHealthConcerns').optional().trim(),
  handleValidation,
];

// ===================
// DOCTOR VALIDATORS
// ===================

export const validateDoctorBasicInfo = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date of birth'),
  body('contactNumber').optional().trim().notEmpty().withMessage('Contact number cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('city').optional().trim(),
  body('country').optional().trim(),
  body('languagesSpoken').optional().isArray().withMessage('Languages spoken must be an array'),
  handleValidation,
];

export const validateDoctorProfessionalInfo = [
  body('pmdcNumber').optional({ values: 'falsy' }).trim().notEmpty().withMessage('PMDC number cannot be empty'),
  body('specialization').optional({ values: 'falsy' }).trim().notEmpty().withMessage('Specialization cannot be empty'),
  body('subspecialty').optional({ values: 'falsy' }).trim(),
  body('qualifications').optional({ values: 'falsy' }).isArray().withMessage('Qualifications must be an array'),
  body('yearsOfExperience')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value === '' || value === null || value === undefined) return true;
      const num = Number(value);
      if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
        throw new Error('Invalid years of experience');
      }
      return true;
    }),
  body('professionalMemberships').optional({ values: 'falsy' }).isArray().withMessage('Professional memberships must be an array'),
  handleValidation,
];

export const validateDoctorConsultationDetails = [
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Invalid consultation fee'),
  body('appointmentDuration').optional().isIn([15, 30, 45, 60]).withMessage('Invalid appointment duration'),
  body('maxPatientsPerDay').optional().isInt({ min: 1 }).withMessage('Invalid max patients per day'),
  body('availableDays').optional().isArray().withMessage('Available days must be an array'),
  body('consultationModes').optional().isArray().withMessage('Consultation modes must be an array'),
  body('bufferTime').optional().isInt({ min: 0 }).withMessage('Invalid buffer time'),
  handleValidation,
];
