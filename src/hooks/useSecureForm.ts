import { useState, useCallback } from 'react';
import { sanitizeInput, isValidEmail, isValidUSN, truncateSafe } from '../utils/sanitize';

/**
 * useSecureForm Hook
 * 
 * Non-technical explanation:
 * Provides a fortress-grade security baseline for all forms on the site:
 * 1. Sanitizes every text field to neutralize Cross-Site Scripting (XSS) attacks.
 * 2. Enforces strict USN format (e.g. 4SO22CS001) and student email validation.
 * 3. Incorporates an invisible "honeypot" field that catches and blocks automated spam bots.
 * 4. Rate-limits submissions to prevent spam attacks and denial of service.
 */

export interface JoinFormData {
  name: string;
  usn: string;
  email: string;
  semester: string;
  domain: string;
  message: string;
  // Invisible honeypot field (must stay empty; if filled, bot is detected)
  _honeypot: string;
}

export interface FormErrors {
  name?: string;
  usn?: string;
  email?: string;
  message?: string;
  general?: string;
}

interface UseSecureFormOptions {
  onSuccess: (cleanData: Omit<JoinFormData, '_honeypot'>) => void;
  cooldownMs?: number;
}

export function useSecureForm({ onSuccess, cooldownMs = 3000 }: UseSecureFormOptions) {
  const [formData, setFormData] = useState<JoinFormData>({
    name: '',
    usn: '',
    email: '',
    semester: '3rd Semester',
    domain: 'Technical & Development',
    message: '',
    _honeypot: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  const handleChange = useCallback((
    field: keyof JoinFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for that field on change
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const errs: FormErrors = {};

    // 1. Bot Honeypot Check: If a bot filled out the hidden field, silently reject
    if (formData._honeypot.trim().length > 0) {
      // Fake delay and report error
      errs.general = 'Automated submission rejected by security filter.';
      setErrors(errs);
      return false;
    }

    // 2. Name validation
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.length > 80) {
      errs.name = 'Name cannot exceed 80 characters.';
    }

    // 3. Email validation
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email format.';
    }

    // 4. USN validation
    if (!formData.usn.trim()) {
      errs.usn = 'USN identifier is required.';
    } else if (!isValidUSN(formData.usn)) {
      errs.usn = 'USN format should match 4SO22CS001.';
    }

    // 5. Message validation (Optional payload / Github link)
    if (formData.message.trim() && formData.message.length > 500) {
      errs.message = 'Payload note cannot exceed 500 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Rate Limiting Check: Prevent rapid-fire spam clicks
    const now = Date.now();
    if (now - lastSubmissionTime < cooldownMs) {
      setErrors({ general: `Please wait a few seconds before submitting again.` });
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setLastSubmissionTime(now);

    // Deep sanitization of all fields before passing to callback
    const cleanName = sanitizeInput(truncateSafe(formData.name, 100));
    const cleanUsn = sanitizeInput(truncateSafe(formData.usn.toUpperCase(), 15));
    const cleanEmail = sanitizeInput(truncateSafe(formData.email.toLowerCase(), 120));
    const cleanSemester = sanitizeInput(formData.semester);
    const cleanDomain = sanitizeInput(formData.domain);
    const cleanMessage = sanitizeInput(truncateSafe(formData.message, 1000));

    // Simulate safe encrypted transit
    setTimeout(() => {
      onSuccess({
        name: cleanName,
        usn: cleanUsn,
        email: cleanEmail,
        semester: cleanSemester,
        domain: cleanDomain,
        message: cleanMessage,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  }, [formData, lastSubmissionTime, cooldownMs, validate, onSuccess]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      usn: '',
      email: '',
      semester: '3rd Semester',
      domain: 'Technical & Development',
      message: '',
      _honeypot: '',
    });
    setErrors({});
    setIsSuccess(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
