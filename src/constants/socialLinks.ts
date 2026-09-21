// Social Media and External Links for FREPE Project

export const SOCIAL_LINKS = {
  // Twitter/X
  TWITTER: "https://x.com/frepeofficial",
  TWITTER_INTENT: "https://x.com/intent/tweet",
  
  // Telegram
  TELEGRAM: "https://t.me",
  
  // Pump.fun
  PUMP_FUN: "https://pump.fun/coin/BTqZkB6HgBmSmckwnmwuQ3QZFQzHZkPwvnXt6MqUpump",
  
  // Tracking/Analytics
  DEX_SCREENER: "https://dexscreener.com",
  SOLSCAN: "https://solscan.io",
} as const;

// Type for social link keys
export type SocialLinkKey = keyof typeof SOCIAL_LINKS;

// Contract Address for FREPE token
export const CONTRACT_ADDRESS = "BTqZkB6HgBmSmckwnmwuQ3QZFQzHZkPwvnXt6MqUpump";

// Short display version for UI elements
export const CONTRACT_ADDRESS_SHORT = "BTqZkB6HgBmSmckwnmwuQ3QZFQzHZkPwvnXt6MqUpump";

export const LOGO= "../assets/images/frepelogo.png";
