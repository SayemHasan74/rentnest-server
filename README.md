# RentNest Server

RentNest is a backend API for a rental property marketplace. Tenants can browse rental properties, submit rental requests, pay after landlord approval, and leave reviews. Landlords can manage listings and rental requests. Admins can manage users, listings, rentals, and categories.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma
- JWT
- Stripe
- Swagger/OpenAPI

## Admin Credentials

```text
Admin Email: admin@rentnest.com
Admin Password: admin123
```

## API Documentation

After starting the server:

```text
Swagger UI: http://localhost:5000/api/docs
OpenAPI JSON: http://localhost:5000/api/docs.json
```

## Environment Variables

Copy `.env.example` to `.env` and fill in real values.

```env
NODE_ENV=development
PORT=5000
ALLOWED_ORIGINS=*
DATABASE_URL="postgresql://username:password@host:5432/rentnest?schema=public"
JWT_SECRET="replace-with-a-secure-secret"
JWT_EXPIRES_IN="7d"
STRIPE_SECRET_KEY="sk_test_replace_with_your_key"
STRIPE_WEBHOOK_SECRET=""
STRIPE_SUCCESS_URL="http://localhost:5000/api/payments/success"
STRIPE_CANCEL_URL="http://localhost:5000/api/payments/cancel"
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm start
npm run type-check
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

3. Run database migration:

```bash
npm run prisma:migrate
```

4. Seed admin, categories, and sample data:

```bash
npm run prisma:seed
```

5. Start development server:

```bash
npm run dev
```

## Main Endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Public Properties and Categories

```text
GET /api/properties
GET /api/properties/:id
GET /api/categories
```

### Landlord

```text
GET    /api/landlord/properties
POST   /api/landlord/properties
PUT    /api/landlord/properties/:id
PATCH  /api/landlord/properties/:id/availability
DELETE /api/landlord/properties/:id
GET    /api/landlord/requests
PATCH  /api/landlord/requests/:id
```

### Tenant Rentals

```text
POST /api/rentals
GET  /api/rentals
GET  /api/rentals/:id
```

### Payments

```text
POST /api/payments/create
POST /api/payments/confirm
POST /api/payments/webhook
GET  /api/payments
GET  /api/payments/:id
```

### Reviews

```text
POST /api/reviews
```

### Admin

```text
GET   /api/admin/users
PATCH /api/admin/users/:id
GET   /api/admin/properties
GET   /api/admin/rentals
POST  /api/categories
PATCH /api/categories/:id
DELETE /api/categories/:id
```

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errorDetails": {}
}
```

## Payment Flow

1. Tenant submits a rental request.
2. Landlord approves the request.
3. Tenant creates a Stripe checkout session.
4. Stripe confirms payment through webhook or confirmation endpoint.
5. Payment becomes `COMPLETED`.
6. Rental request becomes `ACTIVE`.

## Submission Info

```text
Backend Repo: https://github.com/SayemHasan74/rentnest-server
Live API: Add deployed Render URL
API Docs: /api/docs on the live API
Demo Video: Add video link
Admin Email: admin@rentnest.com
Admin Password: admin123
```
