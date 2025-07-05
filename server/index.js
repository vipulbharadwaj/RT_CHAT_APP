require("dotenv").config();
const express = require("express");
const { createServer } = require("node:http");
const connectDB = require("./util/db");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const {userMap, setIO} = require('./util/socketStore');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

//Storing online Users

setIO(io);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  //console.log("Socket userID: ", userId);
  if (userId) userMap[userId] = socket.id;
 //console.log("Mapped userMap:", userMap);

  //Emit Online users to all users
 // console.log("Online Users: ", Object.keys(userMap));
  io.emit("getOnlineUsers", Object.keys(userMap));

  //handling disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userMap[userId];
    io.emit("getOnlineUsers", Object.keys(userMap));
  });

});

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to server");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

