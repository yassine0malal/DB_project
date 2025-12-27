# Backend Migration Walkthrough

I have successfully migrated the application to use a persistent SQLite database instead of local keys/state.

## 1. Server Architecture
A new `server` directory has been created containing:
- **`schema.sql`**: Defines the robust database structure (Users, Students, Teachers, Admins, Groups, Clubs, Posts, etc.).
- **`db.js`**: Handles the connection to `database.sqlite` (created at project root).
- **`seed.js`**: A script to populate the database with initial data (Users and Feed).
- **`index.js`**: An Express.js API server running on port 3000.

## 2. API Endpoints
The following endpoints are now active:
- `GET /api/posts`: Retrieves the social feed (with author details).
- `POST /api/posts`: Creates a new post.
- `GET /api/users/:id`: Retrieves detailed user profiles.

## 3. Frontend Integration
- **`usePostStore.ts`**: Refactored to fetch data asynchronously from `http://localhost:3000/api`.
- **`FeedPage.tsx`**: Updated to trigger the data fetch on component mount and display a loading state.

## How to Run
1.  **Frontend**: `npm run dev` (already running).
2.  **Backend**: `node server/index.js` (I started this for you).

The data you see in the feed now comes directly from the `database.sqlite` file.
