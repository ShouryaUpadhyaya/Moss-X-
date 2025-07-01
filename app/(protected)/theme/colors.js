export const lightTheme = {
  primary: "#4CAF50",           // ✅ Keep: Vibrant Green (CTA, accents)
  secondary: "#A5D6A7",         // 🟢 Update: Softer, cleaner green for background elements
  background: "#FAFAFA",        // ✅ Keep: Neutral background
  surface: "#FFFFFF",           // ✅ Keep: Cards, containers
  text: "#1A1A1A",              // 🟢 Updated: True black for readability (main text, titles)
  textSecondary: "#666666",     // 🟢 Updated: Professional light gray for subtext
  border: "#E0E0E0",            // 🟢 Updated: Light neutral for universal border
  error: "#E53935",             // ✅ Keep
  success: "#43A047",           // ✅ Keep
  info: "#1E88E5",              // ✅ Keep
  warning: "#FB8C00",           // ✅ Keep
};


export const darkTheme = {
  primary: "#66BB6A",           // ✅ Keep: For buttons/icons
  secondary: "#A5D6A7",         // 🟢 Updated: Softer complementary green
  background: "#121212",        // ✅ Keep: True black base
  surface: "#1E1E1E",           // ✅ Keep: Cards, panels
  text: "#F1F1F1",              // 🟢 Updated: Light gray-white for readability
  textSecondary: "#BBBBBB",     // 🟢 Updated: Subtle light gray for secondary text
  border: "#2E7D32",            // 🟢 Updated: Use deep green borders only for highlights
  error: "#EF5350",             // ✅ Keep
  success: "#81C784",           // ✅ Keep
  info: "#90CAF9",              // ✅ Keep
  warning: "#FFB74D",           // ✅ Keep
};


const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export default theme;
