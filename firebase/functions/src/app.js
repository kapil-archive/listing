const express = require("express");
const cors = require("cors");

const imageRoutes = require("./routes/image.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.status(200).send("Firebase API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

module.exports = app;
