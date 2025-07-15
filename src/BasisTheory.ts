import { logger } from './common/logging';
import { loadElements } from './elements';
import { BasisTheoryElements } from './types/elements';
import { version } from './version';
import { CLIENT_JS_URL, HOSTED_ELEMENTS_BASE_URL } from './urls';

interface BasisTheoryInitOptions {
  _devMode?: boolean;
  disableTelemetry?: boolean;
  useSameOriginApi?: boolean;
  useUat?: boolean;
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

  // Use build-time generated URLs if available, otherwise fall back to version-based URLs
  const clientJsUrl =
    CLIENT_JS_URL ||
    `https://${baseUrl}/web-elements/${version}/client/index.js`;
  const hostedElementsBaseUrl =
    HOSTED_ELEMENTS_BASE_URL ||
    `https://${baseUrl}/web-elements/${version}/hosted-elements/`;

  const elements = await loadElements(clientJsUrl);

  return elements.init(
    apiKey,
    hostedElementsBaseUrl,
    false,
    options?.useSameOriginApi ?? true,
    options?.disableTelemetry ?? false,
    options?.debug ?? false,
    options?.useUat ?? false
  );
};

export { basistheory, BasisTheoryInitOptions };
