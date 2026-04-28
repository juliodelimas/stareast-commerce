# StarEast Commerce API

Simple REST API for an e-commerce checkout flow built with Express and JWT auth, using in-memory data only.

## Tech Stack

- Node.js
- Express
- JWT (`jsonwebtoken`)
- OpenAPI docs via Swagger UI
- Mocha + Chai + Supertest + Mochawesome
- k6 load testing

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the API

```bash
npm start
```

The server starts on `http://localhost:3000` by default.

## Environment Variables

- `PORT` (optional): defaults to `3000`
- `JWT_SECRET` (optional): defaults to `simple-secret`

## API Documentation

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI source: `src/docs/swagger.yaml`

## Available Endpoints

- `GET /healthcheck`
- `POST /register`
- `POST /login`
- `POST /checkout` (requires `Authorization: Bearer <token>`)

## Business Rules

- Checkout accepts only `cash` or `credit_card`.
- `cash` checkout applies a `10%` discount.
- Checkout requires a valid JWT token.
- Products and users are stored in memory (no database).

## Seed Data (In-Memory)

### Users

- `{ "id": 1, "name": "Alice Carter", "username": "alice", "password": "alice123" }`
- `{ "id": 2, "name": "Bruno Lima", "username": "bruno", "password": "bruno123" }`
- `{ "id": 3, "name": "Carla Souza", "username": "carla", "password": "carla123" }`

### Products

- `{ "id": 1, "name": "T-Shirt", "price": 100 }`
- `{ "id": 2, "name": "Sneakers", "price": 250 }`
- `{ "id": 3, "name": "Backpack", "price": 180 }`

## Example Requests

### Healthcheck

```bash
curl http://localhost:3000/healthcheck
```

### Register

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daniel Costa",
    "username": "daniel",
    "password": "daniel123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "alice123"
  }'
```

Response example:

```json
{ "token": "JWT_TOKEN_HERE" }
```

### Checkout (Authenticated)

```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN_HERE" \
  -d '{
    "paymentMethod": "cash",
    "items": [
      { "productId": 1, "quantity": 2 },
      { "productId": 3, "quantity": 1 }
    ]
  }'
```

Expected behavior for the payload above:

- `subtotal`: `380`
- `discount`: `38`
- `total`: `342`

## Common Error Responses

- `400` on invalid payloads (missing required fields, invalid payment method, empty/invalid items, unknown product).
- `401` on auth failures (invalid credentials, missing token, invalid or expired token).

## Testing

### Path coverage/API tests

```bash
npm test
```

This runs `test/pathCoverage/**/*.spec.js` and generates a Mochawesome report in `test-report/`.

### Login load test (k6)

```bash
npm run test:load:login
```

You can override the target URL:

```bash
BASE_URL=http://localhost:3000 npm run test:load:login
```

## CI

GitHub Actions workflow `api-tests.yml` runs on pull requests to `main` and:

1. installs dependencies,
2. starts the API,
3. waits for `/healthcheck`,
4. runs `npm test`.
