/* eslint-disable no-undef */
const express = require('express');
const app = express();

app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running...");
});

app.use((req, res) => {
    res.status(404).send("Not Found...")
})