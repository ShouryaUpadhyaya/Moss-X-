import React, { useCallback, useEffect } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { loadMore, setFilters } from "../../../store/slices/productsSlice";
import CollectionCard from "../../components/CollectionCard";
import FilterBar from "../../components/FilterBar";
import ProductCard from "../../components/ProductCard";
import { useTheme } from "../../theme/ThemeContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.45;

export default function Listing() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const {
    displayedProducts,
    hasMore,
    filters,
    seasonalCollections,
    productBundles,
  } = useSelector((state) => state.products);

  useEffect(() => {
    console.log("Seasonal Collections in Listing:", seasonalCollections);
    console.log("Product Bundles in Listing:", productBundles);
  }, [seasonalCollections, productBundles]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) return;
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch(loadMore());
  }, [dispatch, hasMore]);

  const handleSearch = useCallback(
    (query) => {
      dispatch(setFilters({ searchQuery: query }));
    },
    [dispatch]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const renderHeader = () => (
    <>
      <Text
        variant="displaySmall"
        style={[styles.welcomeText, { color: theme.text }]}
      >
        Welcome Back
      </Text>

      <View style={styles.section}>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          Seasonal Collections
        </Text>
        <FlatList
          horizontal
          data={seasonalCollections || []}
          renderItem={({ item }) => (
            <CollectionCard item={item} type="seasonal" />
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsContainer}
        />
      </View>

      <View style={styles.section}>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          Product Bundles
        </Text>
        <FlatList
          horizontal
          data={productBundles || []}
          renderItem={({ item }) => (
            <CollectionCard item={item} type="bundle" />
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsContainer}
        />
      </View>

      <View style={styles.section}>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: theme.text }]}
        >
          All Products
        </Text>
        <FilterBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
      </View>
    </>
  );

  const renderItem = ({ item }) => (
    <ProductCard item={item} style={styles.productCard} />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={displayedProducts || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeText: {
    padding: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  collectionsContainer: {
    paddingHorizontal: 8,
    gap: 16,
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  productCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
});
