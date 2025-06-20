// import { RAYZORPAY_KEY } from "@env";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import RazorpayCheckout from "react-native-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/slices/cartSlice";
import { useTheme } from "../../theme/ThemeContext";
export default function Cart() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handlePayment = async () => {
    try {
      // Check if RazorpayCheckout is available
      if (!RazorpayCheckout) {
        Alert.alert(
          "Payment Unavailable",
          "Razorpay is not available in Expo Go. Please use a development build to test payments.",
          [{ text: "OK" }]
        );
        return;
      }

      console.log(process.env.RAYZORPAY_KEY);

      const options = {
        description: "Payment for Moss X products",
        image: "https://i.imgur.com/3g7nmJC.jpg",
        currency: "INR",
        key: "rzp_test_sn1CP0a3ZzrvdR",
        amount: total * 100, // Amount in paise
        name: "Moss X",
        prefill: {
          email: "customer@example.com",
          contact: "9999999999",
          name: "Customer Name",
        },
        theme: { color: "#53a20e" },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed");
          },
        },
      };

      const paymentData = await RazorpayCheckout.open(options);

      // Handle successful payment
      Alert.alert(
        "Payment Successful",
        `Payment ID: ${paymentData.razorpay_payment_id}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Clear cart after successful payment
              items.forEach((item) => {
                dispatch(removeFromCart(item.id));
              });
            },
          },
        ]
      );
    } catch (error) {
      console.log("Payment Error:", error);

      // Handle specific error cases
      if (error.code === "PAYMENT_CANCELLED") {
        Alert.alert(
          "Payment Cancelled",
          "The payment was cancelled by the user."
        );
      } else if (error.code === "NETWORK_ERROR") {
        Alert.alert(
          "Network Error",
          "Please check your internet connection and try again."
        );
      } else {
        Alert.alert(
          "Payment Failed",
          `Error: ${error.code || "Unknown error"}\n${
            error.description || error.message || ""
          }`,
          [{ text: "OK" }]
        );
      }
    }
  };

  if (items.length === 0) {
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        {items.map((item) => (
          <Card
            key={item.id}
            style={[styles.card, { backgroundColor: theme.surface }]}
          >
            <Card.Content style={styles.cardContent}>
              <Card.Cover
                source={{ uri: item.imagesrc }}
                style={styles.image}
              />
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

      <View style={[styles.footer, { backgroundColor: theme.surface }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total:</Text>
          <Text style={[styles.totalAmount, { color: theme.primary }]}>
            ₹{total}
          </Text>
        </View>
        <TouchableHighlight
          onPress={handlePayment}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: "center",
  },
  footer: {
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  checkoutButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  checkoutButtonContent: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
