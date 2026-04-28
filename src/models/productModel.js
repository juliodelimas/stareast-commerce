const products = [
  { id: 1, name: "T-Shirt", price: 100 },
  { id: 2, name: "Sneakers", price: 250 },
  { id: 3, name: "Backpack", price: 180 }
];

function getProducts() {
  return products;
}

function findProductById(id) {
  return products.find((product) => product.id === id);
}

module.exports = {
  getProducts,
  findProductById
};
