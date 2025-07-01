import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const { width } = Dimensions.get("window");

// Layout constants - consider moving to constants/layout.ts
const CARD_WIDTH_RATIO = 0.9;
const CARD_HEIGHT = 300;
const BORDER_RADIUS = 20;

// Fallback image for broken URLs
const FALLBACK_IMAGE = "https://via.placeholder.com/400x300/cccccc/666666?text=No+Image";

export default function CollectionCard({ item, type, cardWidth = width * CARD_WIDTH_RATIO }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [scaleAnim] = useState(new Animated.Value(1));
  const animationRef = useRef(null);

  const handlePress = () => {
    router.push({
      pathname: "/collection/[id]",
      params: { id: item.id, type },
    });
  };

  const handlePressIn = () => {
    // Cancel any running animation before starting new one
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    animationRef.current = Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    });
    animationRef.current.start();
  };

  const handlePressOut = () => {
    // Cancel any running animation before starting new one
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    animationRef.current = Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    });
    animationRef.current.start();
  };

  const getLabelText = () => {
    if (type === "seasonal" && item.theme?.season) return `${item.theme.season} Picks`;
    if (type === "bundle") return "Bundle Deal";
    return "Collection";
  };

  // Get image source with fallback
  const getImageSource = () => {
    return item.imgSrc && item.imgSrc.trim() !== "" ? { uri: item.imgSrc } : { uri: FALLBACK_IMAGE };
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        accessibilityRole="button"
        testID={`collection-card-${item.id}`}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        <View style={[styles.cardContainer, { width: cardWidth }]}>
          <Image
            source={getImageSource()}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.65)"]}
            style={styles.gradientOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          <View
            style={[
              styles.labelChip,
              {
                backgroundColor: theme.isDarkMode
                  ? theme.primary + "30"
                  : theme.primary + "20",
              },
            ]}
          >
            <Text style={[styles.labelText, { color: theme.primary }]}>
              {getLabelText()}
            </Text>
          </View>

          <View style={styles.titleContent}>
            <Text style={[styles.titleText, { color: theme.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            {item.discription && (
              <Text style={[styles.subtitleText, { color: theme.textSecondary }]} numberOfLines={1}>
                {item.discription}
              </Text>
            )}
            {type === "bundle" && (
              <View style={styles.priceContainer}>
                {item.originalPrice && (
                  <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                    ₹{item.originalPrice}
                  </Text>
                )}
                {item.discountPrice && (
                  <Text style={[styles.discountPrice, { color: theme.primary }]}>
                    ₹{item.discountPrice}
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.arrowContainer}>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={theme.text} 
              style={styles.arrowIcon} 
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  cardContainer: {
    height: CARD_HEIGHT,
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  labelChip: {
    position: "absolute",
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
  },
  titleContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 50,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitleText: {
    fontSize: 14,
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  priceContainer: {
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    marginBottom: 2,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  arrowContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  arrowIcon: {
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});