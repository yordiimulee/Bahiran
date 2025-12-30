const colors = {
  // Primary colors
  primary: "#5D4037",       // Dark brown
  secondary: "#8D6E63",    // Medium brown
  accent: "#A1887F",       // Light brown accent
  
  // Background colors
  background: "#FFFFFF",   // Very light brown/off-white
  cardBackground: "#FFF8F5", // Light beige
  inputBackground: "#F5E9DE", // Light warm beige
  
  // Text colors
  text: "#3E2723",         // Very dark brown for main text
  textSecondary: "#5D4037", // Slightly lighter brown for secondary text
  lightText: "#8D6E63",    // Medium brown for light text
  placeholderText: "#A1887F", // Light brown for placeholders
  
  // Status colors (using brown palette)
  success: "#5D8C7F",      // Muted green-brown
  error: "#8D6E63",        // Warm brown-red
  warning: "#BCAAA4",      // Light brown-orange
  danger: "#8D6E63",       // Warm brown-red (same as error)
  info: "#90A4AE",         // Muted blue-gray
  
  // Common colors
  white: "#FFFFFF",
  black: "#3E2723",        // Very dark brown instead of pure black
  gray: "#BCAAA4",         // Light brown-gray
  lightGray: "#D7CCC8",    // Very light brown
  darkGray: "#5D4037",     // Dark brown instead of dark gray
  
  // Border colors
  border: "#D7CCC8",       // Light brown border
  divider: "#BCAAA4",      // Slightly darker light brown
  
  // Role-specific colors
  owner: "#3E2723",        // Very dark brown
  manager: "#5D4037",      // Dark brown
};

export default colors;

// Dark mode color palette
export const darkColors = {
  // Primary colors
  primary: "#D7CCC8",      // Light brown
  secondary: "#A1887F",    // Medium brown
  accent: "#8D6E63",       // Darker brown accent

  // Background colors
  background: "#1E1B18",   // Very dark brown/black
  cardBackground: "#2A211C", // Dark brown
  inputBackground: "#3E2723", // Dark chocolate brown

  // Text colors
  text: "#EFEBE9",         // Off-white
  textSecondary: "#D7CCC8", // Light brown
  placeholderText: "#8D6E63", // Medium brown

  // Status colors
  success: "#81C784",      // Muted green
  error: "#E57373",        // Soft red
  warning: "#FFB74D",      // Warm orange
  info: "#64B5F6",         // Soft blue

  // Common colors
  white: "#EFEBE9",        // Off-white
  black: "#1E1B18",        // Very dark brown
  gray: "#8D6E63",         // Medium brown
  lightGray: "#A1887F",    // Light brown
  darkGray: "#3E2723",     // Dark brown
  
  // Border colors (added for consistency)
  border: "#5D4037",       // Dark brown border
  divider: "#4E342E",      // Darker brown divider
  
  // Role-specific colors (added for consistency)
  owner: "#D7CCC8",        // Light brown
  manager: "#A1887F"       // Medium brown
} as const;