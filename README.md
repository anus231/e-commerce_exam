# Ansu Sirleaf: Premium Rwandan Handicrafts Marketplace

Ansu Sirleaf is a full-stack, secure, and highly-optimized e-commerce platform designed to celebrate Rwandan heritage and support local craft cooperatives. The platform enables buyers to purchase authentic baskets (Agaseke), geometrical art (Imigongo), home decor, and apparel, with gross sales revenues returned directly to rural weavers and sculptors.

This project was built to satisfy the E-Commerce and Web Application Final Examination requirements for the **Faculty of Computing and Information Sciences at the University of Lay Adventists of Kigali (UNILAK)**.

---

## 🌟 Key Features

1. **Artisan Storytelling (Innovation Bonus)**: Each product details the weaver/sculptor's name, province, and personal history to preserve heritage and guarantee authenticity.
2. **Dual-Mode Database Adapter**: Can run on PostgreSQL (in production/Docker) or SQLite (locally, via file database `database.db`) with zero code modifications.
3. **Interactive Checkout & Simulations (Innovation Bonus)**: Features validation for Rwandan phone formats (+250) and simulations for Mobile Money (MTN MoMo/Airtel Money) prompts and card processing.
4. **Fulfillment Analytics Dashboard (Innovation Bonus)**: Dedicated admin controls displaying gross revenues, order quantities, average order values (AOV), sales by category percentage, and order status toggles.
5. **Role-Based Security**: Customer accounts are separated from administrators using JWT token authorizers and salt-hashed credentials.
6. **Docker Containerization**: Entire app is containerized using multi-stage Docker builds and orchestrated using Docker Compose.
7. **CI/CD Pipeline**: GitHub Actions workflow verifying node compilation, API test suite execution, and Docker build stability.

---

## 🛠️ Technology Stack

* **Frontend**: React.js (Vite), Lucide-React (Vector Icons)
* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL (Dockerized) / SQLite (Local file fallback)
* **Styling**: Vanilla CSS (Custom tokens, Grid, Flex, Glassmorphism, Imigongo geometric SVG patterns)
* **Security**: Bcrypt.js (Password encryption), JSONWebToken (Session authorization)
* **Deployment**: Docker, Docker Compose, GitHub Actions

---

## 📁 Project Structure

```
pukie_project/
├── .github/workflows/ci-cd.yml   # CI/CD pipeline script
├── backend/                      # Express API codebase
│   ├── config/db.js              # Dual postgres/sqlite adapter
│   ├── controllers/              # Request handlers
│   ├── database/
│   │   ├── schema.sql            # Table DDL definitions
│   │   └── seed.sql              # Initial product insertions
│   ├── middleware/auth.js        # JWT token verifying gates
│   ├── routes/                   # API path definitions
│   ├── tests/api.test.js         # Integration tests
│   └── server.js                 # API server bootstrap
├── frontend/                     # React Vite Single Page App
│   ├── src/
│   │   ├── components/           # Shared Layouts (Navbar, Footer, Cart)
│   │   ├── context/              # Context Stores (Auth, Cart)
│   │   ├── pages/                # Core App Views (Home, Shop, Admin)
│   │   ├── index.css             # Unified HSL variables stylesheet
│   │   └── main.jsx              # App mounting
│   └── vite.config.js            # Build redirection & dev proxy config
├── Dockerfile                    # Multi-stage production build script
├── docker-compose.yml            # Multi-service coordinator
└── package.json                  # Root npm coordinator
```

---

## 🚀 Running the Application

### Option A: Running with Docker Compose (Recommended)
This runs the application using a containerized **PostgreSQL** database and the Express server in production mode.

1. Ensure Docker and Docker Compose are installed.
2. Run the following command in the root folder:
   ```bash
   docker-compose up --build
   ```
3. The database will automatically initialize schemas and seed products.
4. Access the web app at: [http://localhost:5000](http://localhost:5000)

---

### Option B: Local Running (SQLite File Mode)
This runs the application locally without Docker. It uses an auto-created **SQLite** file database `database.db` and loads the initial schemas and seed data automatically.

1. Ensure Node.js (v18+) is installed.
2. Install all dependencies across both frontend and backend layers:
   ```bash
   npm run install-all
   ```
3. Compile the production assets of the React frontend:
   ```bash
   npm run build
   ```
4. Start the Express server:
   ```bash
   npm start
   ```
5. Access the application at: [http://localhost:5000](http://localhost:5000)

*Note: For active frontend development, you can run `npm run dev` to launch the hot-reloading Vite server at [http://localhost:5173](http://localhost:5173) with automatic reverse proxy to the backend API.*

---

## 🧪 Testing

The codebase includes an integration and unit test suite verifying password cryptography, token authentication, and database querying.
To execute tests:
```bash
npm test
```

---

## 🔑 Demo Access Credentials

* **Customer**: Registered dynamically via the "Sign In" -> "Create Account" panel.
* **Administrator**: 
  * **Email**: `admin@ansusirleaf.rw`
  * **Password**: `admin123`
