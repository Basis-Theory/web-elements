export const getOrCreateScriptElement = (url: string): HTMLScriptElement => {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src^="${url}"]`
  );

  if (existingScript) return existingScript;

  const parent = document.head || document.body;

  if (!parent) {
    throw new Error('No <head> or <body> elements found in the document.');
  }

  const script = Object.assign(document.createElement('script'), { src: url });

  parent.append(script);

  return script;
};
