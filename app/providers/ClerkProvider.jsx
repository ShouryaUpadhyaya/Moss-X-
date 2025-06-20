import { ClerkProvider } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Text } from "react-native";

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayoutNav() {
  const [loaded, error] = useFonts({
    // Add your fonts here if needed
  });

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!loaded) return;
  }, [loaded]);

  if (!loaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <ClerkProvider
      // publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <Slot />
    </ClerkProvider>
  );
}
