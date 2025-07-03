// import { RAYZORPAY_KEY } from "@env";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Portal } from "react-native-paper";
import RazorpayCheckout from "react-native-razorpay";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../../../store/slices/cartSlice";
import { useTheme } from "../../theme/ThemeContext";
import CartFooter from "./components/CartFooter";
import CartItemList from "./components/CartItemList";
import DeliveryModal from "./components/DeliveryModal";
import EmptyCart from "./components/EmptyCart";
import useCartModal from "./hooks/useCartModal";
import styles from "./styles";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY; // or your key directly

export default function Cart() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { isModalVisible, openModal, closeModal } = useCartModal();
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Permission to access location was denied"
        );
        setLocationLoading(false);
        // Set default region to India if permission denied
        setRegion({
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 20,
          longitudeDelta: 20,
        });
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          maximumAge: 10000,
        });
        console.log("Fetched location: ", currentLocation.coords);
        const initialRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setLocation(currentLocation.coords);
        setRegion(initialRegion);
      } catch (error) {
        console.error("Error getting location:", error);
        // Set default region to India if error
        setRegion({
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 20,
          longitudeDelta: 20,
        });
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    console.log("latitude: ", latitude, "longitude: ", longitude);

    setLocation({ latitude, longitude }); // Update marker position

    try {
      let geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocode.length > 0) {
        const { name, street, city, postalCode, region, country } = geocode[0];
        const formattedAddress = `${name || ""} ${street || ""}, ${
          city || ""
        }, ${region || ""}, ${postalCode || ""}, ${country || ""}`.trim();
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handlePayment = async () => {
    if (!address.trim() || !phoneNumber.trim()) {
      Alert.alert(
        "Missing Information",
        "Please provide your address and phone number."
      );
      return;
    }

    closeModal();

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

      console.log(process.env);

      const options = {
        description: "Payment for Moss X products",
        image: "https://i.imgur.com/3g7nmJC.jpg",
        currency: "INR",
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY,
        amount: total * 100, // Amount in paise
        name: "Moss X",
        prefill: {
          email: "customer@example.com",
          contact: phoneNumber,
          name: "Customer Name",
        },
        notes: {
          address: `${address}, ${landmark}`,
          delivery_notes: deliveryNotes,
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

  console.log("GOOGLE_MAPS_APIKEY:", GOOGLE_MAPS_APIKEY);
  console.log("items:", items);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Portal.Host>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <CartItemList items={items} />
        <CartFooter onCheckoutPress={openModal} />
        <DeliveryModal visible={isModalVisible} onDismiss={closeModal} />
      </View>
    </Portal.Host>
  );
}
