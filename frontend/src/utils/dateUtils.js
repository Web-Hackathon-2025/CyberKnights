// Format date for display
export const formatDate = (date) => {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

// Format time for display
export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

// Format date and time together
export const formatDateTime = (date, time) => {
  return `${formatDate(date)} at ${formatTime(time)}`;
};

// Check if date is in the past
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

// Get minimum bookable date (tomorrow)
export const getMinimumDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Generate available time slots
export const getTimeSlots = (startTime = '09:00', endTime = '18:00') => {
  const slots = [];
  let current = startTime;
  
  while (current <= endTime) {
    slots.push(current);
    // Add 30 minutes
    const [hours, minutes] = current.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + 30;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    current = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }
  
  return slots;
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

// Check if a date is today
export const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  return today.toDateString() === compareDate.toDateString();
};

// Check if a date is tomorrow
export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const compareDate = new Date(date);
  return tomorrow.toDateString() === compareDate.toDateString();
};

// Get day name
export const getDayName = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

// Format for input[type="date"]
export const formatForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

