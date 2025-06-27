import React from "react";
import { View } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import useDeliveryModal from "../../hooks/useDeliveryModal";
import styles from "../../styles";
import AddressSearch from "./AddressSearch";
import DeliveryForm from "./DeliveryForm";
import DeliveryMap from "./DeliveryMap";

export default function DeliveryModal({ visible, onDismiss }) {
  const {
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
  } = useDeliveryModal();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.surface },
        ]}
      >
        <Text style={[styles.modalTitle, { color: theme.text }]}>
          Delivery Details
        </Text>
        <View>
          <AddressSearch
            setDestination={setDestination}
            setAddress={setAddress}
            setLocation={setLocation}
            setRegion={setRegion}
          />
        </View>
        <DeliveryMap
          region={region}
          location={location}
          destination={destination}
          handleMapPress={handleMapPress}
          locationLoading={locationLoading}
        />
        <DeliveryForm
          address={address}
          setAddress={setAddress}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          landmark={landmark}
          setLandmark={setLandmark}
          deliveryNotes={deliveryNotes}
          setDeliveryNotes={setDeliveryNotes}
          handlePayment={handlePayment}
          total={total}
        />
      </Modal>
    </Portal>
  );
}
