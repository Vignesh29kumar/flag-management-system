# Multi-Tenant Feature Flag Management System

Built for **My Technologies** assignment.

---

## Project Structure

```
feature-flag-system/
│
├── backend/                        # Node.js + Express API
│   ├── server.js                   # Entry point
│   ├── .env                        # Environment variables
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── models/
│   │   ├── Organisation.js         # Organisation schema
│   │   ├── User.js                 # User schema (org_admin / end_user)
│   │   └── FeatureFlag.js          # Feature flag schema
│   ├── middlewares/
│   │   └── authMiddleware.js       # JWT verification + role guards
│   ├── validations/
│   │   ├── superAdminValidations.js
│   │   ├── orgValidations.js
│   │   ├── adminValidations.js
│   │   └── flagValidations.js
│   ├── controllers/
│   │   ├── superadmin/
│   │   │   ├── authController.js   # Super admin login
│   │   │   └── orgController.js    # Create / list organisations
│   │   ├── admin/
│   │   │   ├── authController.js   # Admin signup / login
│   │   │   └── flagController.js   # CRUD for feature flags
│   │   └── user/
│   │       └── flagController.js   # Check feature flag status
│   └── routes/
│       ├── superadmin/
│       │   ├── authRoutes.js
│       │   └── orgRoutes.js
│       ├── admin/
│       │   ├── authRoutes.js
│       │   └── flagRoutes.js
│       └── user/
│           └── flagRoutes.js
│
├── frontend-superadmin/            # React app — Port 3001
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   └── Dashboard.jsx       # Create & list organisations
│       ├── components/
│       │   └── Navbar.jsx
│       ├── services/
│       │   └── api.js              # Axios calls to backend
│       └── styles/
│           └── global.css
│
├── frontend-admin/                 # React app — Port 3002
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   └── Dashboard.jsx       # Feature flag CRUD (toggle, delete, create)
│       ├── components/
│       │   └── Navbar.jsx
│       ├── services/
│       │   └── api.js
│       └── styles/
│           └── global.css
│
└── frontend-user/                  # React app — Port 3003
    └── src/
        ├── pages/
        │   └── CheckFlag.jsx       # Select org + enter feature key → check status
        ├── services/
        │   └── api.js
        └── styles/
            └── global.css
```

---

## Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017
- npm

---

## Setup & Run

### 1. Install all dependencies

```bash
# From the root folder
npm run install:all

# Or individually:
cd backend && npm install
cd ../frontend-superadmin && npm install
cd ../frontend-admin && npm install
cd ../frontend-user && npm install
```

### 2. Configure environment

Edit `backend/.env` if needed:

```env
PORT=""
MONGO_URI=""
JWT_SECRET=""

SUPER_ADMIN_EMAIL=""
SUPER_ADMIN_PASSWORD=""
```

### 3. Start the backend

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### 4. Start the frontends (each in a separate terminal)

```bash
# Super Admin UI — http://localhost:3001
cd frontend-superadmin && npm start

# Admin UI — http://localhost:3002
cd frontend-admin && npm start

# User UI — http://localhost:3003
cd frontend-user && npm start
```

---

## Usage

### Super Admin
- URL: `http://localhost:3001`
- Login: `superadmin@my.com` / `SuperAdmin@123`
- Create organisations and view all organisations

### Organisation Admin
- URL: `http://localhost:3002`
- Sign up with your name, email, password, and select your organisation
- Log in and manage feature flags (create, enable/disable, delete)
- Feature flags are **scoped to your organisation** only

### End User
- URL: `http://localhost:3003`
- No login required
- Select your organisation from the dropdown
- Enter a feature key and click "Check Feature"
- See whether the feature is enabled or disabled for that organisation

---

## API Endpoints

### Super Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/superadmin/login` | Login with static credentials |
| POST | `/api/superadmin/organisations` | Create organisation (auth required) |
| GET | `/api/superadmin/organisations` | List all organisations (auth required) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/signup` | Register as org admin |
| POST | `/api/admin/login` | Login |
| GET | `/api/admin/flags` | Get all flags for org (auth required) |
| POST | `/api/admin/flags` | Create a feature flag (auth required) |
| PATCH | `/api/admin/flags/:id` | Enable/disable a flag (auth required) |
| DELETE | `/api/admin/flags/:id` | Delete a flag (auth required) |

### User (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/organisations` | List organisations for dropdown |
| POST | `/api/user/check-flag` | Check if a feature flag is enabled |

---

## Design Decisions

- **JWT-based auth** with role-based middleware (`isSuperAdmin`, `isOrgAdmin`)
- **Feature flag uniqueness** enforced per organisation (compound index on `featureKey + organisation`)
- **Separation of concerns**: controllers handle business logic, routes define endpoints, validations sanitize inputs, models define schema
- **No third-party auth** — bcrypt for password hashing, jsonwebtoken for tokens
- **CSS in separate files** per frontend app for clarity and maintainability
