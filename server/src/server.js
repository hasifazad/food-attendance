require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { init } = require("./models/db");

const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

init();


app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server running on port", port));
