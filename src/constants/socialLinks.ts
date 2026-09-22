// Social Media and External Links for FREPE Project

export const SOCIAL_LINKS = {
  // Twitter/X
  TWITTER: "https://x.com/frepeofficial",
  TWITTER_INTENT: "https://x.com/intent/tweet",
  
  // Telegram
  TELEGRAM: "https://t.me",
  
  // Pump.fun
  PUMP_FUN: "https://pump.fun/coin/9M6rGJevcRDvqBZS1HWD9RdVpHfgxY8RpxjFn8gZpump",
  
  // Tracking/Analytics
  DEX_SCREENER: "https://dexscreener.com",
  SOLSCAN: "https://solscan.io",
} as const;

// Type for social link keys
export type SocialLinkKey = keyof typeof SOCIAL_LINKS;

// Contract Address for FREPE token
export const CONTRACT_ADDRESS = "9M6rGJevcRDvqBZS1HWD9RdVpHfgxY8RpxjFn8gZpump";

// Short display version for UI elements
export const CONTRACT_ADDRESS_SHORT = "9M6rGJevcRDvqBZS1HWD9RdVpHfgxY8RpxjFn8gZpump";

export const LOGO= "../assets/images/frepelogo.png";
