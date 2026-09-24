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
  PUMP_FUN: "https://pump.fun/coin/5eKbx9ZAspaTqdenTuC3VehD2MjL2fqgFGed4Hgipump",
} as const;

//CA
export const CONTRACT_ADDRESS = "5eKbx9ZAspaTqdenTuC3VehD2MjL2fqgFGed4Hgipump";
export const CONTRACT_ADDRESS_SHORT = "5eKbx9ZAspaTqdenTuC3VehD2MjL2fqgFGed4Hgipump";

// Type for social link keys
export type SocialLinkKey = keyof typeof SOCIAL_LINKS;



export const LOGO= "../assets/images/frepelogo.png";
