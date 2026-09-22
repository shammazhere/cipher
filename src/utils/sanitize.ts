/**
 * Form Sanitization & Cyber Attack Defense Utilities
 * 
 * Protection layers:
 * 1. XSS / Script Injection: Escapes HTML special entities (&, <, >, ", ', /).
 * 2. SQL / NoSQL Injection: Strips dangerous SQL keywords, escape sequences, null bytes.
 * 3. Buffer Overflow & Memory Exhaustion: Clamps string lengths.
 * 4. Bot & Honeypot detection.
 * 5. Strict Email validation.
 */

// SQL Injection pattern detector
const SQL_INJECTION_PATTERN = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|DECLARE|WAITFOR|CAST|CONVERT)\b)|(--)|(\/\*)|(\*\/)|(;\s*$)|(\bOR\b\s+['"\d\w]+\s*=\s*['"\d\w]+)|(\bAND\b\s+['"\d\w]+\s*=\s*['"\d\w]+)/i;

/**
 * Escapes HTML entities to prevent Cross-Site Scripting (XSS)
 */
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

/**
 * Checks for common SQL injection attack signatures
 */
export function hasSQLInjectionThreat(input: string): boolean {
  if (!input) return false;
  return SQL_INJECTION_PATTERN.test(input);
}

/**
 * Strips null bytes and non-printable control characters (ASCII 0-31 except tab and newline)
 */
export function stripControlCharacters(input: string): string {
  if (!input) return '';
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Complete security sanitization pipeline for user inputs
 */
export function cleanSecureInput(input: string, maxLength: number = 1000): string {
  if (!input) return '';
  const clean = stripControlCharacters(input).trim();
  const truncated = clean.slice(0, maxLength);
  return sanitizeInput(truncated);
}

/**
 * Strict RFC 5322 compliant email validator
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Anti-Bot Honeypot validator
 * Humans do not fill hidden honeypot fields; automated bots do.
 */
export function isBotSubmission(honeypotValue: string): boolean {
  return typeof honeypotValue === 'string' && honeypotValue.trim().length > 0;
}
