const express = require("express")
const app = express();
require('dotenv').config()
const mongoose = require("mongoose");
const cors = require("cors");
const imageRoutes = require("./routes/image.routes");
const authRoutes = require("./routes/auth.routes");
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);



// connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

// start the server to listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});