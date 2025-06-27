import React from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useTheme } from "../../../../theme/ThemeContext";
import styles from "../../styles";

export default function DeliveryForm({
  address,
  setAddress,
  phoneNumber,
  setPhoneNumber,
  landmark,
  setLandmark,
  deliveryNotes,
  setDeliveryNotes,
  handlePayment,
  total,
}) {
  const { theme } = useTheme();

  return (
    <View>
      <TextInput
        label="Address"
        value={address}
        onChangeText={setAddress}
        style={[styles.input, { marginTop: 25 }]}
        mode="outlined"
        theme={{ colors: { primary: theme.primary } }}
      />
      <TextInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="phone-pad"
        mode="outlined"
        theme={{ colors: { primary: theme.primary } }}
      />
      <TextInput
        label="Landmark"
        value={landmark}
        onChangeText={setLandmark}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: theme.primary } }}
      />
      <TextInput
        label="Notes for delivery (Optional)"
        value={deliveryNotes}
        onChangeText={setDeliveryNotes}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: theme.primary } }}
      />
      <Button
        mode="contained"
        onPress={handlePayment}
        style={[styles.payButton, { backgroundColor: theme.primary }]}
      >
        Pay ₹{total}
      </Button>
    </View>
  );
}
