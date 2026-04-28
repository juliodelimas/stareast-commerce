const checkoutService = require("../services/checkoutService");

function checkout(req, res) {
  try {
    const { items, paymentMethod } = req.body;
    const result = checkoutService.checkout({ items, paymentMethod });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  checkout
};
