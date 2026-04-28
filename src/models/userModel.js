const users = [
  { id: 1, name: "Alice Carter", username: "alice", password: "alice123" },
  { id: 2, name: "Bruno Lima", username: "bruno", password: "bruno123" },
  { id: 3, name: "Carla Souza", username: "carla", password: "carla123" }
];

function getUsers() {
  return users;
}

function findByUsername(username) {
  return users.find((user) => user.username === username);
}

function createUser({ name, username, password }) {
  const nextId = users.length + 1;
  const user = { id: nextId, name, username, password };
  users.push(user);
  return user;
}

module.exports = {
  getUsers,
  findByUsername,
  createUser
};
