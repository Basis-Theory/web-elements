import { loadElements } from './elements';
import { BasisTheoryElements } from './types/elements';

interface BasisTheoryInitOptions {
  _devMode?: boolean;
  disableTelemetry?: boolean;
  useSameOriginApi?: boolean;
}

const TEST_ENV = 'js.flock-dev.com';
const DEFAULT_ENV = 'js.basistheory.com';

const basistheory = async (
  apiKey: string,
  options?: BasisTheoryInitOptions
): Promise<BasisTheoryElements | undefined> => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const env = options?._devMode ? TEST_ENV : DEFAULT_ENV;

  const elements = await loadElements(`https://${env}/elements`);

  return elements.init(
    apiKey,
    `https://${env}/hosted-elements`,
    false,
    options?.useSameOriginApi ?? false,
    options?.disableTelemetry ?? false
  );
};

export { basistheory, BasisTheoryInitOptions };
