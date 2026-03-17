# Collance

A full-stack freelance collaboration platform that connects clients and freelancers to manage projects, tasks, and workflows efficiently.

---

## Overview

Collance allows users to create projects, assign tasks, and track progress with a role-based system. It focuses on practical implementation of authentication, APIs, and database handling.

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** PostgreSQL (Neon)
**Auth:** JWT, Google OAuth

---

## Features

* User authentication (Email + Google)
* Role-based access (Client / Freelancer)
* Project creation and management
* Task assignment and status tracking
* Dashboard with project and task insights
* User profiles and basic settings
* Notification handling

---

## How It Works

1. Users sign up or log in
2. Clients create projects and add tasks
3. Freelancers are assigned tasks
4. Task status is updated as work progresses
5. Dashboard reflects overall activity

---

## Environment Variables

**Backend**

```
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

**Frontend**

```
VITE_API_URL=your_backend_url
```

---

## Deployment

* Frontend → Vercel
* Backend → Render
* Database → Neon

---

## Setup

```bash
git clone https://github.com/AnxhDarji/collance.git
cd collance
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

**Backend**

```bash
cd server
npm install
npm run dev
```

---

## Author

Anshkumar Darji
