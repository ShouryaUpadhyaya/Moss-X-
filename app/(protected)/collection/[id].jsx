import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { addBundleToCart } from "../../store/slices/cartSlice";
import CollectionProducts from "../components/CollectionProducts";
import { useTheme } from "../theme/ThemeContext";

export default function CollectionPage() {
  const { id, type } = useLocalSearchParams();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRouter();

  // Retrieve data from Redux store
  const { allProducts, seasonalCollections, productBundles } = useSelector(
    (state) => state.products
  );

  // Find the collection or bundle based on type and id
  const collection =
    type === "seasonal"
      ? seasonalCollections.find((c) => c.id === id)
      : productBundles.find((b) => b.id === id);

  // Map plant IDs to actual plant objects
  const products = collection
    ? (collection.plants || [])
        .map((plantId) => allProducts.find((p) => p.id === plantId))
        .filter(Boolean)
    : [];

  // Get bundle prices if it's a bundle
  const bundlePrices =
    type === "bundle" && collection
      ? {
          original: collection.OrignalPrice,
          discounted: collection.discounrPrice,
        }
      : null;

  useEffect(() => {
    if (collection) {
      navigation.setOptions({
        title: collection.title,
      });
    }
  }, [collection, navigation]);

  const handleLoadMore = useCallback(async () => {
    // Since we're showing all products at once, we don't need pagination
    return;
  }, []);

  const handleBuyBundle = () => {
    if (type === "bundle" && collection) {
      dispatch(addBundleToCart({ bundle: collection }));
      router.push("/Cart");
    }
  };

  if (!collection) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.errorText, { color: theme.text }]}>
          Collection not found
        </Text>
      </SafeAreaView>
    );
  }

  if (products.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.errorText, { color: theme.text }]}>
          No products found in this collection
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <CollectionProducts
        title={collection.title}
        products={products}
        onLoadMore={handleLoadMore}
        hasMore={false}
        type={type}
        bundlePrices={bundlePrices}
      />
      {type === "bundle" && (
        <View style={[styles.footer, { backgroundColor: theme.surface }]}>
          <Button
            mode="contained"
            onPress={handleBuyBundle}
            style={[styles.buyButton, { backgroundColor: theme.primary }]}
            contentStyle={styles.buttonContent}
          >
            Buy Bundle - ₹{collection.discounrPrice}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
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
  buyButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
