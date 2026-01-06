/**
 * useFormValidation Hook
 * Reusable hook for form validation
 */

import { useState, useCallback } from 'react';
import { validateEmail, validatePassword, validateRequired, validatePasswordMatch } from '../utils/validationUtils';

export const useFormValidation = (initialErrors = {}) => {
  const [errors, setErrors] = useState(initialErrors);

  const setError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateField = useCallback((field, value, rules = {}) => {
    let error = '';

    // Required validation
    if (rules.required) {
      const requiredResult = validateRequired(value, rules.fieldName || field);
      if (!requiredResult.isValid) {
        error = requiredResult.message;
        setError(field, error);
        return false;
      }
    }

    // Email validation
    if (rules.email && value) {
      if (!validateEmail(value)) {
        error = 'Please enter a valid email address';
        setError(field, error);
        return false;
      }
    }

    // Password validation
    if (rules.password && value) {
      const passwordResult = validatePassword(value, rules.minLength || 8);
      if (!passwordResult.isValid) {
        error = passwordResult.message;
        setError(field, error);
        return false;
      }
    }

    // Password match validation
    if (rules.passwordMatch && value) {
      const matchResult = validatePasswordMatch(value, rules.confirmPassword);
      if (!matchResult.isValid) {
        error = matchResult.message;
        setError(field, error);
        return false;
      }
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const customResult = rules.custom(value);
      if (customResult && !customResult.isValid) {
        error = customResult.message || 'Invalid value';
        setError(field, error);
        return false;
      }
    }

    // Clear error if validation passes
    if (!error) {
      clearError(field);
    }

    return !error;
  }, [setError, clearError]);

  const validateForm = useCallback((formData, validationRules) => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field];
      const value = formData[field];
      
      const fieldValid = validateField(field, value, rules);
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  }, [validateField]);

  return {
    errors,
    setError,
    clearError,
    clearAllErrors,
    validateField,
    validateForm,
  };
};

export default useFormValidation;

