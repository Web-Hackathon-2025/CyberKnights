import { parseNumber, extractYear } from '../services/externalApi.service.js';

/**
 * Transform API specialty data to Specialty model schema
 * @param {Object} apiData - Raw API specialty object
 * @returns {Object} Transformed specialty object
 */
export const transformSpecialty = (apiData) => {
  return {
    externalId: apiData.id,
    name: apiData.label,
    slug: apiData.slug,
    description: apiData.description || '',
    totalDoctors: apiData.totalDoctors || 0,
    iconUrl: apiData.primarySvg || '',
    secondaryIconUrl: apiData.secondarySvg || '',
    isTopSpecialty: false, // Will be set separately for top specialties
  };
};

/**
 * Transform API hospital data to Hospital model schema
 * @param {Object} apiData - Raw API hospital object
 * @returns {Object} Transformed hospital object
 */
export const transformHospital = (apiData) => {
  // Use hospitalId, or fallback to slug-city combination
  const externalId = apiData.hospitalId || `${apiData.hospitalSlug}-${apiData.city}`.toLowerCase();
  
  const hospital = {
    externalId,
    name: apiData.hospitalName,
    slug: apiData.hospitalSlug || '',
    address: apiData.hospitalAddress || '',
    city: apiData.city,
    profilePictureUrl: apiData.hospitalProfilePictureUrl || '',
    totalDoctors: apiData.doctorCount || 0,
  };

  // Create GeoJSON point if coordinates exist
  if (apiData.lat && apiData.lon) {
    hospital.location = {
      type: 'Point',
      coordinates: [parseNumber(apiData.lon), parseNumber(apiData.lat)], // [longitude, latitude]
    };
  }

  return hospital;
};

/**
 * Transform API symptom data to Symptom model schema
 * @param {Object} apiData - Raw API symptom object
 * @returns {Object} Transformed symptom object
 */
export const transformSymptom = (apiData) => {
  return {
    externalId: apiData.id,
    name: apiData.label,
    slug: apiData.slug,
    description: apiData.description || '',
    doctorsCount: apiData.doctorsCount || 0,
    // specialties will be added during sync
  };
};

/**
 * Transform API service data to Service model schema
 * @param {Object} apiData - Raw API service object
 * @returns {Object} Transformed service object
 */
export const transformService = (apiData) => {
  return {
    externalId: apiData.id,
    name: apiData.label,
    slug: apiData.slug,
    description: apiData.description || '',
    isSurgery: apiData.isSurgery || false,
    doctorsCount: apiData.doctorsCount || 0,
    // specialties will be added during sync
  };
};

/**
 * Transform API doctor data to ExternalDoctor model schema
 * @param {Object} apiData - Raw API doctor object
 * @param {Object} specialtyMap - Map of specialty slugs to ObjectIds
 * @param {Object} hospitalMap - Map of hospital names to ObjectIds
 * @returns {Object} Transformed doctor object
 */
export const transformDoctor = (apiData, specialtyMap = {}, hospitalMap = {}) => {
  const doctor = {
    externalId: apiData.doctor_id,
    doctorSlug: apiData.doctor_slug || '',
    username: apiData.username || '',
    pseudoId: apiData.pseudoId || '',
    doctorTitle: apiData.doctortitle || '',
    fullName: apiData.doctor_name,
    gender: apiData.gender ? apiData.gender.toLowerCase() : '',
    profilePicture: apiData.profilePicture || '',
    cities: [apiData.city], // Will be merged if doctor appears in multiple cities
    yearsOfExperience: parseNumber(apiData.yearsOfExperience),
    totalReviews: parseNumber(apiData.reviews) || 0,
    averageRating: parseNumber(apiData.rating) || 0,
    satisfactionRate: parseNumber(apiData.satisfiedPatients) || 0,
    isAvailableToday: apiData.isAvailableToday || false,
    isSubscribed: apiData.isSubscribed || false,
    doctorPreference: apiData.doctorInClinicPreference || '',
    lastSyncedAt: new Date(),
  };

  // Map primary specialty
  if (apiData.primary_specialty && apiData.primary_specialty.slug) {
    const specialtyId = specialtyMap[apiData.primary_specialty.slug];
    if (specialtyId) {
      doctor.primarySpecialty = specialtyId;
    }
  }

  // Map all specialties
  if (apiData.all_specialities && Array.isArray(apiData.all_specialities)) {
    doctor.specialties = apiData.all_specialities
      .map(slug => specialtyMap[slug])
      .filter(id => id !== undefined);
  }

  // Transform qualifications
  if (apiData.qualifications && Array.isArray(apiData.qualifications)) {
    doctor.qualifications = apiData.qualifications.map(qual => ({
      degree: qual.qualification?.name || '',
      institution: qual.instituteName || '',
      yearFrom: extractYear(qual.sessionFrom),
      yearTo: extractYear(qual.sessionTo),
      isVerified: qual.isVerified || false,
    }));
  }

  // Store qualification names
  if (apiData.qualifications_names && Array.isArray(apiData.qualifications_names)) {
    doctor.qualificationNames = apiData.qualifications_names;
  }

  // Extract hospitals from schedules
  if (apiData.distinct_schedules && Array.isArray(apiData.distinct_schedules)) {
    const hospitalIds = new Set();
    let minFee = null;

    apiData.distinct_schedules.forEach(schedule => {
      // Extract consultation fee (take minimum)
      const fee = parseNumber(schedule.fee);
      if (fee !== null && (minFee === null || fee < minFee)) {
        minFee = fee;
      }

      // Extract hospital
      if (schedule.hospitalOrClinicName) {
        const hospitalId = hospitalMap[schedule.hospitalOrClinicName.trim()];
        if (hospitalId) {
          hospitalIds.add(hospitalId.toString());
        }
      }

      // Extract consultation modes
      if (schedule.consultationType) {
        if (!doctor.consultationModes) {
          doctor.consultationModes = [];
        }
        if (!doctor.consultationModes.includes(schedule.consultationType)) {
          doctor.consultationModes.push(schedule.consultationType);
        }
      }
    });

    doctor.hospitals = Array.from(hospitalIds);
    if (minFee !== null) {
      doctor.consultationFee = minFee;
    }
  }

  return doctor;
};

/**
 * Merge cities array when same doctor appears in multiple cities
 * @param {Object} existingDoctor - Existing doctor document
 * @param {Object} newDoctorData - New doctor data with cities array
 * @returns {Object} Updated doctor data with merged cities
 */
export const mergeDoctorCities = (existingDoctor, newDoctorData) => {
  const existingCities = new Set(existingDoctor.cities || []);
  const newCities = newDoctorData.cities || [];
  
  newCities.forEach(city => existingCities.add(city));
  
  return {
    ...newDoctorData,
    cities: Array.from(existingCities),
  };
};

export default {
  transformSpecialty,
  transformHospital,
  transformSymptom,
  transformService,
  transformDoctor,
  mergeDoctorCities,
};
