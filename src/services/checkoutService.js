const productModel = require("../models/productModel");

const PAYMENT_METHODS = {
  CASH: "cash",
  CREDIT_CARD: "credit_card"
};

function checkout({ items, paymentMethod }) {
  if (
    paymentMethod !== PAYMENT_METHODS.CASH &&
    paymentMethod !== PAYMENT_METHODS.CREDIT_CARD
  ) {
    throw new Error("Payment method must be cash or credit_card");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items are required");
  }

  const processedItems = items.map((item) => {
    const product = productModel.findProductById(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`Invalid quantity for product ${item.productId}`);
    }

    const lineTotal = product.price * item.quantity;
    return {
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal
    };
  });

  const subtotal = processedItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const discount = paymentMethod === PAYMENT_METHODS.CASH ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return {
    items: processedItems,
    paymentMethod,
    subtotal,
    discount,
    total
  };
}

module.exports = {
  checkout,
  PAYMENT_METHODS
};
