import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, IconButton, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { useTheme } from "../theme/ThemeContext";

export default function ProductDetail({ product, onBuyNow }) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.includes(product.id);
  const [quantity, setQuantity] = useState(1);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    onBuyNow();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imagesrc }}
          style={styles.image}
          resizeMode="cover"
        />
        <IconButton
          icon={isInWishlist ? "heart" : "heart-outline"}
          size={24}
          iconColor={isInWishlist ? theme.error : theme.text}
          style={[styles.wishlistButton, { backgroundColor: theme.surface }]}
          onPress={handleWishlistToggle}
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          {product.title}
        </Text>

        <View style={styles.ratingContainer}>
          <IconButton icon="star" size={16} iconColor={theme.primary} />
          <Text style={[styles.rating, { color: theme.textSecondary }]}>
            {product.rating} ({product.quantity_sold} sold)
          </Text>
        </View>

        <Text style={[styles.price, { color: theme.primary }]}>
          ₹{product.price}
        </Text>

        <Text style={[styles.description, { color: theme.text }]}>
          {product.discription}
        </Text>

        <View style={styles.statsContainer}>
          <Text style={[styles.stats, { color: theme.textSecondary }]}>
            Stock: {product.stock}
          </Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={[styles.quantityLabel, { color: theme.text }]}>
            Quantity:
          </Text>
          <View style={styles.quantityControls}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              iconColor={theme.primary}
            />
            <Text style={[styles.quantity, { color: theme.text }]}>
              {quantity}
            </Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              iconColor={theme.primary}
            />
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {product.tags.map((tag, index) => (
            <Chip
              key={index}
              style={[styles.tag, { backgroundColor: theme.primary + "20" }]}
              textStyle={{ color: theme.primary }}
            >
              {tag}
            </Chip>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleBuyNow}
            style={[styles.buyButton, { backgroundColor: theme.primary }]}
            contentStyle={styles.buttonContent}
          >
            Buy Now - ₹{product.price * quantity}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  wishlistButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 16,
  },
  stats: {
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    marginRight: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  buyButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
