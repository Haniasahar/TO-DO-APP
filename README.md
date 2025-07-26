<!-- dark mode

Due Dates & Reminders – Set deadlines and get notifications.

Priority Levels – High, Medium, Low (or color-coded).

Categories/Tags – Organize tasks (Work, Personal, Shopping, etc.).

Search & Filter – Find tasks quickly by name, date, or tag. -->


<h1> ✅ React To-Do App with Authentication </h1>

A feature-rich to-do application with smooth animations, secure authentication, and persistent local storage.

## ✨ Features

- **Task Management**: Add, edit, complete, and delete tasks
- **Persistent Storage**: Todos saved in browser's local storage
- **Beautiful Animations**: Powered by Animate.css
- **Secure Authentication**: Login system with Formik validation
- **Modern UI**: Clean interface with React Icons
- **Client-Side Routing**: Smooth navigation between views

## 🛠 Tech Stack

```bash
"dependencies": {
  "react": "^18.2.0",
  "react-router-dom": "^6.4.1",
  "formik": "^2.4.1",
  "animate.css": "^4.1.1",
  "react-icons": "^4.11.0",
  "localforage": "^1.10.0"  # or alternative for local storage
}
```

## 🚀 Getting Started

**Prerequisites**

- Node.js (v16+ recommended)
- npm or yarn

**Installation**
```bash
git clone https://github.com/your-username/react-todo-app.git
cd react-todo-app
npm install
npm start
```

## 📂 Project Structure
```text
/src
├── components/       # Reusable UI components
├── pages/            # Route-based pages
│   ├── Login.jsx     # Authentication page
│   ├── Dashboard.jsx # Main todo interface
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── styles/           # CSS/SCSS files
└── App.js            # Main app with routes
```

## 🔐 Authentication

- Formik for form handling and validation

- Simple JWT or session-based auth

- Protected routes for authenticated users

## 🎥 Animations
**Animate.css for:**

- Task entry/exit animations

- Page transitions

- Notification effects

## 💾 Data Persistence
**Todos persist between sessions using:**

- `localStorage` API

- Optional: `localForage` for enhanced storage

## 📝 Notes
- State management via React Context API

- Responsive design for all devices

- Accessibility best practices implemented

<div align="center"> <br> <sub>Built with ❤️ by <a href="https://github.com/Haniasahar">Haniya Sahar</a></sub> </div>