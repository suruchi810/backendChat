const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors({
    origin: "http://localhost:5173", // Correct the origin to match your front-end
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connection successfully");
}).catch((err) => {
    console.log(err);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:5173", // Correct the origin to match your front-end
        methods: ["GET", "POST"],
        credentials: true // Correct the property name to credentials
    }
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
    });
});
