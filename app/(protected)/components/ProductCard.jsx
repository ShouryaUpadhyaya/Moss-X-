import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function ProductCard({ item, style }) {
  const { theme } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/product/[id]",
      params: { id: item.id },
    });
  };

  return (
    <Pressable onPress={handlePress} style={[styles.container, style]}>
      {/* Image Container */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surface }]}>
        <Image
          source={{ uri: item.imagesrc }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        
        <Text style={[styles.price, { color: theme.primary }]}>
          ₹{item.price}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color={theme.primary} />
          <Text style={[styles.rating, { color: theme.textSecondary }]}>
            {item.rating}
          </Text>
        </View>

        {/* Single Tag */}
        {item.tags && item.tags.length > 0 && (
          <View style={[styles.tag, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.tagText, { color: theme.primary }]}>
              {item.tags[0]}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 140,
  },
  textContainer: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
  },
});