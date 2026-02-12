/**
 * Check if the registration deadline has passed for an event
 * @param {Date|string|null} registrationDeadline - The registration deadline date
 * @returns {boolean} - True if deadline has passed, false otherwise
 */
export function isRegistrationDeadlinePassed(registrationDeadline) {
  if (!registrationDeadline) {
    return false;
  }
  
  const now = new Date();
  const deadline = new Date(registrationDeadline);
  return now > deadline;
}
