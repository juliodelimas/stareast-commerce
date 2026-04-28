const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "simple-secret";

function register({ name, username, password }) {
  const existingUser = userModel.findByUsername(username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const user = userModel.createUser({ name, username, password });
  return {
    id: user.id,
    name: user.name,
    username: user.username
  };
}

function login({ username, password }) {
  const user = userModel.findByUsername(username);
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  register,
  login,
  verifyToken
};
