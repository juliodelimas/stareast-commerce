# StarEast Commerce API

## Description
Simple REST API for an e-commerce checkout flow using JavaScript, Express, JWT authentication, and in-memory data only.

## Installation
```bash
npm install
```

## How to Run
```bash
npm start
```

API base URL: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/docs`

## Rules
- Checkout accepts only `cash` or `credit_card`.
- `cash` payment gives a `10%` discount.
- Only authenticated users can perform checkout.
- Only four business endpoints are exposed: `register`, `login`, `checkout`, and `healthcheck`.

## Data Already Existent
### Users (3)
- `{ "id": 1, "name": "Alice Carter", "username": "alice", "password": "alice123" }`
- `{ "id": 2, "name": "Bruno Lima", "username": "bruno", "password": "bruno123" }`
- `{ "id": 3, "name": "Carla Souza", "username": "carla", "password": "carla123" }`

### Products (3)
- `{ "id": 1, "name": "T-Shirt", "price": 100 }`
- `{ "id": 2, "name": "Sneakers", "price": 250 }`
- `{ "id": 3, "name": "Backpack", "price": 180 }`

## How to Use the Rest API
### 1) Healthcheck
`GET /healthcheck`

Example:
```bash
curl http://localhost:3000/healthcheck
```

### 2) Register
`POST /register`

Example:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daniel Costa",
    "username": "daniel",
    "password": "daniel123"
  }'
```

### 3) Login
`POST /login`

Example:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "alice123"
  }'
```

Response returns:
```json
{ "token": "JWT_TOKEN_HERE" }
```

### 4) Checkout (Authenticated)
`POST /checkout`

Use `Authorization: Bearer <token>`

Example:
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

If `paymentMethod` is `cash`, the API applies 10% discount in the checkout result.
