# 📋 Project Management Dashboard

This is a full-stack Project Management Dashboard built using **React** (frontend), **Express** (backend), **TypeScript** (for type safety), and **Xata** (for database management). It allows users to manage tasks, track time, monitor activity, and set reminders efficiently.

## 🚀 Tech Stack

- **Frontend**: Vite + React ⚛️
- **Backend**: Express.js 🚀
- **Database**: Xata 🌐
- **Language**:TypeScript(Backend) / JavaScript(Frontend) 🟦
- **Styling**: CSS 💅
- **Authentication**: JWT 🔐

---

## 📂 Project Structure

```bash
├── Backend/
│   ├── Middlewares/
│   ├── Controllers/
│   ├── Models/
│   ├── Utils/
│   ├── Routes/
│   ├── index.ts
│   ├── .gitignore
│   ├── tsconfig.json
│   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
└── README.md
```
---

## 🎯 Features

- **📝 To-do List**: Create, update, and delete tasks with emoji support.
<!--
# - **⏲️ Time Tracker**: Track time spent on each task.
# - **📊 Activity Summary**: Monitor completed tasks, working hours, and project status.
# - **📅 Task Assignments**: Assign tasks to users and monitor progress.-->
- **🔔 Reminders**: Set reminders for tasks and meetings.
- **🔐 Authentication**: User sign-up and sign-in with JWT-based authentication.

---

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (>=18.x)
- **Xata** account for database management
- **Git** for version control

### 1. Clone the Repository

```bash
https://github.com/Muthonikiboi/TaskHub.git
cd TaskHub
```

## 2. Install Dependencies

### Backend:
```bash
cd Backend
pnpm install
```

### Frontend:
```bash
cd Frontend
pnpm install
```

## 3. Configure Environment Variables

Create a **.env** file in the backend/ directory to configure environment variables:

```bash
PORT=3000;
XATA_API_KEY=your_xata_api_key
databaseURL=your_xata_db_url
JWT_SECRET=your_jwt_secret
```
For the frontend, you can create a **.env** file in the frontend/ directory to configure the API base URL:

```bash
VITE_API_URL=http://localhost:3000/api
```
## 4. Run the Backend

```bash
cd Backend
pnpm run dev
```
This will start the Express server at **http://localhost:3000.**

## 5. Run the Frontend

```bash
cd Frontend
pnpm run dev
```
This will start the Express server at **http://localhost:3000**

## 🧑‍💻 API Endpoints

### Users
- **POST** `/api/auth/signup` - Sign up a new user.
- **POST** `/api/auth/signin` - Sign in an existing user.

### Tasks
- **GET** `/api/tasks` - Fetch all tasks.
- **POST** `/api/tasks` - Create a new task.
- **PUT** `/api/tasks/:id` - Update an existing task.
- **DELETE** `/api/tasks/:id` - Delete a task.

### Time Logs
- **POST** `/api/time-logs` - Log time for a task.
- **GET** `/api/time-logs/:taskId` - Fetch time logs for a task.

### Activity Summary
- **GET** `/api/activity-summary` - Fetch the user’s activity summary.

### Reminders
- **POST** `/api/reminders` - Set a reminder for a task.
- **GET** `/api/reminders/:userId` - Fetch reminders for the user.



## 7.🧪 Running Tests
We use **Jest** unit tests.

### Backend Tests:
```bash
cd backend
pnpm run test
```

### Frontend Tests:
```bash
cd Frontend
pnpm run test
```

## 📜 Database Schema (Xata)

Here is a simplified overview of the database schema used in Xata:

### **Users Table**
| Column        | Type     | Description                     |
|---------------|----------|---------------------------------|
| `id`          | string   | Primary Key (UUID)              |
| `name`        | string   | User’s name                     |
| `email`       | string   | Unique email address             |
| `password`    | string   | Hashed password                  |
| `created_at`  | DateTime | Timestamp                        |

### **Tasks Table**
| Column         | Type     | Description                     |
|----------------|----------|---------------------------------|
| `id`           | string   | Primary Key (UUID)              |
| `title`        | string   | Task title                      |
| `description`  | string   | Task description                |            |
| `status`       | enum     | (upcoming, overdue, completed)  |
| `due_date`     | DateTime | Task due date                   |
| `created_by`   | string   | Foreign key (User ID)           |
| `assigned_to`  | string   | Foreign key (User ID)           |
<!--| `emoji`        | string   | Emoji representation -->
### **Time Logs Table**
| Column        | Type     | Description                     |
|---------------|----------|---------------------------------|
| `id`          | string   | Primary Key (UUID)              |
| `task_id`     | string   | Foreign key (Task ID)           |
| `user_id`     | string   | Foreign key (User ID)           |
| `time_spent`  | int      | Time spent in minutes           |

### **Reminders Table**
| Column        | Type     | Description                     |
|---------------|----------|---------------------------------|
| `id`          | string   | Primary Key (UUID)              |
| `task_id`     | string   | Foreign key (Task ID)           |
| `reminder_time` | DateTime | Reminder timestamp               |

---
Feel free to reach out if you have any questions or feedback! 😊

Happy Coding! ✨

