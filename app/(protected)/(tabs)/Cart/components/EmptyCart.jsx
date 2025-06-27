import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../../theme/ThemeContext";
import styles from "../styles";

export default function EmptyCart() {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.emptyContainer, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.emptyText, { color: theme.text }]}>
        Your cart is empty
      </Text>
    </View>
  );
}
