import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import mossxJson from "../../../../mossx_plant_dataset.json";
import ProductCard from "../../components/ProductCard";
import { useTheme } from "../../theme/ThemeContext";

// Pre-compute static categories outside component for better performance
const CATEGORIES = (() => {
  const tagSet = new Set();
  mossxJson.product?.forEach(product => {
    product.tags?.forEach(tag => tagSet.add(tag));
  });
  return ["all", ...Array.from(tagSet)];
})();

// Memoized ExploreHeader Component
const ExploreHeader = React.memo(({
  theme,
  insets,
  searchText,
  selectedCategory,
  filteredProductsLength,
  onBackPress,
  onSearchChange,
  onClearSearch,
  onCategoryPress
}) => {
  return (
    <View style={[
      styles.headerContainer,
      { 
        paddingTop: insets.top + 16,
        backgroundColor: theme.surface,
        shadowColor: theme.shadow || "#000000",
      }
    ]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity 
          onPress={onBackPress}
          style={[styles.backButton, { backgroundColor: theme.surfaceVariant }]}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Explore Plants
        </Text>
        
        <TouchableOpacity 
          onPress={onClearSearch}
          style={[styles.clearButton, { backgroundColor: `${theme.primary}15` }]}
          activeOpacity={0.7}
          accessibilityLabel="Clear search and filters"
          accessibilityRole="button"
        >
          <Ionicons name="refresh-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputWrapper, 
          { 
            borderColor: theme.border,
            backgroundColor: theme.surfaceVariant
          }
        ]}>
          <Ionicons 
            name="search-outline" 
            size={20} 
            color={theme.textSecondary} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search plants or categories"
            placeholderTextColor={theme.textSecondary}
            value={searchText}
            onChangeText={onSearchChange}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{ 
              colors: { 
                background: 'transparent',
                text: theme.text,
                placeholder: theme.textSecondary
              } 
            }}
            contentStyle={{ 
              backgroundColor: 'transparent',
              paddingLeft: 0,
              color: theme.text 
            }}
            accessibilityLabel="Search plants"
            mode="flat"
            dense={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={() => onSearchChange("")}
              style={styles.clearInputButton}
              activeOpacity={0.7}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Chips */}
      <View style={styles.categoriesSection}>
        <Text style={[styles.categoriesLabel, { color: theme.textSecondary }]}>
          Categories
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => onCategoryPress(category)}
              style={[
                styles.categoryChip,
                { 
                  borderColor: theme.border,
                  backgroundColor: selectedCategory === category 
                    ? theme.primary 
                    : theme.surfaceVariant
                }
              ]}
              activeOpacity={0.8}
              accessibilityLabel={`Filter by ${category}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === category }}
            >
              <Text style={[
                styles.categoryChipText,
                { 
                  color: selectedCategory === category 
                    ? "#FFFFFF" 
                    : theme.textSecondary
                }
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Summary */}
      <View style={styles.resultsContainer}>
        <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
          {filteredProductsLength} plants found
        </Text>
      </View>
    </View>
  );
});

// Set display name for debugging
ExploreHeader.displayName = 'ExploreHeader';

// Estimated card height for FlatList optimization
const ESTIMATED_CARD_HEIGHT = 220;

export default function Explore() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Responsive card dimensions
  const { cardWidth, numColumns } = useMemo(() => {
    const minCardWidth = 160;
    const horizontalPadding = 32;
    const cardGap = 16;
    
    const availableWidth = width - horizontalPadding - cardGap;
    const cols = Math.max(2, Math.floor(availableWidth / minCardWidth));
    const cardW = (availableWidth - (cardGap * (cols - 1))) / cols;
    
    return { cardWidth: cardW, numColumns: cols };
  }, [width]);

  // Optimized product filtering with performance improvements
  const filteredProducts = useMemo(() => {
    let products = mossxJson.product || [];

    // Search filtering with optimized string operations
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      products = products.filter(product => {
        const titleMatch = product.title?.toLowerCase().includes(searchLower) ?? false;
        const descMatch = product.discription?.toLowerCase().includes(searchLower) ?? false;
        const tagMatch = product.tags?.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ) ?? false;
        
        return titleMatch;
      });
    }

    // Category filtering
    if (selectedCategory !== "all") {
      products = products.filter(product => 
        product.tags?.includes(selectedCategory)
      );
    }

    return products;
  }, [debouncedSearch, selectedCategory]);

  // Memoized callbacks for better performance - these won't change reference
  const handleCategoryPress = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText("");
    setSelectedCategory("all");
  }, []);

  // Optimized FlatList callbacks
  const renderItem = useCallback(({ item }) => (
    <View style={[styles.productCardWrapper, { width: cardWidth }]}>
      <ProductCard item={item} style={styles.productCard} />
    </View>
  ), [cardWidth]);

  const keyExtractor = useCallback((item) => item.id?.toString() || Math.random().toString(), []);

  const getItemLayout = useCallback((data, index) => ({
    length: ESTIMATED_CARD_HEIGHT,
    offset: ESTIMATED_CARD_HEIGHT * Math.floor(index / numColumns),
    index,
  }), [numColumns]);

  // Memoized header component with stable props
  const headerComponent = useMemo(() => (
    <ExploreHeader
      theme={theme}
      insets={insets}
      searchText={searchText}
      selectedCategory={selectedCategory}
      filteredProductsLength={filteredProducts.length}
      onBackPress={handleBackPress}
      onSearchChange={handleSearchChange}
      onClearSearch={clearSearch}
      onCategoryPress={handleCategoryPress}
    />
  ), [
    theme,
    insets,
    searchText,
    selectedCategory,
    filteredProducts.length,
    handleBackPress,
    handleSearchChange,
    clearSearch,
    handleCategoryPress
  ]);

  // Empty state component
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="leaf-outline" size={48} color={theme.textSecondary} />
      <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
        No plants found
      </Text>
      <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}>
        Try adjusting your search or filters
      </Text>
    </View>
  ), [theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={renderEmptyState}
        numColumns={numColumns}
        key={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        // Performance optimizations
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // HEADER STYLES
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // SEARCH STYLES
  searchContainer: {
    marginBottom: 24,
  },
  
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  
  searchIcon: {
    marginRight: 12,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  
  clearInputButton: {
    marginLeft: 8,
  },
  
  // CATEGORIES STYLES
  categoriesSection: {
    marginBottom: 20,
  },
  
  categoriesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  
  categoriesContainer: {
    paddingHorizontal: 4,
    gap: 12,
  },
  
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // RESULTS STYLES
  resultsContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  
  resultsText: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  // PRODUCT GRID STYLES
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 16,
  },
  
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  
  productCardWrapper: {
    marginBottom: 16,
  },
  
  productCard: {
    // Styling handled in ProductCard component
  },
  
  // EMPTY STATE STYLES
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});