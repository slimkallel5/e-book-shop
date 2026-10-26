# Arabic-First 3D Educational Bookstore (Tunisia)

An e-commerce platform for selling supplementary educational books and book packs in Tunisia. Features an immersive 3D library experience with education-level shelves and interactive 3D book previews with sample pages.

---

## 1. Project Overview

- **Primary Locale:** Arabic (`ar`, RTL default)
- **Additional Locales:** French (`fr`, LTR), English (`en`, LTR)
- **Currency:** Tunisian Dinar (TND)
- **Architecture:** Monorepo with Expo / React Native Web frontend and NestJS REST API backend.

---

## 2. Directory Structure

```
├── AGENTS.md                  # Developer & Agent instructions
├── README.md                  # Project setup & commands
├── docs/
│   ├── ARCHITECTURE.md        # Technical architecture & dependency assessment
│   ├── FEATURE_CHECKLIST.md   # Sequential feature implementation matrix
│   └── PROJECT_SPEC.md        # Product specifications & Jules task plan
├── apps/
│   ├── web/                   # Expo / React Native Web frontend (@ebookshop/web)
│   └── api/                   # NestJS REST API (@ebookshop/api)
├── package.json               # Root workspace configuration
├── .env.example               # Template environment variables
└── .gitignore                 # Git ignore rules
```

---

## 3. Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Setup
1. Clone the repository and install workspace dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

3. Run development servers:
   ```bash
   # Run NestJS API backend
   npm run api

   # Run Expo / React Native Web frontend
   npm run web
   ```

---

## 4. Build, Lint, and Test Commands

- **Build all workspaces:**
  ```bash
  npm run build
  ```

- **Typecheck and Lint all workspaces:**
  ```bash
  npm run lint
  ```

- **Run all test suites:**
  ```bash
  npm test
  ```

---

## 5. Architecture & Data Persistence

The API uses domain repository interfaces backed by interchangeable adapters:
- **JSON Storage Adapter (`DATA_STORE=json`):** Lightweight JSON files for offline/local development.
- **PostgreSQL Storage Adapter (`DATA_STORE=postgres`):** Prisma ORM-backed relational storage for persistent environments.

For detailed architecture specifications and compatibility assessments, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
