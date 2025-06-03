# Glimsee - A Social Media Application

Glimsee is a dynamic social media platform designed for seamless connection and content sharing. Built with a robust MERN (MongoDB, Express.js, React, Node.js) stack, it offers a smooth user experience for interacting with friends, sharing thoughts, and discovering new content.
![Image](https://github.com/user-attachments/assets/1dbde6ee-b336-4292-b02a-907b53c699f3)

## ✨ Features

* **User Authentication:** Secure signup and login functionalities.
* **User Profiles:** Create and manage personal profiles with custom details, profile pictures, and bios.
* **Follow/Unfollow System:** Connect with other users by following and manage your network.
* **Post Creation:** Share text-based posts with the community.
* **Interactive Feed:** View a personalized feed of posts from users you follow.
* **Responsive Design:** Optimized for various screen sizes using Tailwind CSS.
* **State Management:** Efficient data handling with Redux Toolkit.

## 🛠️ Technologies Used

**Frontend:**
* **React:** A JavaScript library for building user interfaces.
* **Redux Toolkit:** For efficient and scalable state management.
* **React Router DOM:** For declarative routing.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

**Backend:**
* **Node.js:** JavaScript runtime environment.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL database for flexible data storage.
* **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
* **bcryptjs:** For secure password hashing.
* **jsonwebtoken:** For handling JSON Web Tokens (JWT) for authentication.
* **cookie-parser:** Middleware for parsing HTTP cookies.


## ⚙️ Local Development Setup
To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js) or Yarn
* MongoDB (running locally or a cloud service like MongoDB Atlas)
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/deepakarya01/Glimsee-app
cd Glimsee-app

### 2. Backend setup
cd backend
npm install

### 3. Run the backend
npm run dev

### 4. Frontend setup
cd frontend
npm install

### 5. Run the frontend
npm run dev

### 6. Create .env file in backend folder
MONGO_URI=yourmongodbconnectionstring
JWT_SECRET=yourjwtsecretkey
PORT=5000 Or # your desired port
CLOUDINARY_CLOUD_NAME=yourcloudinarycloudname
CLOUDINARY_API_KEY=yourcloudinaryapikey
CLOUDINARY_API_SECRET=yourcloudinarysecre
