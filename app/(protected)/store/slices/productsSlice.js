import { createSlice } from "@reduxjs/toolkit";
import mossxJson from "../../../../mossx_plant_dataset.json";

// Add console logs to inspect mossxJson right after import
console.log("mossxJson loaded in productsSlice:", mossxJson);
console.log("mossxJson.SeasonalCollection:", mossxJson.SeasonalCollection);
console.log("mossxJson.product_bundle:", mossxJson.product_bundle);

const ITEMS_PER_PAGE = 5;

const initialState = {
  allProducts: mossxJson.product,
  filteredProducts: mossxJson.product,
  displayedProducts: mossxJson.product.slice(0, ITEMS_PER_PAGE),
  seasonalCollections: mossxJson.SeasonalCollection,
  productBundles: mossxJson.product_bundle,
  currentPage: 1,
  hasMore: true,
  filters: {
    searchQuery: "",
    priceRange: null,
    category: null,
    rating: null,
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;

      // Apply filters
      state.filteredProducts = state.allProducts.filter((product) => {
        if (!product) return false;

        // Search filter
        const matchesSearch = state.filters.searchQuery
          ? (product.title?.toLowerCase() || "").includes(
              state.filters.searchQuery.toLowerCase()
            ) ||
            (product.discription?.toLowerCase() || "").includes(
              state.filters.searchQuery.toLowerCase()
            )
          : true;

        // Price range filter
        const matchesPrice = state.filters.priceRange
          ? (() => {
              const [min, max] = state.filters.priceRange.split("-");
              if (!product.price) return false;
              if (max === "+") {
                return product.price >= Number(min);
              }
              return (
                product.price >= Number(min) && product.price <= Number(max)
              );
            })()
          : true;

        // Category filter
        const matchesCategory = state.filters.category
          ? Array.isArray(product.tags) &&
            product.tags.includes(state.filters.category)
          : true;

        // Rating filter
        const matchesRating = state.filters.rating
          ? (() => {
              if (!product.rating) return false;
              const minRating = parseInt(state.filters.rating);
              return product.rating >= minRating;
            })()
          : true;

        return (
          matchesSearch && matchesPrice && matchesCategory && matchesRating
        );
      });

      // Update displayed products
      state.displayedProducts = state.filteredProducts.slice(0, ITEMS_PER_PAGE);
      state.hasMore = state.filteredProducts.length > ITEMS_PER_PAGE;
    },
    loadMore: (state) => {
      if (!state.hasMore) return;

      const nextPage = state.currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = state.filteredProducts.slice(startIndex, endIndex);

      if (newProducts.length === 0) {
        state.hasMore = false;
        return;
      }

      state.displayedProducts = [...state.displayedProducts, ...newProducts];
      state.currentPage = nextPage;
    },
  },
});

export const { setFilters, loadMore } = productsSlice.actions;
export default productsSlice.reducer;
