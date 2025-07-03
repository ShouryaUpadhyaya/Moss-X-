import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function AddressSearch({
  setDestination,
  setAddress,
  setLocation,
  setRegion,
}) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search for address"
      fetchDetails={true}
      minLength={2}
      debounce={300}
      onPress={(data, details = null) => {
        if (!details || !details.geometry || !details.geometry.location) return;
        const { lat, lng } = details.geometry.location;
        setDestination({ latitude: lat, longitude: lng });
        setAddress(details.formatted_address);
        setLocation({ latitude: lat, longitude: lng });
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }}
      query={{
        key: GOOGLE_MAPS_APIKEY,
        language: "en",
        components: "country:in",
        types: "geocode",
      }}
      styles={{
        container: {
          flex: 0,
          zIndex: 2,
          // position: "absolute",
          width: "100%",
          padding: 10,
        },
        textInputContainer: { width: "100%" },
        textInput: {
          height: 44,
          color: "#5d5d5d",
          fontSize: 16,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          paddingHorizontal: 10,
        },
        listView: {
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          maxHeight: 200,
          position: "absolute",
          top: 55,
          left: 10,
          right: 10,
          zIndex: 3,
        },
        row: {
          padding: 13,
          height: 44,
          backgroundColor: "white",
        },
        separator: {
          height: 1,
          backgroundColor: "#c8c7cc",
        },
      }}
      textInputProps={{
        placeholderTextColor: "#999",
        returnKeyType: "search",
      }}
      enablePoweredByContainer={false}
      nearbyPlacesAPI="GooglePlacesSearch"
    />
  );
}
