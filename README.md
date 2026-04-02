
```markdown
# 📖 Story Sharing Web Application

A full-stack web application where users can **write, read, like, and search stories**.  
Built using **Node.js, Express, MySQL, HTML, CSS, and JavaScript**.

---

## 🚀 Features

### 👤 Authentication
- User Registration
- User Login
- Session-based Authentication
- Logout functionality

### 📝 Story Management
- Add new stories
- View all stories (feed)
- Read full story
- Delete own stories

### ❤️ Like System
- Like / Unlike stories
- Prevent duplicate likes
- Real-time like count

### 🔍 Search Feature
- Search stories by:
  - Title
  - Author (username)
- Dynamic search results

### 🤖 AI Assistant
- Floating AI assistant button
- Opens chat window
- Available on all pages

### 👤 Profile Dashboard
- View user info
- View all posted stories
- Delete stories

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Custom Styling)
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Other Tools
- express-session (Authentication)
- Fetch API (Client-Server communication)

---

## 📂 Project Structure

```
```

project/
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── assistant.js
│   │   ├── home.js
│   │   ├── profile.js
│   │   ├── profileDashboard.js
│   │
│   ├── addStory.html
│   ├── home.html
│   ├── index.html
│   ├── login.html
│   ├── profile.html
│   ├── profileDashboard.html
│   ├── register.html
│   └── viewStory.html
│
├── routes/
│   ├── auth.js
│   ├── stories.js
│   └── user.js
│
├── db.js
├── server.js
└── README.md

```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/vipulsah1701-blip/InkShare
cd InkShare
````

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Database (MySQL)

Create database:

```sql
CREATE DATABASE storydb;
```

---

### 4️⃣ Create Tables

```sql
-- USERS TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STORIES TABLE
CREATE TABLE stories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- LIKES TABLE
CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  story_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, story_id),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);
```
---

### 5️⃣ Configure Database Connection

Edit `db.js`:

```js
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "storydb"
});

db.connect(err => {
  if (err) throw err;
  console.log("Database Connected");
});

module.exports = db;
```

---

### 6️⃣ Run Server

```bash
node server.js
```

---

### 7️⃣ Open in Browser

```text
http://localhost:3000
```

---

## 🔄 API Endpoints

### 🔐 Auth Routes

* `POST /auth/register`
* `POST /auth/login`
* `GET /auth/logout`

### 📚 Story Routes

* `GET /stories/all`
* `GET /stories/:id`
* `POST /stories/add`
* `DELETE /stories/:id`
* `POST /stories/like/:id`
* `GET /stories/search?q=`

### 👤 User Routes

* `GET /user/me`
* `GET /user/:id`

---

## 🧠 How It Works

1. User registers and logs in
2. Session is created using `express-session`
3. User can:

   * Add stories
   * Like stories
   * Search stories
4. Data is stored in MySQL database
5. Frontend communicates using Fetch API

---

## 🔐 Security Features

* Session-based authentication
* Protected routes
* Unique constraint on likes (prevents duplicate likes)

---

## 📸 Screenshots (Add your images here)

* Login Page
* Story Feed
* Add Story
* Profile Page
* Search Feature
* AI Assistant

---

## 🎯 Future Improvements

* Comment system
* Edit story feature
* Image upload
* Dark/Light theme toggle
* Real AI integration (ChatGPT API)

---

## 👨‍💻 Author

**Vipul Sah**

---

## 📜 License

This project is for educational purposes.

---
