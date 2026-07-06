# Face Match

>  A modern recreation of the classic Facemash experience. Users compare two randomly selected faces and vote on which one they find more attractive, with an Elo-based ranking system updating scores in real time.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success)

---

# Overview

Face Match is a modern, full-stack web application inspired by the original Facemash concept.

The application randomly presents two faces to users, allowing them to vote for the more attractive person. Every vote updates each participant's ranking using an Elo Rating System, creating a dynamic leaderboard based on community votes.

The project demonstrates real-world full-stack development, including image uploads, ranking algorithms, REST APIs, authentication, responsive design, and database management.

---

# Features

## User Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Encryption
- Protected Routes

---

## Image Management

- Upload Profile Images
- Image Storage
- Image Validation
- Automatic Image Display

---

## Face Voting

- Random Face Pair Generation
- One-Click Voting
- Prevent Self Voting
- Real-Time Vote Updates

---

## Ranking System

- Elo Rating Algorithm
- Global Leaderboard
- Highest Rated Profiles
- Automatic Ranking Updates

---

## Statistics

- Total Users
- Total Votes
- Ranking Position
- Win/Loss Record

---

## Responsive Design

- Mobile Friendly
- Tablet Support
- Desktop Optimized

---

# Tech Stack

## Frontend

- HTML
- CSS
- JavaScript


---

## Backend

- Node.js
- Express.js
- JWT Authentication
- Multer (Image Upload)

---

## Database

- MongoDB
- Mongoose

---

## Other Libraries

- bcrypt
- dotenv
- cors

---

# Project Structure

```
Face-Match/

├── frontend/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── index.html
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── README.md
└── .env.example
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/sabtain05/Face-Match.git

cd Face-Match
```

---

## Install Dependencies

### Backend

```bash
cd backend

npm install
```

---

## Frontend

If using plain HTML/CSS/JavaScript:

Simply open

```
index.html
```

or use

```bash
Live Server
```

If using React:

```bash
cd frontend

npm install
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# Run Server

```bash
npm run dev
```

---

# How It Works

1. Two random user profiles are displayed.
2. The visitor selects the more attractive face.
3. The winner gains Elo rating points.
4. The loser loses rating points.
5. Rankings update instantly.
6. Users continue voting with new face pairs.

---

# Future Improvements

- AI Face Detection
- Face Similarity Matching
- Daily Leaderboards
- User Profiles
- Follow System
- Comment System
- Social Sharing
- Dark Mode
- Filters
- Real-Time Rankings
- Achievement Badges
- Admin Dashboard

---

# Contributing

Contributions are welcome.

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# Disclaimer

This project is a personal educational recreation inspired by the original **Facemash** website created by **Mark Zuckerberg** in 2003.

It is intended solely for learning, demonstration, and portfolio purposes and is not affiliated with or endorsed by Meta or Facebook.

---

# Support

If you enjoyed this project, please consider giving it a ⭐ on GitHub.

---

# License

This project is licensed under the MIT License.

---

# Author

**Sabtain Ali**

GitHub: https://github.com/sabtain05


**A Sabtain Ali production**
