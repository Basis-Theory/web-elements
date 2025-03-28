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

  const env = options?._devMode ? TEST_ENV : DEFAULT_ENV;

  const elements = await loadElements(
    `https://${env}/web-elements/${version}/client/index.js`
  );

  return elements.init(
    apiKey,
    `https://${env}/web-elements/${version}/hosted-elements/`,
    false,
    options?.useSameOriginApi ?? true,
    options?.disableTelemetry ?? false,
    options?.debug ?? false
  );
};

export { basistheory, BasisTheoryInitOptions };
