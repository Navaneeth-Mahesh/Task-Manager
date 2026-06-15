TaskFlow – Task Management Application

TaskFlow is a full-stack task management application designed to help users create, organize, update, and track tasks efficiently. The application includes user authentication, task management features, analytics, and a responsive user interface for both desktop and mobile devices.
link :https://navaneeth-mahesh.github.io/Task-Manager/
Features

Authentication

* User Registration
* User Login & Logout
* Protected Routes
* Session Management

Task Management

* Create Tasks
* View Tasks
* Update Tasks
* Delete Tasks
* Task Status Tracking
* Priority Management
* Due Date Management

Dashboard

* Task Statistics
* Progress Overview
* Activity Insights

Additional Features

* Responsive Design
* Team Management Interface
* Analytics Dashboard
* Calendar View
* User Settings

⸻

Tech Stack

Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion
* GSAP
* React Router DOM
* Recharts

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO

Deployment

* GitHub Pages (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

⸻

Project Structure

TASK-MANAGER/
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── src/
│   ├── server.js
│   └── package.json
│
└── README.md

⸻

Installation

Clone Repository

git clone https://github.com/Navaneeth-Mahesh/Task-Manager.git
cd Task-Manager

Frontend Setup

cd Frontend
npm install
npm run dev

Backend Setup

cd Backend
npm install
npm run dev

⸻

Environment Variables

Backend

Create a .env file inside the Backend directory:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

Frontend

Create a .env file inside the Frontend directory:

VITE_API_URL=http://localhost:4000/api

⸻

API Modules

* Authentication API
* Task Management API
* Dashboard API
* Analytics API

⸻

Future Improvements

* Real-time task updates
* File attachments
* Email notifications
* Advanced filtering and search
* Team collaboration features

⸻

Author

Navaneeth

Built as a full-stack project to demonstrate modern web development concepts including authentication, REST APIs, database integration, and responsive UI development.

License

MIT License
