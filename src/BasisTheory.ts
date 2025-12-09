import { logger } from './common/logging';
import { validateCustomDomain } from './common/whitelabelDomainValidation';
import { loadElements } from './elements';
import { BasisTheoryElements } from './types/elements';
import { CLIENT_JS_URL, HOSTED_ELEMENTS_BASE_URL } from './urls';
import { version } from './version';

interface BasisTheoryInitOptions {
  _devMode?: boolean;
  disableTelemetry?: boolean;
  useSameOriginApi?: boolean;
  environment?: string;
  debug?: boolean;
  useNetworkCheck?: boolean;
  customDomain?: string;
}

const TEST_ORIGIN = 'https://js.flock-dev.com';
const DEFAULT_ORIGIN = 'https://js.basistheory.com';

const resolveUrls = (options?: BasisTheoryInitOptions) => {
  if (options?._devMode && options?.customDomain) {
    console.warn(
      'Dev mode and domain whitelabeling are both enabled - dev mode takes precedence.'
    );
  }

  let origin: string;
  if (options?._devMode) {
    origin = TEST_ORIGIN;
  } else if (options?.customDomain) {
    origin = validateCustomDomain(options.customDomain);
  } else {
    origin = DEFAULT_ORIGIN;
  }

  const base = `${origin}/web-elements/${version}`;
  const client = `${base}/client/index.js`;
  const hosted = `${base}/hosted-elements/`;

  if (options?.customDomain && !options._devMode) {
    return { origin, clientJsUrl: client, hostedElementsBaseUrl: hosted };
  }

  return {
    origin,
    clientJsUrl: CLIENT_JS_URL ?? client,
    hostedElementsBaseUrl: HOSTED_ELEMENTS_BASE_URL ?? hosted,
  };
};

const basistheory = async (
  apiKey: string,
  options?: BasisTheoryInitOptions
): Promise<BasisTheoryElements | undefined> => {
  if (!apiKey || apiKey.length === 0) {
    throw new Error('API key is required');
  }

  const { origin, clientJsUrl, hostedElementsBaseUrl } = resolveUrls(options);

  logger.setBaseUrl(origin);
  logger.disableTelemetry(Boolean(options?.disableTelemetry));

  const elements = await loadElements(clientJsUrl);

  return elements.init(
    apiKey,
    hostedElementsBaseUrl,
    false,
    options?.useSameOriginApi ?? true,
    options?.disableTelemetry ?? false,
    options?.debug ?? false,
    options?.environment ?? 'production',
    options?.useNetworkCheck ?? false,
    options?.customDomain ? origin : undefined
  );
};

export { basistheory, BasisTheoryInitOptions };
