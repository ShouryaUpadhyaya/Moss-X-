import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../store/slices/cartSlice";
import { useTheme } from "../../../theme/ThemeContext";

export default function useDeliveryModal() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);

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
        console.log("not granted ");

        setRegion({
          latitude: 28.6448,
          longitude: 77.216721,
          latitudeDelta: 20,
          longitudeDelta: 20,
        });
        setLocationLoading(false);
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      let { latitude, longitude } = currentLocation.coords;

      // If the location is not in India, set a default
      if (latitude < 6 || latitude > 38 || longitude < 68 || longitude > 98) {
        console.log("location is not in india");

        latitude = 28.6448;
        longitude = 77.216721;
      }

      const initialRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setLocation({ latitude, longitude });
      setRegion(initialRegion);
      setLocationLoading(false);
    })();
  }, []);

  // useEffect(() => {
  //   if (region && !destination) {
  //     setDestination({
  //       latitude: region.latitude,
  //       longitude: region.longitude,
  //     });
  //   }
  // }, [region]);

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    try {
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
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

  const handlePayment = async () => {
    if (!address.trim() || !phoneNumber.trim()) {
      Alert.alert(
        "Missing Information",
        "Please provide your address and phone number."
      );
      return;
    }
    // Payment logic here (e.g., Razorpay)
    Alert.alert("Payment Successful", "Thank you for your order!", [
      {
        text: "OK",
        onPress: () => {
          items.forEach((item) => {
            dispatch(removeFromCart(item.id));
          });
        },
      },
    ]);
  };

  return {
    region,
    location,
    destination,
    setDestination,
    setAddress,
    setLocation,
    setRegion,
    address,
    phoneNumber,
    setPhoneNumber,
    landmark,
    setLandmark,
    deliveryNotes,
    setDeliveryNotes,
    handleMapPress,
    handlePayment,
    locationLoading,
    theme,
    total,
  };
}
