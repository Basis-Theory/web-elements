import { BasisTheoryValidationError } from './BasisTheoryValidationError';

export const validateCustomDomain = (domain: string): string => {
  if (typeof domain !== 'string' || !domain.trim()) {
    throw new Error('Custom domain must be a non-empty string.');
  }

  let url: URL;
  try {
    url = new URL(
      domain.toLowerCase().startsWith('http') ? domain : `https://${domain}`
    );
  } catch {
    throw new BasisTheoryValidationError(
      `Invalid custom domain: "${domain}"`,
      {}
    );
  }

  if (url.protocol !== 'https:') {
    throw new BasisTheoryValidationError(
      `Custom domain must use HTTPS (got "${url.protocol}")`,
      {}
    );
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new BasisTheoryValidationError(
      `Custom domain must not include path, query, or hash (got "${url.href}")`,
      {}
    );
  }

  if (url.port) {
    throw new BasisTheoryValidationError(
      `Custom domain must not include a port (got ":${url.port}")`,
      {}
    );
  }

  const hostRegex = /^(?=.{1,253}$)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;

  if (!hostRegex.test(url.hostname)) {
    throw new BasisTheoryValidationError(
      `Invalid hostname: "${url.hostname}"`,
      {}
    );
  }

  return url.origin;
};
