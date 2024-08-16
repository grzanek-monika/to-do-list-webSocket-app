/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const socket = require('socket.io');
const app = express();

const tasks = [];
const server = app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running...");
});

app.use((req, res) => {
    res.status(404).send("Not Found...")
})

const io = socket(server);

io.on("connection", (socket) => {   
    socket.to(socket.id).emit("updateData", tasks);
    console.log("New user: ", socket.id);
    socket.on("addTask", (task) => {
        console.log("task: ", task);
        tasks.push(task);
        console.log("tasks: ", tasks);
        socket.broadcast.emit("addTask", task)
    });
    socket.on("removeTask", (id) => {
        const taskToRemove = tasks.findIndex((task) => task.id === id);
        tasks.splice(taskToRemove, 1);
        socket.broadcast.emit("removeTask", id);
    })
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} left`);
    });
})