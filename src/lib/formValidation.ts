import { Country, COUNTRIES, DEFAULT_COUNTRY } from './countryCodes';

/**
 * Task 1: Name validation & cleaner
 * Name must only contain alphabetic characters, spaces, hyphens, and apostrophes.
 * No numbers are allowed.
 */
export function cleanName(value: string): string {
  // Strip any numbers automatically while typing
  return value.replace(/[0-9]/g, '');
}

export function validateName(value: string, fieldLabel: string = 'Full name'): { isValid: boolean; error: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  // Check if any numbers exist
  if (/[0-9]/.test(value)) {
    return { isValid: false, error: 'Numbers are not allowed in name' };
  }

  // Allow only alphabets, spaces, apostrophes, and hyphens
  const nameRegex = /^[A-Za-z\s.'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'Name can only contain alphabetic letters and spaces' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldLabel} must be at least 2 characters long` };
  }

  return { isValid: true, error: '' };
}

/**
 * Task 2: Email validation & cleaner
 * In email, '@' and '.com' are required.
 * No capital letters are accepted.
 */
export function cleanEmail(value: string): string {
  // Remove whitespace and convert to lowercase automatically
  return value.replace(/\s+/g, '').toLowerCase();
}

export function validateEmail(value: string, isRequired: boolean = true): { isValid: boolean; error: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return isRequired
      ? { isValid: false, error: 'Email address is required' }
      : { isValid: true, error: '' };
  }

  // Check for capital letters
  if (/[A-Z]/.test(trimmed)) {
    return { isValid: false, error: 'Capital letters are not allowed in email' };
  }

  const hasAt = trimmed.includes('@');
  const hasCom = trimmed.endsWith('.com');

  if (!hasAt && !hasCom) {
    return { isValid: false, error: "Email must include '@' and end with '.com'" };
  }

  if (!hasAt) {
    return { isValid: false, error: "Email must include '@'" };
  }

  if (!hasCom) {
    return { isValid: false, error: "Email must end with '.com'" };
  }

  // Strict regex: lowercase only, @ symbol, valid domain, ends with .com
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid lowercase email (e.g. name@gmail.com)' };
  }

  return { isValid: true, error: '' };
}

/**
 * Task 3: Mobile number validation & dummy detection
 * Add country code with search option.
 * Indian mobile numbers: exactly 10 digits, starting with 6, 7, 8, or 9.
 * Do not accept dummy numbers like 1234567890, repeated digits, etc.
 */
export function isDummyPhoneNumber(digits: string): boolean {
  if (digits.length < 6) return false;

  // 1. All same digits (e.g. 0000000000, 1111111111, 9999999999)
  if (/^(\d)\1+$/.test(digits)) {
    return true;
  }

  // 2. Sequential ascending or descending full cycle check
  let isAsc = true;
  let isDesc = true;
  for (let i = 0; i < digits.length - 1; i++) {
    const curr = parseInt(digits[i], 10);
    const next = parseInt(digits[i + 1], 10);
    if ((curr + 1) % 10 !== next) isAsc = false;
    if ((curr - 1 + 10) % 10 !== next) isDesc = false;
  }
  if (isAsc || isDesc) {
    return true;
  }

  // 3. Sequential substring check
  const sequences = [
    '0123456789', '1234567890', '2345678901', '3456789012', '4567890123', '5678901234', '6789012345', '7890123456', '8901234567',
    '9876543210', '0987654321', '8765432109', '7654321098', '6543210987', '5432109876'
  ];
  if (sequences.some((seq) => seq.includes(digits) || digits.includes(seq.slice(0, digits.length)))) {
    return true;
  }

  // 4. Repeated 2-digit patterns (e.g. 1212121212, 9898989898, 6767676767)
  if (/^(\d{2})\1{4,}$/.test(digits)) {
    return true;
  }

  // 5. Repeated 3-digit patterns (e.g. 1231231231)
  if (/^(\d{3})\1{2,}\d*$/.test(digits)) {
    return true;
  }

  // 6. 7 or more identical digits anywhere in the number (e.g. 9999999123, 6111111111)
  if (/(\d)\1{6,}/.test(digits)) {
    return true;
  }

  // 7. Common known dummy numbers
  const knownDummies = [
    '1234567890',
    '9876543210',
    '0123456789',
    '0987654321',
    '1234512345',
    '9876598765',
    '9999988888',
    '8888899999',
  ];
  if (knownDummies.includes(digits)) {
    return true;
  }

  return false;
}

export function cleanPhone(value: string, maxLength: number = 15): string {
  // Keep only digits
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export function validatePhone(
  value: string,
  country: Country = DEFAULT_COUNTRY,
  isRequired: boolean = true
): { isValid: boolean; error: string } {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return isRequired
      ? { isValid: false, error: 'Mobile number is required' }
      : { isValid: true, error: '' };
  }

  // Specific validation for India (+91)
  if (country.code === 'IN' || country.dialCode === '+91') {
    const firstDigit = digits[0];
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      return {
        isValid: false,
        error: 'Indian mobile number must start with 6, 7, 8, or 9',
      };
    }

    if (digits.length !== 10) {
      return {
        isValid: false,
        error: 'Indian mobile number must be exactly 10 digits',
      };
    }

    if (isDummyPhoneNumber(digits)) {
      return {
        isValid: false,
        error: 'Please enter a valid mobile number (dummy or repeated numbers not allowed)',
      };
    }

    return { isValid: true, error: '' };
  }

  // International phone validation
  if (digits.length < country.minLength || digits.length > country.maxLength) {
    if (country.minLength === country.maxLength) {
      return {
        isValid: false,
        error: `${country.name} phone number must be ${country.minLength} digits`,
      };
    }
    return {
      isValid: false,
      error: `${country.name} phone number must be between ${country.minLength} and ${country.maxLength} digits`,
    };
  }

  if (isDummyPhoneNumber(digits)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number (dummy numbers not allowed)',
    };
  }

  return { isValid: true, error: '' };
}
