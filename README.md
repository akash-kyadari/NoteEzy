# NoteEzy - A Real-time Collaborative Editor


NoteEzy is a powerful and intuitive real-time collaborative editor designed to bring teams together, wherever they are. It provides a shared digital workspace where multiple users can simultaneously create, edit, and format text-based documents. The application is built around the concept of rooms, allowing you to create private sessions for focused collaboration on specific projects or ideas. Secure authentication ensures that your work is safe, with options for both traditional email/password registration and convenient Google single sign-on. To supercharge your creative process, NoteEzy also includes an integrated AI chat assistant, ready to help you brainstorm, generate content, and overcome creative blocks.

## Features

*   **Real-time Collaboration:** See changes from other users in real-time.
*   **Rich Text Editor:** A full-featured text editor with various formatting options.
*   **Authentication:** Secure user authentication with email/password and Google OAuth.
*   **Room Management:** Create and join rooms to collaborate with others.


## Tech Stack

**Frontend:**

*   Next.js
*   React
*   Tailwind CSS
*   Socket.IO Client

**Backend:**

*   Node.js
*   Express
*   MongoDB
*   Socket.IO
*   Passport.js for authentication

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   MongoDB
*   Google OAuth credentials (for Google login)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/NoteEzy.git
    cd NoteEzy
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../client
    npm install
    ```

### Configuration

1.  **Backend:**

    *   Create a `.env` file in the `backend` directory and add the following environment variables:

        ```
        PORT=5000
        MONGODB_CONNECTION_URL=<your_mongodb_connection_url>
        JWT_SECRET=<your_jwt_secret>
        SESSION_SECRET=<your_session_secret>
        FRONTEND_URL=http://localhost:3000
        GOOGLE_CLIENT_ID=<your_google_client_id>
        GOOGLE_CLIENT_SECRET=<your_google_client_secret>
        ```

2.  **Frontend:**

    *   Create a `.env.local` file in the `client` directory and add the following environment variable:

        ```
        NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
        ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**

    ```bash
    cd ../client
    npm run dev
    ```

## API Endpoints

*   `POST /api/auth/signup` - Register a new user
*   `POST /api/auth/login` - Log in a user
*   `GET /api/auth/google` - Initiate Google OAuth
*   `GET /api/auth/google/callback` - Google OAuth callback
*   `POST /api/auth/logout` - Log out a user
*   `GET /api/me` - Get the current user's details
*   `POST /api/room` - Create a new room
*   `GET /api/room/:id` - Get room details
*   `POST /api/chat-ai` - Interact with the AI chat

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.


