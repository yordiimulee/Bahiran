export const colors = {
  // Primary colors
  primary: '#8D6E63',      // Light brown for primary actions
  secondary: '#5D4037',   // Dark brown for secondary actions
  background: '#F5F5F5',
  
  // Text colors
  text: '#5D4037',        // Dark brown for main text
  lightText: '#8D6E63',   // Light brown for secondary text
  
  // Status colors
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  
  // UI colors
  light: '#FFFFFF',
  dark: '#3E2723',        // Very dark brown for contrast
  muted: '#8D6E63',       // Light brown for muted text
  border: '#D7CCC8',      // Light brown border
  cardBackground: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#EFEBE9',   // Very light brown tint
};

export const typography = {
  heading: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  heading2: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  heading3: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subheading: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    color: colors.text,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 14,
    color: colors.text,
  },
  caption: {
    fontFamily: 'System',
    fontSize: 14,
    color: colors.muted,
  },
};
