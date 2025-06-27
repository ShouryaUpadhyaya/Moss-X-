import React from "react";
import { TouchableHighlight, View } from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { useTheme } from "../../../theme/ThemeContext";
import styles from "../styles";

export default function CartFooter({ onCheckoutPress }) {
  const { theme } = useTheme();
  const { total } = useSelector((state) => state.cart);

  return (
    <View style={[styles.footer, { backgroundColor: theme.surface }]}>
      <View style={styles.totalContainer}>
        <Text style={[styles.totalLabel, { color: theme.text }]}>Total:</Text>
        <Text style={[styles.totalAmount, { color: theme.primary }]}>
          ₹{total}
        </Text>
      </View>
      <TouchableHighlight
        onPress={onCheckoutPress}
        style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
        underlayColor={theme.primary + "80"}
      >
        <View style={styles.checkoutButtonContent}>
          <Text style={[styles.checkoutButtonText, { color: "#FFFFFF" }]}>
            Proceed to Checkout
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}
