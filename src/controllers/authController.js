const authService = require("../services/authService");

function register(req, res) {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: "name, username and password are required" });
    }

    const user = authService.register({ name, username, password });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const token = authService.login({ username, password });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

module.exports = {
  register,
  login
};
