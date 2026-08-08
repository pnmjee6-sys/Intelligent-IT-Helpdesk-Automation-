import { Request, Response, NextFunction } from 'express';

const PII_PATTERNS = [
  // Credit Card Numbers
  { pattern: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED_CREDIT_CARD]' },
  // Social Security Numbers (SSN)
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[REDACTED_SSN]' },
  // API Keys / Secrets
  { pattern: /(api[_-]?key|secret|token|password|auth_key)\s*[:=]\s*['"]?([a-zA-Z0-9_\-\.]{8,})['"]?/gi, replacement: '$1: "[REDACTED_SECRET]"' },
];

function redactObject(obj: any): any {
  if (typeof obj === 'string') {
    let sanitized = obj;
    for (const { pattern, replacement } of PII_PATTERNS) {
      sanitized = sanitized.replace(pattern, replacement);
    }
    return sanitized;
  }
  if (Array.isArray(obj)) {
    return obj.map(redactObject);
  }
  if (obj !== null && typeof obj === 'object') {
    const redacted: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      // Don't redact password fields if this is an authentication login/register endpoint
      if (['password', 'password_hash', 'secret'].includes(key.toLowerCase())) {
        redacted[key] = obj[key];
      } else {
        redacted[key] = redactObject(obj[key]);
      }
    }
    return redacted;
  }
  return obj;
}

export function piiRedactor(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = redactObject(req.body);
  }
  if (req.query) {
    req.query = redactObject(req.query);
  }
  next();
}
