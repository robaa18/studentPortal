#  Student Portal

A full-stack **Student Management Portal** built to provide students and administrators with a simple and organized platform for managing academic information.

The system includes secure authentication, role-based access control, course registration, grades, schedules, student management, and academic data management.

---

##  Features

###  Student

- Student authentication
- Personal dashboard
- View and manage profile
- View academic schedule
- View grades
- Register for courses
- Protected student routes

###  Admin

- Admin authentication
- Admin dashboard
- Manage students
- Manage courses
- Manage grades
- Role-based protected routes

###  Security

- JWT authentication
- Access & refresh tokens
- Password hashing using bcrypt
- Role-based authorization
- Request validation
- Protected frontend routes

---

##  Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- React Toastify

### Backend

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Joi
- CORS

### DevOps

![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)

- Docker
- Docker Compose
- Nginx

---

##  Project Structure

```text
studentPortal/
│
├── backend/
│   ├── config/
│   ├── scripts/
│   ├── src/
│   │   ├── DB/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── Auth/
│   │   │   ├── Course/
│   │   │   ├── User/
│   │   │   ├── announcements/
│   │   │   ├── grades/
│   │   │   └── schedule/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── protectedRoutes/
│   │   └── services/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

##  API Modules

The backend is organized into multiple modules:

```text
/api/auth
/api/course
/api/grades
/api/schedule
/api/user
/api/announce
```

This modular structure keeps authentication, courses, grades, schedules, users, and announcements separated and maintainable.

---

#  Getting Started

You can run the project either manually or using Docker.

---

## Option 1 — Run with Docker

### Requirements

- Docker
- Docker Compose

Clone the repository:

```bash
git clone https://github.com/robaa18/studentPortal.git
```

Enter the project directory:

```bash
cd studentPortal
```

Build and start the application:

```bash
docker compose up --build
```

The application will be available at:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
MongoDB:  mongodb://localhost:27017
```

To stop the containers:

```bash
docker compose down
```

---

#  Option 2 — Run Manually

## 1. Clone the Repository

```bash
git clone https://github.com/robaa18/studentPortal.git
cd studentPortal
```

---

## 2. Backend Setup

Go to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Example environment variables:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/studentportal

WHITE_LIST=http://localhost:5173,http://127.0.0.1:5173

SALT=10

TOKEN_ACCESS_USER_SECRET_KEY=your-user-access-secret
TOKEN_REFRESH_USER_SECRET_KEY=your-user-refresh-secret

TOKEN_ACCESS_ADMIN_SECRET_KEY=your-admin-access-secret
TOKEN_REFRESH_ADMIN_SECRET_KEY=your-admin-refresh-secret

ACCESS_EXPIRES=1d
REFRESH_EXPIRES=7d
```

Start the development server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Environment:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

##  Database Seed

The backend includes a database seed script.

Run:

```bash
cd backend
npm run seed
```

---

##  Application Routes

### Student

```text
/student/dashboard
/student/profile
/student/schedule
/student/grades
/student/courses
```

### Admin

```text
/admin/dashboard
/admin/students
/admin/courses
/admin/grades
```

---

##  Architecture

The backend follows a modular structure where each major feature is separated into its own module.

```text
Request
   ↓
Route
   ↓
Middleware / Validation
   ↓
Controller / Service
   ↓
Mongoose
   ↓
MongoDB
```

The frontend uses reusable components, layouts, authentication context, services, and protected routes to separate application responsibilities.

---

## Authentication Flow

The application supports authentication for both:

- Students
- Administrators

Protected routes prevent unauthorized users from accessing pages that do not belong to their role.

---

##  Screenshots

Screenshots of the project can be added here.

### Login

<!-- Add login screenshot -->

### Student Dashboard

<!-- Add student dashboard screenshot -->

### Admin Dashboard

<!-- Add admin dashboard screenshot -->

---

##  Project Purpose

This project was created as a practical full-stack application to apply concepts including:

- REST API development
- Authentication & authorization
- Database modeling
- Frontend/backend integration
- Role-based access control
- Form validation
- Modular backend architecture
- Docker containerization
- Team-based software development

---

##  Author

**Robaa Ahmed**

Backend / Full-Stack Developer

GitHub: [@robaa18](https://github.com/robaa18)

---

##  License

This project is intended for educational and portfolio purposes.
