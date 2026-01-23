# Explore API — Node.js & TypeScript

## 🚀 Overview

**Explore** is a scalable RESTful API inspired by platforms like Medium. It powers an application where users can authenticate, create blog posts, interact with content, and subscribe to memberships.

Although this started as my first Node.js + TypeScript API, built with guidance from Rettson’s tutorial. It has since been optimized and extended with new features. As my backend development experience has grown, the project has evolved to follow industry standards for clean architecture, security, and maintainability.

### 📘 Postman API Documentation

👉 https://documenter.getpostman.com/view/36760391/2sBXVckY58

### 🌍 Live API

👉 https://my-nodejs-typescript.onrender.com/api

---

## ✨ Key Features

### 🔐 Authentication

-   User registration
-   Email verification
-   Secure login (JWT-based)
-   Forgot & reset password flows

### 👨🏾‍💼 User Management

-   Fetch user profile
-   Update profile information
-   Change password
-   List users

### 📝 Blogging

-   Create blog posts
-   Comments and claps

### 💳 Subscriptions

-   Monthly & yearly membership plans

---

## 🧱 Tech Stack

| Layer          | Technology |
| -------------- | ---------- |
| Runtime        | Node.js    |
| Language       | TypeScript |
| Framework      | Express.js |
| Database       | MongoDB    |
| ODM            | Mongoose   |
| Authentication | JWT        |
| Email Service  | Brevo      |
| Hosting        | Render     |
| Storage        | Cloudinary |

---

## ⚙️ Getting Started

### Prerequisites

-   Node.js >= 18
-   MongoDB (local or Atlas)
-   npm

### Installation

```bash
git clone https://github.com/OgeHub/blog.git
cd blog
npm install
```

### Environment Variable

-   Check .env.example file
-   Create .env file in the root directory

### Running the App

```
npm run dev
```

Build for production

```
npm run build
npm start
```

## 🛣 Roadmap

-   ✅ Authentication & user management
-   ✅ Blog post creation
-   ✅ Comments & replies
-   ⏳ Claps
-   ⏳ Subscription billing (Stripe)
-   ⏳ Role-based access control
