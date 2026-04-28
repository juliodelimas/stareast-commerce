const { expect } = require("chai");
const supertest = require("supertest");
const { spawn } = require("child_process");

const BASE_URL = "http://localhost:3000";
const request = supertest(BASE_URL);

let serverProcess;

function waitForServer(maxAttempts = 30, delayMs = 250) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = async () => {
      attempts += 1;
      try {
        const response = await request.get("/healthcheck");
        if (response.status === 200) {
          resolve();
          return;
        }
      } catch (error) {
        // Server may not be up yet, keep retrying.
      }

      if (attempts >= maxAttempts) {
        reject(new Error("Server did not start in time for HTTP tests"));
        return;
      }

      setTimeout(check, delayMs);
    };

    check();
  });
}

describe("Path Coverage - REST API", function () {
  this.timeout(15000);

  before(async function () {
    serverProcess = spawn("node", ["src/server.js"], {
      stdio: "ignore",
      env: process.env
    });

    await waitForServer();
  });

  after(function () {
    if (serverProcess) {
      serverProcess.kill("SIGTERM");
    }
  });

  it("covers GET /healthcheck", async function () {
    const response = await request.get("/healthcheck");

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ status: "ok" });
  });

  it("covers POST /register using valid README data pattern", async function () {
    const uniqueUsername = `daniel_${Date.now()}`;

    const response = await request.post("/register").send({
      name: "Daniel Costa",
      username: uniqueUsername,
      password: "daniel123"
    });

    expect(response.status).to.equal(201);
    expect(response.body).to.include({
      name: "Daniel Costa",
      username: uniqueUsername
    });
    expect(response.body).to.have.property("id").that.is.a("number");
  });

  it("covers POST /login with existing README user", async function () {
    const response = await request.post("/login").send({
      username: "alice",
      password: "alice123"
    });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token").that.is.a("string");
  });

  it("covers POST /checkout with valid auth and README items", async function () {
    const loginResponse = await request.post("/login").send({
      username: "alice",
      password: "alice123"
    });
    const token = loginResponse.body.token;

    const response = await request
      .post("/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({
        paymentMethod: "cash",
        items: [
          { productId: 1, quantity: 2 },
          { productId: 3, quantity: 1 }
        ]
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.include({
      paymentMethod: "cash",
      subtotal: 380,
      discount: 38,
      total: 342
    });
    expect(response.body.items).to.be.an("array").with.lengthOf(2);
  });
});
