# Mini-Order-System

A full-stack application for managing products, variants (SKUs), and financing options (EMI).

## Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router 7
- **HTTP Client**: Axios

### Backend
- **Framework**: NestJS
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Documentation**: Swagger (available at `/api`)
- **Validation**: Class-validator, Class-transformer

---

## Schema Overview

The database uses PostgreSQL with TypeORM. Key entities include:

- **Product**: General product information (Name, Brand, Technical Specs).
- **Sku (Stock Keeping Unit)**: Specific variants of a product with unique pricing, stock, and images.
- **ProductAttribute**: Defines categories for variants (e.g., Color, Storage).
- **AttributeValue**: Specific values for attributes.
- **EmiPlan**: Financing options linked to SKUs, including duration (months), ROI, and cashback.
- **Lender**: Financial institutions providing EMI plans.
- **PaymentOption**: Supported payment methods (e.g., Credit Card, UPI).

---

## API Endpoints

### Products
- `GET /products`: Fetch all products with their basic info.
- `GET /products/:id`: Fetch detailed product info, including all associated SKUs and attributes.
- `POST /products/add-product`: Create a new product.
- `PUT /products/:id`: Update existing product details.

### EMI Plans
- `GET /emi-plan/:skuId`: Get all available EMI plans for a specific SKU.

### Example Response (`GET /products/:id`)
```json
{
  "id": "uuid",
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "skus": [
    {
      "skuId": "sku-uuid",
      "price": 999.99,
      "stock": 50,
      "images": ["url1", "url2"],
      "emiPlans": [...]
    }
  ]
}
```

---

## Setup and Run

### Prerequisites
- **Node.js**: v18+
- **PostgreSQL**: Running instance

### Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` (or configure your DB settings):
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=yourpassword
   DATABASE_NAME=mini_order_system
   ```
4. Run in development mode: `npm run start:dev`

### Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the app at `http://localhost:5173`
