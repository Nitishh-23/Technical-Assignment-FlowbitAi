# 📁 FlowbitAI Technical Assignment

This project is a full-stack implementation of a **multi-tenant Role-Based Access Control (RBAC)** system integrated with Flowbit AI. The system is developed using **Next.js (React)** for the frontend and **Node.js + Express** for the backend, focusing on user authentication, tenant isolation, and permissions-based access.

---

## 🧰 Tech Stack

* **Frontend:** React (via Next.js), Tailwind CSS
* **Backend:** Node.js, Express.js
* **Authentication:** JWT-based login
* **RBAC:** Custom middleware logic
* **Other Tools:** Postman, Git, GitHub

---

## 🚀 Features

* Multi-tenant user authentication (Sign up, Login)
* JWT-based session management
* Role-based permission engine (Admin, User, Viewer, etc.)
* React + Tailwind UI for dashboard and access control views
* API endpoints with middleware enforcement for authorization
* Supports user actions like reading data, adding/editing based on roles
* Codebase is modular, and easy to extend or integrate
* Handles simulated data without requiring actual database

---

## 🖼️ Architecture Diagram

```text
                        +----------------------+
                        |      Frontend        |
                        |  Next.js + Tailwind  |
                        +----------+-----------+
                                   |
                                   | API Calls (AJAX/Fetch)
                                   v
                        +----------+-----------+
                        |         Backend       |
                        |  Node.js + Express.js |
                        +----------+-----------+
                                   |
                +------------------+------------------+
                |                                     |
         +------+-------+                    +--------+--------+
         |  JWT Auth     |                    |  RBAC Middleware |
         +--------------+                    +------------------+
```

---

## 📂 Project Structure

```text
FlowbitDirectory/
├── backend/                      # Express server
│   ├── controllers/             # Role and tenant controllers
│   ├── middleware/              # JWT + RBAC auth
│   ├── routes/                  # Auth & permission routes
│   ├── app.js                   # Main app config
│
├── frontend/                    # Next.js client
│   ├── components/              # React components
│   ├── pages/                   # Pages (Home, Dashboard, etc.)
│   └── public/                  # Static assets
│
├── .gitignore
├── README.md                   # Project overview
└── package.json
```

---

## 📜 Setup Instructions

```bash
# 1. Clone the repository
$ git clone https://github.com/Nitishh-23/Technical-Assignment-FlowbitAi

# 2. Navigate into frontend and backend folders separately
$ cd frontend
$ npm install
$ cd ../backend
$ npm install

# 3. Create a .env file in each folder if applicable

# 4. Run both servers (can use concurrently)
$ npm run dev      # In both frontend and backend
```

---

## 📧 Contact

**Nitish Agrawal**
[GitHub](https://github.com/Nitishh-23)
[Email](mailto:nitishagrawal2022@gmail.com)

---

## 📝 Notes

* The RBAC permissions are currently simulated with mock data.
* No database or Docker required to run the app.
* Flowbit integration is simulated as per the assignment instructions.

---

