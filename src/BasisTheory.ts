import { logger } from './common/logging';
import { loadElements } from './elements';
import { BasisTheoryElements } from './types/elements';
import { version } from './version';

interface BasisTheoryInitOptions {
  _devMode?: boolean;
  disableTelemetry?: boolean;
  useSameOriginApi?: boolean;
  debug?: boolean;
}

const TEST_ENV = 'js.flock-dev.com';
const DEFAULT_ENV = 'js.basistheory.com';

const basistheory = async (
  apiKey: string,
  options?: BasisTheoryInitOptions
): Promise<BasisTheoryElements | undefined> => {
  if (!apiKey || apiKey.length === 0) {
    throw new Error('API key is required');
  }

  const baseUrl = options?._devMode ? TEST_ENV : DEFAULT_ENV;

  logger.setBaseUrl(baseUrl);
  logger.disableTelemetry(Boolean(options?.disableTelemetry));

  const elements = await loadElements(
    `https://${baseUrl}/web-elements/${version}/client/index.js`
  );

  return elements.init(
    apiKey,
    `https://${baseUrl}/web-elements/${version}/hosted-elements/`,
    false,
    options?.useSameOriginApi ?? true,
    options?.disableTelemetry ?? false,
    options?.debug ?? false
  );
};

export { basistheory, BasisTheoryInitOptions };
