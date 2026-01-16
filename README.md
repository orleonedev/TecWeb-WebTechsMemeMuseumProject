# WebTech's MemeMuseum

<table>
  <tr>
    <td width="128">
      <img src="assets/logo-federico-II.svg" alt="Unina Logo" width="128"/>
    </td>
    <td>
      <strong>Course:</strong> Web Technologies @ Università degli studi di Napoli Federico II (UNINA)<br />
      <strong>Track:</strong> B - WebTech's MemeMuseum<br />
      <strong>Author:</strong> Oreste Leone N86/1980
    </td>
  </tr>
</table>

## 📖 Project Overview

**MemeMuseum** is a Single Page Application (SPA) dedicated to sharing and discovering memes. It allows users to explore a gallery of memes, view a "Meme of the Day", and search by tags or dates. Authenticated users can upload memes, vote (upvote/downvote), and comment on content.

The project relies on a strictly defined architecture:

- **Frontend:** React + Vite (Feature-Based Architecture)
- **Backend:** Express + Node.js (3-Layer Architecture)
- **Database:** SQLite (managed via Prisma ORM)
- **Infrastructure:** Docker Compose

## 🛠 Tech Stack

### Backend (`/backend`)

- **Runtime:** Node.js (v24 LTS)
- **Framework:** Express.js (TypeScript)
- **Database:** SQLite (`dev.db`)
- **ORM:** Prisma
- **Auth:** JWT (JSON Web Tokens) & **bcryptjs**
- **File Upload:** Multer (Local storage in `./public/uploads`)

### Frontend (`/frontend`)

- **Framework:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS + DaisyUI
- **Data Fetching:** **Axios** + React Query (TanStack Query)
- **State Management:** Context API (Auth state)
- **Routing:** React Router DOM
- **Testing:** Cypress (E2E)

### Infrastructure

- **Orchestration:** Docker Compose
- **Web Server:** Nginx (for serving the production frontend)
- **Persistence:** Docker Volumes for database and uploads

## 🚀 Getting Started (Docker - Recommended)

The easiest way to run the entire application is using Docker Compose.

### Prerequisites

- Docker Desktop installed and running.

### Steps

1. **Configure Network Access (Optional)**:
   If you plan to access the app from a mobile device or another computer on your network:
   - Create a `.env` file in the project root.
   - Add your machine's local IP address (e.g., `192.168.1.X`):

     ```env
     VITE_API_URL=http://<YOUR_LOCAL_IP>:3000
     ```

2. **Start the application**:

   ```bash
   # If using a custom .env file for network access
   docker-compose --env-file .env up --build

   # Or simply (defaults to localhost)
   docker-compose up --build
   ```

   *This command builds the images for both frontend and backend, sets up the network, and mounts the necessary volumes.*

3. **Access the App**:
   - **Frontend:** [http://localhost:5173](http://localhost:5173) (or `http://<YOUR_LOCAL_IP>:5173`)
   - **Backend API:** [http://localhost:3000](http://localhost:3000) (or `http://<YOUR_LOCAL_IP>:3000`)

4. **Stop the application**:
   Press `Ctrl+C` in the terminal or run:

   ```bash
   docker-compose down
   ```

## 🔧 Manual Setup (Development Mode)

If you prefer running services individually without Docker.

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push Database Schema (Create dev.db)
npx prisma db push

# Optional, Seed Database
npx prisma db seed

# Start the Server
npm run dev
```

*The backend will run on `http://localhost:3000`.*

### 2. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the Dev Server
npm run dev
```

*The frontend will run on `http://localhost:5173`.*

## 🧩 Key Architectural Patterns

The project implements several clean-code patterns to ensure maintainability:

- **Shared Types:** TypeScript DTOs and constants are shared between Frontend and Backend in `/src/shared`.
- **Async Error Handling:** Uses a centralized `asyncHandler` wrapper in the backend to eliminate repetitive try-catch blocks.
- **Centralized API Client:** A configured Axios instance with interceptors handles JWT token injection automatically.
- **Logic Extraction:** Complex UI logic (e.g., voting) is moved from components into custom hooks like `useVote`.

## 📂 Project Structure

```text
/
├── docker-compose.yml    # Orchestration
├── backend/              # Express API
│   ├── src/
│   │   ├── controllers/  # Request handling
│   │   ├── services/     # Business logic & DB access
│   │   ├── shared/       # Shared types & constants
│   │   ├── routes/       # API Routes definition
│   │   ├── lib/          # Utilities (AsyncHandler, etc.)
│   │   └── app.ts        # Express setup
│   ├── prisma/           # Database schema
│   └── public/uploads/   # Meme image storage
└── frontend/             # React App
    ├── src/
    │   ├── features/     # Logic grouped by feature (auth, memes)
    │   ├── shared/       # Shared types & constants
    │   ├── components/   # Shared UI components
    │   ├── pages/        # Page assemblers
    │   ├── lib/          # Utilities (Axios config)
    │   └── layouts/      # MainLayout, Navbar
    └── cypress/          # End-to-End tests
```

## ✨ Features

### Public (No Login Required)

- **Gallery:** Browse memes with pagination.
- **Meme of the Day:** View a randomly selected meme.
- **Search:** Filter by tag or date.
- **Sorting:** Sort by upload date or popularity (votes).
- **Details:** View full-size image, score, and comments.

### Authenticated

- **Upload:** Post new memes with images and tags.
- **Interaction:** Upvote/Downvote memes.
- **Comments:** Add comments to discussions.

## 🧪 Testing

End-to-End tests are implemented using Cypress.

To run tests (ensure frontend and backend are running):

```bash
cd frontend
npx cypress open
```

## 📝 Notes

- **Mobile First:** The UI is designed to be fully responsive.
- **Persistence:** SQLite database and uploaded images are persisted via Docker volumes.
