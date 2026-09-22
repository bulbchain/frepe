// Social Media and External Links for FREPE Project

export const SOCIAL_LINKS = {
  // Twitter/X
  TWITTER: "https://x.com/frepeofficial",
  TWITTER_INTENT: "https://x.com/intent/tweet",
  
  // Telegram
  TELEGRAM: "https://t.me",
  
  // Pump.fun

  
  // Tracking/Analytics
  DEX_SCREENER: "https://dexscreener.com",
  SOLSCAN: "https://solscan.io",
  PUMP_FUN: "https://pump.fun/coin/",
} as const;

//CA
export const CONTRACT_ADDRESS = "coming soon";
export const CONTRACT_ADDRESS_SHORT = "coming soon";

// Type for social link keys
export type SocialLinkKey = keyof typeof SOCIAL_LINKS;



export const LOGO= "../assets/images/frepelogo.png";
