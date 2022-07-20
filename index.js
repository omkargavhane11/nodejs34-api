const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const mentorRoutes = require("./Routes/mentor");
const studentRoutes = require("./Routes/student");

const app = express();
dotenv.config();

// connecting with mongo
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log("Mongo connected ✅");
    }
);

// middlewares
app.use(express.json());
app.use(cors());


// home route
app.get("/", (req, res) => {
    res.send("hello")
})


// routes
app.use("/mentor", mentorRoutes);
app.use("/student", studentRoutes);

app.listen(process.env.PORT, () => console.log(process.env.PORT));