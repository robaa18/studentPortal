#  Student Portal

A full-stack **Student Portal** designed to simplify academic management for both students and administrators.

The system provides separate student and admin experiences for managing courses, grades, schedules, student information, and other academic operations.

---

##  Features

###  Student Features

- Secure student login
- Student dashboard
- View personal profile
- View academic schedule
- View grades
- Browse and register for courses
- Access student-specific protected pages

###  Admin Features

- Admin login
- Admin dashboard
- Manage students
- Manage courses
- Manage student grades
- Monitor and manage academic information
- Access admin-specific protected pages

---

##  Tech Stack

### Backend

![Java](https://img.shields.io/badge/Java-Backend-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?logo=springboot&logoColor=white)

- Java
- Spring Boot
- RESTful APIs

### Frontend

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?logo=tailwindcss&logoColor=white)

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- React Toastify

---

##  Project Structure

```text
studentPortal/
│
├── backend/
│   └── Spring Boot Application
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── protectedRoutes/
│       └── services/
│
└── README.md
```

---

##  Main Pages

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

##  Getting Started

### Prerequisites

Make sure you have the following installed:

- Java
- Node.js
- npm
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/robaa18/studentPortal.git
```

Move into the project:

```bash
cd studentPortal
```

---

#  Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application using your IDE or Maven.

If the project contains Maven Wrapper:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

Or using Maven:

```bash
mvn spring-boot:run
```

The backend will typically run on:

```text
http://localhost:8080
```

> The backend port may vary depending on the project configuration.

---

#  Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will typically run on:

```text
http://localhost:5173
```

---

##  Application Flow

```text
React Frontend
      ↓
    Axios
      ↓
RESTful API
      ↓
Spring Boot Backend
      ↓
Application Data
```

The frontend communicates with the Spring Boot backend through RESTful APIs.

---

##  Frontend Architecture

The frontend is organized into reusable and separated modules:

```text
src/
│
├── components/
│   └── Reusable UI components
│
├── context/
│   └── Application and authentication state
│
├── layouts/
│   ├── Student Layout
│   └── Admin Layout
│
├── pages/
│   ├── student/
│   └── admin/
│
├── protectedRoutes/
│   └── Route protection
│
└── services/
    └── API communication
```

---

##  Role-Based Access

The application provides two main roles:

### Student

Students can access academic information related to their accounts.

### Admin

Administrators can manage students, courses, grades, and other academic data.

Protected routes ensure that each role can only access its authorized pages.

---

##  Academic Management

The portal provides functionality for managing:

- Students
- Courses
- Course registration
- Grades
- Academic schedules
- Student profiles

---

##  Screenshots

### Login Page

<!-- Add screenshot here -->

### Student Dashboard

<!-- Add screenshot here -->

### Student Grades

<!-- Add screenshot here -->

### Course Registration

<!-- Add screenshot here -->

### Admin Dashboard

<!-- Add screenshot here -->

---

##  Project Purpose

This project was developed as an academic software project to apply full-stack development concepts in a practical application.

The project provided practical experience with:

- Building RESTful APIs
- Frontend and backend integration
- Java and Spring Boot backend development
- React frontend development
- Role-based application design
- Routing and protected pages
- API communication
- Form handling and validation
- Team collaboration
- Git and GitHub

---

##  Author

**Robaa Ahmed**

Junior Backend Developer

GitHub: [@robaa18](https://github.com/robaa18)

---

##  License

This project was developed for educational and portfolio purposes.
