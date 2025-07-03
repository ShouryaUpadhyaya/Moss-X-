import React from "react";
import { ScrollView, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../../../../store/slices/cartSlice";
import { useTheme } from "../../../theme/ThemeContext";
import styles from "../styles";

export default function CartItemList({ items }) {
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
            <Card.Cover source={{ uri: item.imagesrc }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text
                style={[styles.title, { color: theme.text }]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text style={[styles.price, { color: theme.primary }]}>
                ₹{item.price}
              </Text>
              <View style={styles.quantityContainer}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  iconColor={theme.primary}
                />
                <Text style={[styles.quantity, { color: theme.text }]}>
                  {item.quantity}
                </Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  iconColor={theme.primary}
                />
              </View>
            </View>
            <IconButton
              icon="delete"
              size={24}
              iconColor={theme.error}
              onPress={() => handleRemoveItem(item.id)}
            />
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
