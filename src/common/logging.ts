export const logger = (() => {
  const ddTok = 'pubb96b84a13912504f4354f2d794ea4fab';

  let _disableTelemetry: boolean | undefined;
  let _baseUrl: string | undefined;

  const _log = async (
    message: string,
    level: string,
    attributes = {}
  ): Promise<void> => {
    if (_disableTelemetry) {
      return;
    }

    let env;

    if (!_baseUrl || _baseUrl?.includes('localhost')) {
      env = 'local';
    } else if (_baseUrl.includes('dev')) {
      env = 'dev';
    } else {
      env = 'prod';
    }

    const payload = {
      // dd info
      level,
      message,

      // for basis theory tracking
      service: 'web-elements-loader',
      env,

      // browser information
      referrer: document?.referrer,
      origin: window?.location.origin,
      url: window?.location.href,
      userAgent: navigator?.userAgent,

      // custom values
      ...attributes,
    };

    if (['local', 'dev'].includes(env)) {
      console.log(payload);
    }

    try {
      await fetch(`https://http-intake.logs.datadoghq.com/v1/input/${ddTok}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {
      // eslint-disable-next-line no-console
      console.warn('There was an error sending telemetry.');
    }
  };

  const disableTelemetry = (val: boolean): void => {
    _disableTelemetry = val;
  };

  const setBaseUrl = (baseUrl?: string): void => {
    _baseUrl = baseUrl;
  };

  return {
    disableTelemetry,
    setBaseUrl,
    log: {
      error: (message: string, attributes = {}) =>
        _log(message, 'error', attributes),
      info: (message: string, attributes = {}) =>
        _log(message, 'info', attributes),
      warn: (message: string, attributes = {}) =>
        _log(message, 'warn', attributes),
    },
  };
})();
