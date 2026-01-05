# RESTful APIs Implementation (Node.js + Express + EJS + MySQL)

A simple **CRUD-based RESTful application** built with **Node.js**, **Express**, **EJS**, and **MySQL** to demonstrate implementing REST principles on top of a SQL database.

---

## Tech Stack

- **Node.js**
- **Express**
- **EJS** (server-side rendering)
- **MySQL** (via `mysql2`)
- **method-override** (to support PATCH/DELETE from HTML forms)
- **uuid / crypto** (to generate unique user IDs)

---

## Features

- View total number of users in DB (Home)
- List all users
- Add a new user
- Edit (rename) a user (password protected)
- Delete a user (password protected)

---

## Project Structure

```text
.
├── Pictures/
│   └── (app screenshots used in this README)
└── SQLCLASS/
    ├── index.js
    ├── package.json
    ├── package-lock.json
    ├── schema.sql
    └── views/
        └── (EJS templates)
```

---

## Database Setup (MySQL)

1. Create a database (your code uses **DELTA_APP**):
```sql
CREATE DATABASE DELTA_APP;
USE DELTA_APP;
```

2. Create the `user` table (from `SQLCLASS/schema.sql`):
```sql
CREATE TABLE user (
  ID VARCHAR(50) PRIMARY KEY,
  USERNAME VARCHAR(30) UNIQUE,
  EMAIL VARCHAR(50) UNIQUE NOT NULL,
  PASSWORD VARCHAR(50) NOT NULL
);
```

---

## Configure MySQL Connection

In `SQLCLASS/index.js`, the app connects using:

- `host: "localhost"`
- `user: "root"`
- `database: "DELTA_APP"`
- `password: "Prakash2005"` (example/hardcoded in repo)

Update these values to match your local MySQL credentials before running.

---

## Install & Run

```bash
cd SQLCLASS
npm install
node index.js
```

Server runs on:

- `http://localhost:8080`

---

## Routes (REST)

| Method | Route | Description |
|------:|------|-------------|
| GET | `/` | Home page: total users count |
| GET | `/user` | List all users |
| GET | `/user/add` | Form to add a user |
| POST | `/user` | Create user |
| GET | `/user/:id/edit` | Form to edit username |
| PATCH | `/user/:id` | Update username (password required) |
| GET | `/user/:id/delete` | Confirm delete |
| DELETE | `/user/:id` | Delete user (password required) |

---

## Demonstration (Screenshots)

This section uses the images in the `Pictures/` folder to show the full CRUD flow.

### 1) View all users in the database

This screen shows the list of users (coming from `GET /user`).

![All users in DB](Pictures/all%20usersin%20DB.png)

---

### 2) Open the "Add New User" form

Navigate to the add form (served by `GET /user/add`).

![Add new user form](Pictures/Add%20new%20user.png)

---

### 3) User successfully added

After submitting the form, the app creates the user using `POST /user` and redirects back to `/user`.

![Added a new user](Pictures/Added%20a%20new%20user.png)

---

### 4) Open the Edit User page

To rename a user, open the edit page (served by `GET /user/:id/edit`).

![Edit the user page](Pictures/Edit%20the%20user.png)

---

### 5) Rename / update username

The update happens via `PATCH /user/:id` (HTML form uses `method-override`).
The app checks the password before updating.

![Rename the user](Pictures/Rename%20the%20user.png)

---

### 6) Edited user shown in list

After editing, the app redirects back to `/user` and the updated username appears.

![Edited the user result](Pictures/edited%20the%20user.png)

---

### 7) Delete user confirmation / result

Deletion is password-protected and occurs through `DELETE /user/:id`.
After deleting, the user should no longer exist.

![User not exists after deleting](Pictures/user%20not%20exists%20after%20deleteing.png)

---

## Notes / Improvements (Optional)

- Move DB credentials to environment variables (`.env`) instead of hardcoding.
- Add validation + better error UI (instead of plain text responses).
- Add pagination / search on `/user`.

---

## License

NIL - Made by Prakash 