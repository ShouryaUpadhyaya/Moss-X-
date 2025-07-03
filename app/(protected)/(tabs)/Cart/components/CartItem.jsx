import React from "react";
import { ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../../../../store/slices/cartSlice";
import { useTheme } from "../../../theme/ThemeContext";
import styles from "../styles";

export default function CartItem({ items }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <ScrollView style={styles.scrollView}>
      {items.map((item) => (
        <Card
          key={item.id}
          style={[styles.card, { backgroundColor: theme.surface }]}
        >
          <Card.Content style={styles.cardContent}>
            {/* ... card content ... */}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
