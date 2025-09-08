interface NetworkInformation {
  // --- Properties ---
  downlink: number; // Mbps estimate, rounded
  downlinkMax?: number; // Experimental: max Mbps supported
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  rtt: number; // Round-trip time estimate (ms)
  saveData: boolean; // User enabled "reduce data" option
  type?:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown'; // Experimental: actual connection type
}

type DeviceInfo = {
  // --- User-Agent / Browser identity ---
  uaBrands?: Array<{ brand: string; version: string }>;
  // Structured browser brand/version (e.g. "Chromium 115").
  // Harder to spoof than userAgent string. Helps confirm browser identity.

  uaMobile?: boolean;
  // Indicates if browser identifies itself as mobile.
  // Cross-check with screen size to detect spoofed environments.

  uaPlatform?: string;
  // Reported OS platform (e.g. "Windows", "Linux", "macOS").
  // Useful for detecting inconsistencies between OS and UA.

  uaPlatformVersion?: string;
  // Some browsers expose OS version here.
  // Adds entropy and helps distinguish devices more precisely.

  // --- Localization & Time context ---
  languages?: string[];
  // List of preferred languages (e.g. ["en-US","es-CR"]).
  // Can be compared to geolocation; mismatches may indicate fraud.

  timeZone?: string;
  // IANA timezone string, e.g. "America/Los_Angeles".
  // Compare to IP location or claimed region.

  // --- Storage / Cookies ---
  cookiesEnabled?: boolean;
  // True if cookies are allowed. Bots/privacy browsers often disable them.

  localStorageEnabled?: boolean;
  // True if localStorage works. Adds entropy and flags restricted contexts.

  sessionStorageEnabled?: boolean;
  // Same as above but for sessionStorage.

  // --- Hardware / Platform ---
  platform?: string;
  // Legacy platform string (e.g. "Win32", "MacIntel").
  // Can differ from uaPlatform; mismatches can signal spoofing.

  hardwareConcurrency?: number;
  // Logical CPU core count. Bots/VMs often report unrealistic values.

  deviceMemoryGb?: number | null;
  // Approximate device RAM (in GB).
  // Helps differentiate mobile/desktop, emulators often misreport.

  // --- Screen / Display characteristics ---
  screenWidth?: number;
  screenHeight?: number;
  // Physical screen resolution. Compare with innerWidth/innerHeight.

  screenAvailWidth?: number;
  screenAvailHeight?: number;
  // Screen size available to browser (after docks/taskbars).
  // Helps spot VMs or headless browsers with default values.

  innerWidth?: number;
  innerHeight?: number;
  // Current viewport size. Cross-check with screen size.

  devicePixelRatio?: number;
  // Ratio between device pixels and CSS pixels.
  // Identifies retina/high-DPI displays. Adds fingerprint entropy.

  maxTouchPoints?: number;
  // Number of simultaneous touch points supported.
  // Distinguishes mobile devices vs desktops.

  // --- Browser feature set ---
  plugins?: string[];
  // Installed browser plugins. Headless browsers often return [].

  mimeTypes?: string[];
  // Supported MIME types. Adds entropy and helps fingerprint.

  // --- Automation / Headless detection ---
  webdriver?: boolean;
  // True if browser is under automation (Selenium, Puppeteer).
  // Strong indicator of bot activity.

  suspectedHeadless?: boolean;
  // Heuristic combining UA, plugins, and webdriver flag.
  // Helps detect headless Chrome/PhantomJS.

  // --- Graphics stack ---
  webglVendor?: string;
  webglRenderer?: string;
  // GPU vendor/renderer strings via WebGL.
  // Hard to spoof consistently, useful for device uniqueness.

  // --- Optional fingerprinting ---
  canvasHash?: string;
  // Hash of a rendered canvas element.
  // Captures subtle GPU/OS/font differences for high-entropy fingerprint.

  network?: NetworkInformation;
  // https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
};

interface Device {
  getDeviceInfo(options?: { includeCanvasHash?: boolean }): DeviceInfo;
}

export { Device, DeviceInfo, NetworkInformation };
