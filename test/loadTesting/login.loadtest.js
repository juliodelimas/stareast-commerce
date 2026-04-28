import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

const users = [
  { username: "alice", password: "alice123" },
  { username: "bruno", password: "bruno123" },
  { username: "carla", password: "carla123" },
];

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "20s", target: 30 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const user = users[Math.floor(Math.random() * users.length)];

  const response = http.post(
    `${BASE_URL}/login`,
    JSON.stringify(user),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response has token": (r) => {
      try {
        return Boolean(r.json("token"));
      } catch (error) {
        return false;
      }
    },
  });
}
