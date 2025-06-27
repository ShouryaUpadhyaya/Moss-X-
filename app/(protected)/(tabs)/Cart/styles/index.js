import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: "center",
  },
  footer: {
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "bold",
  },
  checkoutButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  payButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
});
