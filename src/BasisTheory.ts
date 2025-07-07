import { logger } from './common/logging';
import { loadElements } from './elements';
import { BasisTheoryElements } from './types/elements';
import { version } from './version';

interface BasisTheoryInitOptions {
  _devMode?: boolean;
  disableTelemetry?: boolean;
  useSameOriginApi?: boolean;
  debug?: boolean;
  base_url?: string;
}

const DEV_ENV_URL = 'https://js.flock-dev.com';
const PROD_ENV_URL = "https://js.basistheory.com";

const basistheory = async (
  apiKey: string,
  options?: BasisTheoryInitOptions
): Promise<BasisTheoryElements | undefined> => {
  if (!apiKey || apiKey.length === 0) {
    throw new Error('API key is required');
  }

  const baseUrl = options?._devMode ? DEV_ENV_URL : options?.base_url ? options.base_url : PROD_ENV_URL;

  logger.setBaseUrl(baseUrl);
  logger.disableTelemetry(Boolean(options?.disableTelemetry));

  const elements = await loadElements(
    `${baseUrl}/web-elements/${version}/client/index.js`
  );

  return elements.init(
    apiKey,
    `${baseUrl}/web-elements/${version}/hosted-elements/`,
    false,
    options?.useSameOriginApi ?? true,
    options?.disableTelemetry ?? false,
    options?.debug ?? false
  );
};

export { basistheory, BasisTheoryInitOptions };
