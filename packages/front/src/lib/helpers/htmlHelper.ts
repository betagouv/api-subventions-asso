export const HTML_BUTTON_TYPES = ["button", "submit", "reset"] as const;

export const isValidButtonType = type => HTML_BUTTON_TYPES.includes(type);
