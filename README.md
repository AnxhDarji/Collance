# Collance

A full-stack freelance collaboration platform that connects **clients** and **freelancers** to manage projects, tasks, and communication in one place.

---

## Overview

Collance is designed as a simplified freelancing system where users can create projects, assign tasks, manage workflows, and track progress. It focuses on clean UI, role-based functionality, and practical backend concepts.

This project demonstrates real-world implementation of modern web development including authentication, API handling, and database integration.

---

## Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Context API

**Backend**

* Node.js
* Express.js

**Database**

* PostgreSQL (Neon)

**Authentication**

* JWT (JSON Web Tokens)
* Google OAuth

---

## Features

### Authentication & User Management

* User signup and login
* Google authentication integration
* Role-based access (Client / Freelancer)
* Profile creation and updates

---

### Project Management (Client)

* Create and manage projects
* Assign freelancers to projects
* View project details and progress

---

### Task Management

* Create tasks within projects
* Assign tasks to freelancers
* Update task status (pending, in-progress, completed)
* Filter tasks based on project and user

---

### Notifications

* Updates for proposals and tasks
* Centralized notification handling using context

---

### Dashboard

* Role-based dashboard (Client / Freelancer)
* Displays key statistics:

  * Total projects
  * Completed tasks
  * Active work

---

### Public Profile Features

* View other user profiles
* Display creator information
* Public visibility of shared content

---

### Settings

* Update profile details
* Manage user preferences

---

## How It Works

### 1. Authentication Flow

* User signs up or logs in
* JWT token is generated and used for authentication
* Protected routes are secured using middleware

---

### 2. Role-Based System

* **Client**: Creates and manages projects
* **Freelancer**: Works on assigned tasks

---

### 3. Project & Task Flow

1. Client creates a project
2. Tasks are added under the project
3. Freelancers are assigned
4. Freelancers update task status
5. Dashboard reflects progress

---

### 4. Backend Structure

* **Routes** handle API endpoints
* **Controllers** manage business logic
* **Middleware** handles authentication and validation
* **Database (Neon)** stores application data

---

## Environment Variables

Create a `.env` file in both frontend and backend.

### Backend

```
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend

```
VITE_API_URL=your_backend_url
```

---

## Deployment

* Frontend → Vercel
* Backend → Render
* Database → Neon

---

## Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/collance.git
cd collance
```

---

### 2. Install dependencies

Frontend:

```
cd client
npm install
npm run dev
```

Backend:

```
cd server
npm install
npm run dev
```

---

### 3. Configure environment variables

Add `.env` files as described above.

---

## Future Improvements

* Real-time chat system
* Payment integration
* Advanced search and filtering
* UI/UX enhancements
* Notifications using WebSockets

---

## Author

**Anshkumar Darji**
Computer Engineering Student

---

## License

This project is for educational and portfolio purposes.

---

## Final Note

This project focuses on learning and implementation of full-stack concepts rather than production-level scalability. It demonstrates strong fundamentals in building and deploying a real-world application.
