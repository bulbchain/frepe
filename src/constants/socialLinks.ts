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
  PUMP_FUN: "https://pump.fun/coin/G5gMsrWSmB9W3mAZZFGmGTYghSj4ZPd8FS2KAvkipump",
} as const;

//CA
export const CONTRACT_ADDRESS = "G5gMsrWSmB9W3mAZZFGmGTYghSj4ZPd8FS2KAvkipump";
export const CONTRACT_ADDRESS_SHORT = "G5gMsrWSmB9W3mAZZFGmGTYghSj4ZPd8FS2KAvkipump";

// Type for social link keys
export type SocialLinkKey = keyof typeof SOCIAL_LINKS;



export const LOGO= "../assets/images/frepelogo.png";
