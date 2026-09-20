/**
 * Form Sanitization & Security Utilities
 * 
 * Non-technical explanation:
 * These functions protect the website and student applications against malicious code (XSS),
 * strip dangerous HTML tags, and validate email addresses and USN student IDs.
 */

// Escapes special characters to prevent HTML injection / XSS
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[&<>"'/]/g, (match) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return entities[match] || match;
    });
}

// Validates email address format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Validates College USN (e.g., 4SO22CS001)
export function isValidUSN(usn: string): boolean {
  if (!usn) return true; // Optional field
  const usnRegex = /^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$/i;
  return usnRegex.test(usn.trim());
}

// Strip excessive whitespace and limit length
export function truncateSafe(text: string, maxLength: number): string {
  if (!text) return '';
  return text.slice(0, maxLength);
}
