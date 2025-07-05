# 🗨️ Real-Time Chat Application

A modern real-time chat application built with the **MERN stack (MongoDB, Express, React, Node.js)** and **Socket.IO**, featuring user authentication, responsive UI, real-time messaging, and media sharing.

---

## 🚀 Features

- 🔐 **User Authentication (JWT-based)**
- 💬 **Real-time One-to-One Messaging** (via Socket.IO)
- 🖼️ **Image Sharing Support**
- 🟢 **Online Status Indicators**
- 📱 **Fully Responsive UI** (Mobile + Desktop)
- 👤 **Profile Management**
- 🔔 **Unread Message Tracking**

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- React Context API (Auth + Chat management)
- Socket.IO-client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO

---

## 📁 Folder Structure

```
├── client/             # React frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── ...
├── server/             # Node/Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── ...
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### 2. Setup the Backend

```bash
cd server
npm install
```

- Create a `.env` file in `/server` with:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

- Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

---

## 🧪 Testing

- Login or Register a user
- Start chatting with any user
- Share images, view online status, and try switching between desktop and mobile views

---

## 📄 License

This project is licensed under the MIT License.  
Feel free to fork, clone, and enhance it!

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you would like to change.

---

## 🙋‍♂️ Author

**Vipul Chaudhary**  
[LinkedIn](https://www.linkedin.com/in/vipul-chaudhary-84576524a/) | [GitHub](https://github.com/vipulbharadwaj)

---
