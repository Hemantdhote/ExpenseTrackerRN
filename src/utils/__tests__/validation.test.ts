import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateAmount,
  validateCategory,
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('returns error when email is empty', () => {
      expect(validateEmail('')).toBe('Email is required');
      expect(validateEmail('   ')).toBe('Email is required');
    });

    it('returns error when email format is invalid', () => {
      expect(validateEmail('hemant')).toBe('Please enter a valid email address');
      expect(validateEmail('hemant@')).toBe('Please enter a valid email address');
      expect(validateEmail('hemant@domain')).toBe('Please enter a valid email address');
    });

    it('returns null for valid emails', () => {
      expect(validateEmail('hemant@example.com')).toBeNull();
      expect(validateEmail('test.user@company.co.in')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('returns error for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
    });

    it('returns error for password shorter than minLength', () => {
      expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
    });

    it('returns null for valid password', () => {
      expect(validatePassword('123456')).toBeNull();
      expect(validatePassword('securePassword123')).toBeNull();
    });
  });

  describe('validateConfirmPassword', () => {
    it('returns error if confirmation is empty', () => {
      expect(validateConfirmPassword('secret', '')).toBe('Please confirm your password');
    });

    it('returns error if passwords do not match', () => {
      expect(validateConfirmPassword('password123', 'password456')).toBe('Passwords do not match');
    });

    it('returns null when passwords match', () => {
      expect(validateConfirmPassword('password123', 'password123')).toBeNull();
    });
  });

  describe('validateName', () => {
    it('returns error if name is empty', () => {
      expect(validateName('')).toBe('Full name is required');
      expect(validateName('   ')).toBe('Full name is required');
    });

    it('returns error if name is too short', () => {
      expect(validateName('H')).toBe('Name must be at least 2 characters');
    });

    it('returns null for valid name', () => {
      expect(validateName('Hemant')).toBeNull();
      expect(validateName('Hemant Dhote')).toBeNull();
    });
  });

  describe('validateAmount', () => {
    it('returns error for invalid or non-positive amount', () => {
      expect(validateAmount('')).toBe('Amount must be greater than 0');
      expect(validateAmount('0')).toBe('Amount must be greater than 0');
      expect(validateAmount('-50')).toBe('Amount must be greater than 0');
      expect(validateAmount('abc')).toBe('Amount must be greater than 0');
    });

    it('returns null for positive amounts', () => {
      expect(validateAmount(450)).toBeNull();
      expect(validateAmount('450.50')).toBeNull();
      expect(validateAmount(40000)).toBeNull();
    });
  });

  describe('validateCategory', () => {
    it('returns error for empty category', () => {
      expect(validateCategory('')).toBe('Category is required');
      expect(validateCategory('   ')).toBe('Category is required');
    });

    it('returns null for valid category', () => {
      expect(validateCategory('Food')).toBeNull();
      expect(validateCategory('Salary')).toBeNull();
    });
  });
});
