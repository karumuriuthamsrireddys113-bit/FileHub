# FileHub - Full-Stack File and Document Organizer

**Live Demo Application:** [https://file-hub-eta.vercel.app/](https://file-hub-eta.vercel.app/)
**GitHub Repository:** [https://github.com/karumuriuthamsrireddys113-bit/FileHub.git](https://github.com/karumuriuthamsrireddys113-bit/FileHub.git)

**FileHub** is a clean, modern, beginner-friendly full-stack web application designed to help users organize, search, filter, and manage documents in one centralized place.

Built with **React**, **Node.js**, **Express.js**, **MongoDB**, **Prisma ORM**, and **TanStack Query**.

---

## 📑 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
- [Environment Configuration](#-environment-configuration)
- [MongoDB & Prisma Setup](#-mongodb--prisma-setup)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [React Performance Demonstrations](#-react-performance-demonstrations)
- [TanStack Query Implementation](#-tanstack-query-implementation)
- [Production Deployment (Render & Vercel)](#-production-deployment-render--vercel)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🌟 Features

### 1. Centralized Document Dashboard
- **Document Statistics Cards**: Live overview of total documents and category counts (`College`, `Personal`, `Work`, `Finance`, `Other`). Clicking any card filters the library instantly.
- **Search & Filter Bar**: Real-time debounced search by document name with instant reset.
- **Category Filter**: Filter documents by College, Personal, Work, Finance, or Other.
- **Multi-Field Sorting**: Sort documents by Date Added (Newest / Oldest), Last Updated, or Name (A to Z / Z to A).
- **Dual Display Modes**: Toggle between an interactive **Grid Card View** and a clean **Table View**.
- **Server-Side Pagination**: Navigate smoothly with configurable page size (6, 8, 12, 24 per page).

### 2. Complete Document CRUD
- **Add Document**: Create documents with name, category, description, and external file URL.
- **View Details**: Inspect complete document metadata, formatted timestamps, and direct web links.
- **Edit Document**: Update existing document information with live validation.
- **Delete Document**: Safe deletion with a confirmation dialog to prevent accidental loss.
- **External File Links**: Open external cloud documents (Google Drive, Dropbox, arXiv, etc.) in a new tab.

### 3. Resilient Validation & Error Handling
- Required document name (1–150 characters).
- Required category from a strictly validated whitelist.
- Optional external file URL validated for standard HTTP/HTTPS formatting.
- Form submission is safely disabled during mutation requests to prevent duplicates.
- User-friendly toast notifications for success and error events.

---

## 💻 Technology Stack

### Frontend (`client/`)
- **React (v18)** with **Vite** for fast modern tooling.
- **JavaScript** (clean ES Modules, no TypeScript overhead).
- **TanStack Query (React Query v5)** for robust server-state caching, pagination, and invalidation.
- **Axios** with a shared client instance and centralized error interceptors.
- **Lucide React** for lightweight, professional UI icons.
- **Custom CSS** with modern design tokens, responsive grid/flexbox, and a professional light theme.

### Backend (`server/`)
- **Node.js** (ES Modules).
- **Express.js** REST API architecture.
- **Prisma ORM (v5)** with the official MongoDB provider (`@prisma/client`).
- **CORS** and JSON body parsing middleware.
- Centralized error-handling and 404 middleware.

### Database
- **MongoDB** with Prisma ORM.
- Supports both **MongoDB Atlas** (cloud replica set) and **Local MongoDB Replica Sets**.
- Built-in zero-config embedded replica set fallback for instant local testing!

---

## 📁 Project Architecture

```
files and document manager project/
├── package.json                   # Root package with helper scripts
├── README.md                      # Documentation & setup guide
├── client/                        # React Frontend (Vite)
│   ├── index.html                 # HTML shell with Google Fonts
│   ├── vite.config.js             # Vite config with API reverse proxy
│   ├── package.json               # Frontend dependencies
│   └── src/
│       ├── main.jsx               # React entry point with QueryClientProvider
│       ├── App.jsx                # Main container: state, queries, modals
│       ├── index.css              # Custom responsive light-theme CSS
│       ├── services/
│       │   ├── api.js             # Shared Axios instance with interceptors
│       │   └── documentService.js # API methods (CRUD, stats, pagination)
│       └── components/
│           ├── Header.jsx         # App header with FileHub branding & Add button
│           ├── StatsOverview.jsx  # Category stats cards (useMemo)
│           ├── FilterBar.jsx      # Search, filter, sort & view toggle
│           ├── DocumentCard.jsx   # Grid card component (React.memo)
│           ├── DocumentRow.jsx    # Table row component (React.memo)
│           ├── DocumentList.jsx   # List container (grid/table/empty/loading)
│           ├── Pagination.jsx     # Pagination bar with per-page selector
│           ├── CategoryBadge.jsx  # Color-coded category tags
│           ├── DocumentFormModal.jsx   # Add/Edit modal with validation
│           ├── DocumentDetailModal.jsx # Detailed document viewer modal
│           ├── DeleteConfirmModal.jsx  # Deletion confirmation modal
│           └── Toast.jsx          # Success/error feedback toasts
└── server/                        # Express Backend & Prisma ORM
    ├── package.json               # Backend dependencies & Prisma scripts
    ├── .env.example               # Environment variables template
    ├── .env                       # Local environment variables
    ├── prisma/
    │   └── schema.prisma          # Prisma schema with MongoDB provider
    └── src/
        ├── server.js              # Express app entry point & listener
        ├── config/
        │   ├── prisma.js          # PrismaClient initialization & connection
        │   └── seed.js            # Sample documents seeder
        ├── controllers/
        │   └── documentController.js # CRUD handlers, search, stats, filters
        ├── routes/
        │   └── documentRoutes.js  # REST route definitions
        └── middleware/
            ├── errorHandler.js    # Centralized error formatting middleware
            └── notFoundHandler.js # 404 route handler
```

---

## ⚙️ Prerequisites

Before you start, make sure you have:
- **Node.js** (version 18.x, 20.x, or 22.x+ recommended; verified on Node v24)
- **npm** (version 9.x or higher)
- A web browser (Chrome, Safari, Firefox, Edge)
- *(Optional)* A free [MongoDB Atlas](https://www.mongodb.com/atlas) account if you wish to connect your own cloud database.

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

From the project root directory, install dependencies for both the server and client:

```bash
# Option A: Using root helper script
npm run install:all

# Option B: Installing manually in each directory
cd server && npm install
cd ../client && npm install
```

### Step 2: Configure Environment Variables

The server includes a pre-configured `.env` and `.env.example`:

```bash
cd server
cp .env.example .env
```

Default contents of `server/.env`:
```env
PORT=5001

# To connect your own MongoDB Atlas database, uncomment and add your connection string:
# DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/filehub?retryWrites=true&w=majority"
```

> **Note on Zero-Config Mode**: If `DATABASE_URL` is omitted or left commented, FileHub automatically starts a local in-memory MongoDB replica set and seeds it with 10 sample documents. You can begin developing and testing right away without signing up for any cloud service!

### Step 3: Generate Prisma Client

Whenever you change `prisma/schema.prisma` or install packages, generate the Prisma Client:

```bash
cd server
npm run prisma:generate
```

### Step 4: Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
=================================================
🚀 FileHub Backend Server running on port 5001
📡 Base API: http://localhost:5001/api/documents
🩺 Health Check: http://localhost:5001/api/health
=================================================
```

### Step 5: Start the Frontend Client

Open a **separate terminal window** and run:

```bash
cd client
npm run dev
```

Then open your browser to **http://localhost:3000**.

---

## 🗄️ MongoDB & Prisma Setup

### Using MongoDB Atlas (Cloud)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a database user with read and write privileges.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or your current IP.
4. Click **Connect** → **Drivers** (Node.js) and copy the connection string.
5. In `server/.env`, set:
   ```env
   DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-address>/filehub?retryWrites=true&w=majority"
   ```
6. Sync your Prisma schema:
   ```bash
   cd server
   npx prisma db push
   ```

### Prisma Schema (`server/prisma/schema.prisma`)

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Document {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  category    String
  fileUrl     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("documents")
}
```

---

## 📡 API Reference

Base URL: `http://localhost:5001/api` (or `/api` via Vite proxy)

### 1. List Documents (Paginated, Filtered, Sorted)
- **Endpoint**: `GET /api/documents`
- **Query Parameters**:
  - `page` (number, default: `1`): Current page index
  - `limit` (number, default: `8`, max: `50`): Items per page
  - `search` (string, optional): Case-insensitive match on document name
  - `category` (string, optional): Filter by `College`, `Personal`, `Work`, `Finance`, `Other`
  - `sortBy` (string, default: `createdAt`): `createdAt`, `updatedAt`, or `name`
  - `order` (string, default: `desc`): `asc` or `desc`
- **Example Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "6addcae80b0a47d5be474095",
        "name": "Calculus III Syllabus & Exam Schedule.pdf",
        "description": "Course syllabus and exam schedule.",
        "category": "College",
        "fileUrl": "https://example.com/syllabus.pdf",
        "createdAt": "2026-10-25T09:24:56.319Z",
        "updatedAt": "2026-10-25T09:24:56.319Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 8,
      "totalDocuments": 10,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
  ```

### 2. Get Document by ID
- **Endpoint**: `GET /api/documents/:id`
- **Response**: `{ "success": true, "data": { ...document } }`
- **Error (404)**: `{ "success": false, "message": "Document not found" }`

### 3. Create Document
- **Endpoint**: `POST /api/documents`
- **Payload**:
  ```json
  {
    "name": "Project Proposal.docx",
    "category": "Work",
    "description": "Initial draft of Q4 initiative",
    "fileUrl": "https://example.com/proposal.docx"
  }
  ```
- **Response (201)**: `{ "success": true, "message": "Document created successfully", "data": { ... } }`

### 4. Update Document
- **Endpoint**: `PUT /api/documents/:id`
- **Payload**: Same fields as creation (partial updates supported)
- **Response (200)**: `{ "success": true, "message": "Document updated successfully", "data": { ... } }`

### 5. Delete Document
- **Endpoint**: `DELETE /api/documents/:id`
- **Response (200)**: `{ "success": true, "message": "Document deleted successfully" }`

### 6. Get Document Statistics
- **Endpoint**: `GET /api/documents/stats`
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "totalDocuments": 10,
      "byCategory": {
        "College": 2,
        "Personal": 2,
        "Work": 2,
        "Finance": 2,
        "Other": 2
      }
    }
  }
  ```

---

## ⚡ React Performance Demonstrations

The application meaningfully incorporates the three core React performance hooks with comments explaining their exact purpose:

### 1. `React.memo`
- **Where**: [`client/src/components/DocumentCard.jsx`](client/src/components/DocumentCard.jsx) and [`client/src/components/DocumentRow.jsx`](client/src/components/DocumentRow.jsx).
- **Purpose**: Prevents unnecessary re-renders of individual cards or rows in the list when other sibling items change or when the parent re-renders due to user typing in search.
- **Code Comment**:
  ```javascript
  // React.memo prevents unnecessary re-renders of DocumentCard when parent components
  // re-render (e.g. during typing in search or updating other documents in the list),
  // as long as its props (document, stable event callbacks) remain identical.
  const DocumentCard = React.memo(function DocumentCard({ ... }) { ... });
  ```

### 2. `useMemo`
- **Where**: [`client/src/components/StatsOverview.jsx`](client/src/components/StatsOverview.jsx) and [`client/src/App.jsx`](client/src/App.jsx).
- **Purpose**: Caches derived category counts and the `isFiltered` indicator so calculations are only redone when query data or filter state actually changes.
- **Code Comment**:
  ```javascript
  // useMemo: Memoizes the calculated card list and category totals so they are
  // only recomputed when the server stats or selected category changes, avoiding
  // redundant object creation on parent re-renders.
  const statCards = useMemo(() => { ... }, [stats, selectedCategory]);
  ```

### 3. `useCallback`
- **Where**: [`client/src/App.jsx`](client/src/App.jsx).
- **Purpose**: Provides stable reference handlers (`handleViewDocument`, `handleEditDocument`, `handleDeleteDocument`, `handleOpenAddModal`) passed down to memoized child components (`DocumentCard` and `DocumentRow`), preserving `React.memo` benefits.
- **Code Comment**:
  ```javascript
  // useCallback: Stable event handlers passed down to DocumentList and DocumentCard.
  // Because DocumentCard and DocumentRow are wrapped in React.memo, passing stable
  // callbacks ensures that list items do not re-render unless their specific document data changes.
  const handleViewDocument = useCallback((doc) => { ... }, []);
  ```

---

## 🔄 TanStack Query Implementation

TanStack Query (v5) is configured in `client/src/main.jsx` and used in `client/src/App.jsx`:

1. **`useQuery` for Document Listing**:
   ```javascript
   useQuery({
     queryKey: ['documents', { page, limit, search, category, sortBy, order }],
     queryFn: () => fetchDocuments({ ... }),
     keepPreviousData: true,
     staleTime: 5000
   });
   ```
   *Query key ensures that page changes, searches, category changes, or sorting instantly fetch the right cache slice or trigger a targeted network request.*

2. **`useQuery` for Statistics**:
   ```javascript
   useQuery({
     queryKey: ['documents', 'stats'],
     queryFn: fetchDocumentStats,
     staleTime: 10000
   });
   ```

3. **`useMutation` with Cache Invalidation**:
   - `createMutation`, `updateMutation`, and `deleteMutation` call `queryClient.invalidateQueries({ queryKey: ['documents'] })` inside `onSuccess`.
   - This keeps the document list and category totals in sync across the dashboard without manual page reloads or full page refetches.

---

## 🚀 Production Deployment (Render & Vercel)

FileHub is fully optimized and production-ready for deployment:
- **Backend (Node.js/Express + Prisma)**: Ready for [Render](https://render.com) using the included [`render.yaml`](./render.yaml) blueprint or manual Web Service setup.
- **Frontend (React + Vite)**: Ready for [Vercel](https://vercel.com) using the included [`client/vercel.json`](./client/vercel.json) configuration.
- **Database (MongoDB)**: Ready for [MongoDB Atlas](https://www.mongodb.com/atlas) Free Tier (M0).

📖 **Read the full step-by-step instructions in the [Production Deployment Guide](./DEPLOYMENT.md)**.

---

## 🛠️ Troubleshooting & FAQs

### 1. Port 5000 Conflict on macOS
- **Problem**: On macOS Monterey/Ventura/Sonoma/Sequoia, the native AirPlay Receiver listens on port 5000 by default, causing `listen EADDRINUSE :::5000`.
- **Solution**: FileHub is configured to use **port 5001** for the backend and **port 3000** for the frontend to prevent this issue.

### 2. MongoDB Replica Set Requirement for Prisma
- **Problem**: Prisma ORM requires MongoDB to be running as a replica set (transactions support).
- **Solution**:
  - MongoDB Atlas clusters are already replica sets out of the box.
  - If running without an external database, FileHub's embedded engine starts an in-memory replica set automatically.
  - For local MongoDB installations, initiate the replica set using `mongosh --eval "rs.initiate()"`.

### 3. Prisma Client Out of Sync
- **Problem**: You modified `schema.prisma` and see TypeScript/JavaScript runtime errors.
- **Solution**: Run `cd server && npm run prisma:generate`.

---

## 📜 License

This project is licensed under the MIT License.



