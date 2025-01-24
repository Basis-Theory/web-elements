import { basistheory } from '~/BasisTheory';
import { loadElements } from '~/elements';

jest.mock('~/elements', () => ({
  loadElements: jest.fn(),
}));

describe('BasisTheory', () => {
  const mockLoadElements = loadElements as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if apiKey is not provided', async () => {
    await expect(basistheory('')).rejects.toThrow('API key is required');
  });

  it('should call loadElements with TEST_ENV when _devMode is true', async () => {
    const mockElements = {
      init: jest.fn().mockResolvedValue('mocked-elements'),
    };
    mockLoadElements.mockResolvedValue(mockElements);

    const apiKey = 'test-api-key';
    const options = { _devMode: true };

    const result = await basistheory(apiKey, options);

    expect(mockLoadElements).toHaveBeenCalledWith(
      `https://js.flock-dev.com/elements`
    );
    expect(mockElements.init).toHaveBeenCalledWith(
      apiKey,
      `https://js.flock-dev.com/hosted-elements`,
      false,
      false,
      false
    );
    expect(result).toBe('mocked-elements');
  });

  it('should call loadElements with DEFAULT_ENV when _devMode is false or undefined', async () => {
    const mockElements = {
      init: jest.fn().mockResolvedValue('mocked-elements'),
    };
    mockLoadElements.mockResolvedValue(mockElements);

    const apiKey = 'test-api-key';

    await basistheory(apiKey);

    expect(mockLoadElements).toHaveBeenCalledWith(
      `https://js.basistheory.com/elements`
    );
    expect(mockElements.init).toHaveBeenCalledWith(
      apiKey,
      `https://js.basistheory.com/hosted-elements`,
      false,
      false,
      false
    );
  });

  it('should propagate an error if loadElements throws', async () => {
    const error = new Error('Failed to load elements');
    mockLoadElements.mockRejectedValue(error);

    const apiKey = 'test-api-key';

    await expect(basistheory(apiKey)).rejects.toThrow(
      'Failed to load elements'
    );
    expect(mockLoadElements).toHaveBeenCalledWith(
      `https://js.basistheory.com/elements`
    );
  });

  it('should propagate an error if elements.init throws', async () => {
    const mockElements = {
      init: jest.fn().mockRejectedValue(new Error('Initialization failed')),
    };
    mockLoadElements.mockResolvedValue(mockElements);

    const apiKey = 'test-api-key';

    await expect(basistheory(apiKey)).rejects.toThrow('Initialization failed');
    expect(mockLoadElements).toHaveBeenCalledWith(
      `https://js.basistheory.com/elements`
    );
    expect(mockElements.init).toHaveBeenCalledWith(
      apiKey,
      `https://js.basistheory.com/hosted-elements`,
      false,
      false,
      false
    );
  });
});
