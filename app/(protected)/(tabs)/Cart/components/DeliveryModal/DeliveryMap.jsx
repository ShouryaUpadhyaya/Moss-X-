import React, { useRef } from "react";
import { Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function DeliveryMap({
  region,
  location,
  destination,
  handleMapPress,
  locationLoading,
}) {
  if (locationLoading) return <Text>Loading map...</Text>;
  if (!region) return <Text>Location not available</Text>;

  const mapRef = useRef(null);
  console.log("location: ", location);
  console.log("destination : ", destination);
  console.log("region : ", region);

  return (
    <MapView
      ref={mapRef}
      style={{ height: 200, marginBottom: 16, borderRadius: 8 }}
      region={region}
      onPress={handleMapPress}
      showsUserLocation
    >
      {location && <Marker coordinate={location} />}
      {destination && (
        <>
          <Marker coordinate={destination} pinColor="blue" />
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="hotpink"
          />
        </>
      )}
    </MapView>
  );
}
