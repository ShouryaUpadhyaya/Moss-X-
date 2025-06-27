import { useState } from "react";
import { useDispatch } from "react-redux";

export default function useCart() {
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const handlePayment = async (formData) => {
    // ... payment logic ...
  };

  return {
    isModalVisible,
    setModalVisible,
    handlePayment,
  };
}
